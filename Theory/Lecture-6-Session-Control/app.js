const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'replace-this-secret-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const page = (title, content) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>body{font-family:system-ui,sans-serif;max-width:780px;margin:40px auto;padding:0 20px;line-height:1.55;color:#172033}nav{display:flex;gap:14px;flex-wrap:wrap;margin:20px 0}a{color:#075ad9;font-weight:600}section{border:1px solid #dbe3ef;border-radius:10px;padding:18px;margin:16px 0}input,button{font:inherit;padding:8px;margin:4px}button{background:#075ad9;color:white;border:0;border-radius:5px;cursor:pointer}.note{background:#eef6ff;padding:12px}</style>
</head><body><h1>Lecture 6: Session Control</h1><nav><a href="/">Home</a><a href="/session/profile">Session profile</a><a href="/cookie/read">Read cookie</a><a href="/welcome?user=Alice&role=student">Query-string example</a></nav>${content}</body></html>`;

app.get('/', (req, res) => {
  const username = req.session.username;
  res.send(page('Session Control Demo', `
    <p class="note">HTTP is stateless. This app demonstrates three ways to carry state: server-side sessions, browser cookies, and query strings.</p>
    <section><h2>1. Server-side session</h2><p>${username ? `Signed in as <strong>${escapeHtml(username)}</strong>.` : 'No active session.'}</p>
      <form action="/session/login" method="get"><input name="username" required placeholder="Your name"><button>Start session</button></form>
      <p><a href="/session/profile">View session profile</a> · <a href="/session/logout">End session</a></p></section>
    <section><h2>2. Cookie</h2><form action="/cookie/set" method="get"><input name="theme" value="dark" required><button>Set preference cookie</button></form>
      <p><a href="/cookie/read">Read cookie</a> · <a href="/cookie/delete">Delete cookie</a></p></section>
    <section><h2>3. Query string</h2><form action="/welcome" method="get"><input name="user" placeholder="Name" required><input name="role" placeholder="Role" value="student"><button>Send query</button></form></section>
  `));
});

app.get('/session/login', (req, res) => {
  const username = String(req.query.username || '').trim();
  if (!username) return res.status(400).send(page('Missing name', '<p>Please provide a username.</p>'));
  req.session.username = username;
  res.redirect('/session/profile');
});

app.get('/session/profile', (req, res) => {
  if (!req.session.username) return res.status(401).send(page('Session profile', '<p>No session found. <a href="/">Start a session</a>.</p>'));
  res.send(page('Session profile', `<section><h2>Welcome, ${escapeHtml(req.session.username)}</h2><p>This value is stored on the server. Your browser keeps only a signed session-ID cookie.</p><a href="/session/logout">Log out</a></section>`));
});

app.get('/session/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).send(page('Error', '<p>Could not destroy the session.</p>'));
    res.clearCookie('connect.sid');
    return res.send(page('Logged out', '<p>Session destroyed successfully. <a href="/">Return home</a>.</p>'));
  });
});

app.get('/cookie/set', (req, res) => {
  const theme = String(req.query.theme || 'light');
  res.cookie('theme', theme, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.send(page('Cookie set', `<p>Preference cookie set to <strong>${escapeHtml(theme)}</strong>. <a href="/cookie/read">Read it</a>.</p>`));
});

app.get('/cookie/read', (req, res) => res.send(page('Cookie value', `<p>Theme cookie: <strong>${escapeHtml(req.cookies.theme || 'not set')}</strong>.</p><a href="/">Return home</a>`)));
app.get('/cookie/delete', (req, res) => { res.clearCookie('theme'); res.send(page('Cookie deleted', '<p>Theme cookie deleted. <a href="/">Return home</a>.</p>')); });

app.get('/welcome', (req, res) => {
  const user = req.query.user || 'Guest';
  const role = req.query.role || 'visitor';
  res.send(page('Query string', `<section><h2>Welcome ${escapeHtml(user)}</h2><p>Your role is <strong>${escapeHtml(role)}</strong>.</p><p>The values came from the visible URL query string, so do not use this method for passwords or other sensitive data.</p></section>`));
});

app.listen(PORT, () => console.log(`Lecture 6 app running at http://localhost:${PORT}`));
