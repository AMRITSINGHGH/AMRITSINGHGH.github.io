const http = require('http');

const users = [
    { id: 1, name: 'Aarav Sharma', age: 25, city: 'Mumbai' },
    { id: 2, name: 'Priya Patel', age: 28, city: 'Delhi' },
    { id: 3, name: 'Rahul Kumar', age: 30, city: 'Bangalore' },
    { id: 4, name: 'Sneha Reddy', age: 24, city: 'Hyderabad' },
    { id: 5, name: 'Vikram Singh', age: 35, city: 'Jaipur' }
];

const server = http.createServer((req, res) => {
    const url = req.url;
    
    // Home page
    if (url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Indian Users API</h1><p>Try: /users, /users/1</p>`);
    }
    // Get all users
    else if (url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: users }));
    }
    // Get user by ID
    else if (url.startsWith('/users/')) {
        const id = parseInt(url.split('/')[2]);
        const user = users.find(u => u.id === id);
        
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: user }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'User not found' }));
        }
    }
    // 404
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Route not found' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` GET /users - All users`);
    console.log(` GET /users/1 - Get user by ID`);
});