# Creator OS Premium v2

Professional React + Firebase creator content calendar.

## Features
- Google Login
- Firestore cloud sync
- Dashboard
- Calendar view
- Kanban board
- List/search/filter
- Platform-wise status
- Same status all platforms
- Short/Full video
- Caption, thumbnail, script, video ready indicators
- Drive/script links
- Dark mode
- PWA manifest

## Firebase Rules

Firebase Console > Firestore > Rules:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/videos/{videoId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deploy
Upload/replace all files in GitHub repository. Vercel will auto-deploy from main branch.
