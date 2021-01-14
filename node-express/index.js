const express = require('express'); // đã nằm trong node_modules
const http = require('http');
const morgan = require('morgan');

const hostname = 'localhost';
const port = 3000;
const app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname+ '/public'));
//phục vụ tệp tin tĩnh từ dirname + public => tìm từ file public trong thư
//mục gốc để phục vụ
//nếu chỉ để localhost:3000 sẽ mặc định phục vụ file index.html

//ở đây chưa chỉ ra cách handle file không tồn tại nên nếu gặp sẽ sử dụng 
//app use "THis is an Express Server" ở dưới

app.use((req,res, next) => {
    //console.log.apply(req.headers);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html');
}); //next(optional) gọi thêm middleware

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
});