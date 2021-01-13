const http = require('http');
const fs = require('fs'); //file system module
//read and write file from your local file system
const path = require('path'); //path code module
//specify path specific file
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log("Request for " + req.url + ' by method ' + req.method);

    // res.statusCode = 200; //200: everything is ok
    // res.setHeader('Content-Type', 'text/html');
    // res.end('<html><body><h1>Hello, World!</h1></body></html>'); 
    //send back from server

    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') fileUrl = '/index.html'; //default
        else fileUrl = req.url;
        var filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.statusCode = 404; //ko ton tai file
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1>Error 404: ' + 
                    fileUrl + ' not found</h1></body></html>');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
                //đọc tập tin từ filepath, đổi nó thành dòng byte, dẫn nó vào body của response 
            })
        } 
        else { //not html
            res.statusCode = 404; //ko ton tai file
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Error 404: ' + 
                fileUrl + ' not an HTML file</h1></body></html>');
            return;
        }
    } 
    else { //not GET
        res.statusCode = 404; //ko ton tai file
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error 404: ' + 
            req.method + ' not supported</h1></body></html>');
        return;
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`); //$ hiển thị giá trị 
})