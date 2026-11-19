# Backend (Express + TypeScript + MongoDB)

    npm install
    npm run dev          # http://localhost:5000/api

Admin ID and password live in `.env` (ADMIN_ID / ADMIN_PASSWORD). The account is created on first start,
and the password re-synced from `.env` on every start.

## Flow
1. /login  -> POST /api/auth/login  { adminId, password }  -> cookie + token, then client goes to /admin
2. /admin sidebar:
   - Add new event  -> POST /api/events   JSON { date, description }
   - Add new media  -> POST /api/media    multipart: photos (files), videos (files)
   - Add new topic  -> POST /api/topics   multipart: title, description, photos (files)
3. Website:
   - /programs (कार्यक्रम) -> GET /api/programs   (events + topics, newest first; ?type=event|topic&page=&limit=)
   - /gallery  (ग्यालरी)   -> GET /api/gallery    (media; ?type=photo|video)

Edit / delete (admin): PUT|DELETE /api/events/:id, /api/topics/:id, /api/media/:id
For topic/media edits, send new files in the same fields and list files to drop in `removePhotos` / `removeVideos`
(JSON array of the URLs returned by the API).

Uploaded files are saved in ./uploads and served at /uploads/... (back up this folder).
