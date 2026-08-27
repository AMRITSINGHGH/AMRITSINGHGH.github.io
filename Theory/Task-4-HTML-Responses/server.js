const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Init
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

const getTasks = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveTasks = (tasks) => fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    // Routes
    if (path === '/' && req.method === 'GET') {
        const tasks = getTasks();
        let html = `
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><title>Tasks</title>
            <style>
                body { font-family: Arial; max-width: 500px; margin: 50px auto; }
                .task { padding: 10px; border-bottom: 1px solid #ddd; }
                .done { text-decoration: line-through; color: #999; }
                a { margin: 0 5px; }
            </style>
            </head>
            <body>
            <h1> Tasks</h1>
            <a href="/new">+ Add</a>
            ${tasks.length === 0 ? '<p>No tasks</p>' : tasks.map(t => `
                <div class="task">
                    <span class="${t.done ? 'done' : ''}">${escapeHtml(t.title)}</span>
                    <a href="/toggle?id=${t.id}">[${t.done ? '↩' : '✓'}]</a>
                    <a href="/delete?id=${t.id}" onclick="return confirm('Delete?')">[✕]</a>
                </div>
            `).join('')}
            </body>
            </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
    else if (path === '/new' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><title>New Task</title></head>
            <body>
                <h2>New Task</h2>
                <form method="POST" action="/new">
                    <input type="text" name="title" required><br>
                    <button type="submit">Save</button>
                </form>
                <a href="/">← Back</a>
            </body>
            </html>
        `);
    }
    else if (path === '/new' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = querystring.parse(body);
            const title = String(data.title || '').trim();

            if (!title) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Task title is required');
                return;
            }

            const tasks = getTasks();
            tasks.push({ id: Date.now(), title, done: false });
            saveTasks(tasks);
            res.writeHead(302, { Location: '/' });
            res.end();
        });
    }
    else if (path === '/toggle' && req.method === 'GET') {
        const tasks = getTasks();
        const taskId = Number(parsedUrl.query.id);
        const task = tasks.find(t => Number(t.id) === taskId);
        if (task) task.done = !task.done;
        saveTasks(tasks);
        res.writeHead(302, { Location: '/' });
        res.end();
    }
    else if (path === '/delete' && req.method === 'GET') {
        let tasks = getTasks();
        const taskId = Number(parsedUrl.query.id);
        tasks = tasks.filter(t => Number(t.id) !== taskId);
        saveTasks(tasks);
        res.writeHead(302, { Location: '/' });
        res.end();
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});