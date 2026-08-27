const http = require('http');

const server = http.createServer((req, res) => {
    // Get the URL and method
    const url = req.url;
    const method = req.method;

    // Route: Home page
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Home Page</h1>
            <p>Welcome to the Home Page</p>
            <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/api">API</a></li>
            </ul>
        `);
    }
    // Route: About page
    else if (url === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>About Page</h1>
            <p>This is the About page</p>
            <a href="/">Go back to Home</a>
        `);
    }
    // Route: Contact page
    else if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Contact Page</h1>
            <p>Email: hello@example.com</p>
            <a href="/">Go back to Home</a>
        `);
    }
    // Route: API endpoint (JSON response)
    else if (url === '/api' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'API Response',
            routes: ['/', '/about', '/contact', '/api'],
            timestamp: new Date().toISOString()
        }));
    }
    // 404 - Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist</p>
            <a href="/">Go back to Home</a>
        `);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
    console.log(` Available routes:`);
    console.log(`   - http://localhost:${PORT}/`);
    console.log(`   - http://localhost:${PORT}/about`);
    console.log(`   - http://localhost:${PORT}/contact`);
    console.log(`   - http://localhost:${PORT}/api`);
});