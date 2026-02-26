# Wedding App (Firebase Migration)

This repository was originally built on Supabase. It has been migrated to use
Firebase (Firestore + Cloud Storage) for persistence. The following notes will
help you continue development and deploy to Vercel.

## ✅ What was changed

- Removed Supabase client code (`lib/supabase/*`) and replaced with
  `lib/firebase/admin.ts` (server) and `lib/firebase/client.ts` (optional
  browser-side).
- Updated all server actions in `app/actions.ts` to read/write Firestore and
  upload files to Firebase Storage.
- Added new NPM dependencies:
  `firebase` and `firebase-admin`.
- Cleaned up `package.json` and removed Supabase packages.
- Added helpful migration script under `scripts/migrate_supabase_to_firebase.js`.

## 📦 Environment variables

Create a `.env.local` file (or configure these in Vercel) with the following
values. An example file named `.env.example` is included in the repo; copy it
to `.env.local` and fill in your real credentials. The `.env.*` files are
ignored by Git for security.

```env
# Admin SDK - paste the JSON object from your service account
FIREBASE_SERVICE_ACCOUNT='{"type": ... }'
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
FIREBASE_PROJECT_ID=your-project-id

# Client SDK (optional but safe to have)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> 🔐 Store `FIREBASE_SERVICE_ACCOUNT` securely; on Vercel you can add it via
> the dashboard or `vercel env add` command. Consider base64-encoding the JSON
> if you run into quoting issues.

## 🚀 Running locally

1. Install dependencies:
   ```bash
   cd Wedding
   pnpm install
   ```
2. Start dev server:
   ```bash
   pnpm dev
   ```
3. (Optional) migrate existing Supabase data:
   ```bash
   node scripts/migrate_supabase_to_firebase.js
   ```

## 🗃 Firestore structure

- `guests` collection – each doc represents an RSVP (`name`, `attending`, etc.)
- `photos` collection – metadata for uploaded images (`file_url`, `uploaded_by`)

## 📤 Deploying to Vercel

1. Install the Vercel CLI if you haven't already: `npm install -g vercel`.
2. Run `vercel` in the `Wedding` directory and follow the prompts to link your
   project.
3. Add the environment variables from the section above to the project
   settings, or use the CLI:
   ```bash
   vercel env add FIREBASE_SERVICE_ACCOUNT production
   vercel env add FIREBASE_STORAGE_BUCKET production
   # ...repeat for the other vars
   ```
4. When everything is configured, deploy with `vercel --prod`.

> **Tip:** during the build process you may see a warning about multiple
> lockfiles (`package-lock.json` vs `pnpm-lock.yaml`). Vercel will still
> build your project correctly but you can silence the message by either
> deleting the unused lockfile or adding a `turbopack.root` entry to
> `next.config.mjs` pointing at the correct directory.

---

Feel free to extend the client SDK file (`lib/firebase/client.ts`) if you
later need to fetch data from the browser. If you need basic security rules
for Firestore/Storage, the following is a good starting point:

```js
// firestore.rules
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      match /guests/{doc} {
         allow read: if true;                     // public read
         allow write: if request.auth == null;    // server code only
      }
      match /photos/{doc} {
         allow read: if true;
         allow write: if request.auth == null;
      }
   }
}

// storage.rules
rules_version = '2';
service firebase.storage {
   match /b/{bucket}/o {
      match /wedding-photos/{allPaths=**} {
         allow read: if true;                    // public gallery
         allow write: if request.auth == null;   // server uploads only
      }
   }
}
```

Enjoy your Firebase‑backed wedding site! 🎉