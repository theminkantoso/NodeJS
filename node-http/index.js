const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log(req.headers);

    res.statusCode = 200; //200: everything is ok
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>Hello, World!</h1></body></html>'); 
    //send back from server
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`); //$ hiển thị giá trị 
})