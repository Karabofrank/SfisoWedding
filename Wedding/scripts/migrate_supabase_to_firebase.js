/*
Simple script to copy data from Supabase tables (guests, photos) into Firestore.
Run with `node scripts/migrate_supabase_to_firebase.js` after setting the
corresponding environment variables. You'll need the old SUPABASE_URL and
SUPABASE_SERVICE_KEY in your env, along with the Firebase service account
credentials.
*/

// This migration script is optional. It will only run if you have the
// `@supabase/supabase-js` package installed and set the SUPABASE_* env vars.
// If you removed Supabase from the project, you can keep this script as a
// reference or delete it.

let createClient;
try {
  // try to require the supabase client; if it's not installed, print a
  // helpful message and exit without error so CI/builds don't fail.
  createClient = require('@supabase/supabase-js').createClient;
} catch (err) {
  console.error('Optional migration script: @supabase/supabase-js not installed.');
  console.error('To run migration, install it: npm i -D @supabase/supabase-js');
  process.exit(0);
}

const admin = require('firebase-admin');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY to run this script');
  process.exit(1);
}

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Set FIREBASE_SERVICE_ACCOUNT to run this script');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

async function migrate() {
  console.log('Fetching guests from Supabase');
  const { data: guests } = await supabase.from('guests').select('*');
  if (guests) {
    const batch = db.batch();
    guests.forEach((g) => {
      const ref = db.collection('guests').doc();
      batch.set(ref, { ...g, created_at: g.created_at || admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    console.log(`migrated ${guests.length} guests`);
  }

  console.log('Fetching photos from Supabase');
  const { data: photos } = await supabase.from('photos').select('*');
  if (photos) {
    const batch = db.batch();
    photos.forEach((p) => {
      const ref = db.collection('photos').doc();
      batch.set(ref, { ...p, created_at: p.created_at || admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    console.log(`migrated ${photos.length} photos`);
  }
}

migrate().then(() => console.log('done')).catch(console.error);
