# Lecture 6: Session Control

This Express application demonstrates the three session-control mechanisms from Lecture 6:

| Mechanism | Example route | Where data is stored |
| --- | --- | --- |
| Session | `/session/login?username=Amriit` | Server-side session store |
| Cookie | `/cookie/set?theme=dark` | Browser cookie |
| Query string | `/welcome?user=Alice&role=student` | URL |

## Run the project

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## What each route demonstrates

- `/session/login`, `/session/profile`, and `/session/logout` create, read, and destroy an Express session.
- `/cookie/set`, `/cookie/read`, and `/cookie/delete` set, read, and remove a preference cookie.
- `/welcome?user=Alice&role=student` reads values with `req.query`.

## Security notes

- The session ID and preference cookie use `httpOnly` and `sameSite: 'lax'`.
- In production, set `NODE_ENV=production` so cookies use `secure: true` and are sent only over HTTPS.
- Set a long, private `SESSION_SECRET` environment variable before deploying.
- Express's default in-memory session store is appropriate only for this demonstration; use a persistent store such as Redis in production.
- Never place passwords, tokens, or other private data in query strings.
