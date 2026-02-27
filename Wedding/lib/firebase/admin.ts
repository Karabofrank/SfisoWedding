import admin from 'firebase-admin';

// This module initializes the Firebase Admin SDK exactly once per invocation
// and exports the Firestore/Storage instances used throughout the app.
//
// The service account credentials are expected as a JSON string in the
// FIREBASE_SERVICE_ACCOUNT environment variable. When deploying to Vercel you
// can either paste the raw JSON into the dashboard or store a base64-encoded
// version and decode it here.

// lazily initialize the admin app so that SSR builds without env vars
// (e.g. during `next build`) do not crash. If the service account isn't
// provided we create a minimal dummy credential that satisfies the SDK but
// won't actually be used at runtime.

let _app: admin.app.App | undefined;
function getApp() {
  if (_app) return _app;
  if (admin.apps.length) {
    _app = admin.app();
    return _app;
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    // don't attempt to initialize when no credentials are present; this
    // keeps builds and local dev (without env vars) from throwing.
    return undefined as any;
  }

  let options: admin.AppOptions = {};
  try {
    // Handle both raw JSON and base64-encoded credentials
    let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson.startsWith('{')) {
      // Assume it's base64-encoded; decode it first
      serviceAccountJson = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    options.credential = admin.credential.cert(serviceAccount as any);
  } catch (err) {
    console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err);
  }

  if (process.env.FIREBASE_STORAGE_BUCKET) {
    options.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  }

  _app = admin.initializeApp(options);
  return _app;
}

function ensureApp(): admin.app.App {
  const app = getApp();
  if (!app) {
    throw new Error('Firebase admin SDK has not been initialized. ' +
      'Set FIREBASE_SERVICE_ACCOUNT in your environment.');
  }
  return app;
}

export function getDb() {
  const app = getApp();
  if (!app) {
    // Return a lightweight stub for local/dev runs when credentials are
    // not provided. This lets the app start so you can smoke-test UI/pages
    // without a real Firestore instance. The stub returns empty results
    // and no-ops on writes.
    const emptySnapshot = { empty: true, docs: [] };
    const stubCollection = () => ({
      where: () => ({ limit: () => ({ get: async () => emptySnapshot }) }),
      limit: () => ({ get: async () => emptySnapshot }),
      orderBy: () => ({ get: async () => ({ docs: [] }) }),
      add: async () => ({ id: 'stub' }),
    });
    return { collection: stubCollection } as any;
  }
  return ensureApp().firestore();
}

export function getBucket() {
  const app = getApp();
  if (!app) {
    // stubbed bucket with minimal API used by the app
    return {
      file: () => ({
        save: async () => {},
        makePublic: async () => {},
      }),
    } as any;
  }
  return ensureApp().storage().bucket();
}

// helper for server timestamps
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
