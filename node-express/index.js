const express = require('express'); // đã nằm trong node_modules
const http = require('http');

const hostname = 'localhost';
const port = 3000;
const app = express();

app.use((req,res, next) => {
    console.log.apply(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html');
}); //next(optional) gọi thêm middleware

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});