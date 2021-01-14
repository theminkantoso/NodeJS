const express = require('express'); // đã nằm trong node_modules
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/dishes', (req,res,next) => {
    //để all mà không specify get put post
    //=> đoạn mã này sẽ được thực hiện đầu tiên
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //trùng với next ở trên, tiếp tục tìm kiếm thêm các miêu tả ở dưới mà khớp với "dishes" ở trên
    //ví dụ ở đây se gọi tiếp đến dòng 21, req và res sẽ tiếp tục được truyền vào tham số ở dòng 21
    //vì vậy nếu req và res bị sửa đổi ở hàm này thì nó sẽ tiếp tục được truyền vào hàm ở dòng 21
});

app.get('/dishes', (req,res,next) => {
    res.end('Will send all the dishes to you!');
});

app.post('/dishes', (req,res,next) => {
    //carry information in the body of the message
    res.end('Will add the dish: ' + req.body.name + 
    ' with details: ' + req.body.description);
    //body như một đối tượng, với các thuộc tính ví dụ name hay description
});

app.put('/dishes', (req,res,next) => {
    res.statusCode = 403; //forbidden
    //put on "dishes" doesn't make sense
    res.end('PUT operation not supported on /dishes');
});

app.delete('/dishes', (req,res,next) => {
    res.end('Deleting all the dishes!');
});

app.get('/dishes/:dishId', (req,res,next) => {
    res.end('Will send details of the dish: '
        + req.params.dishId + ' to you!');
});

app.post('/dishes/:dishId', (req,res,next) => {
    res.statusCode = 403; 
    res.end('POST operation not supported on /dishes/' 
        + req.params.dishId);
});

app.put('/dishes/:dishId', (req,res,next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' 
        + req.body.description);
});

app.delete('/dishes/:dishId', (req,res,next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});

app.use(express.static(__dirname+ '/public'));
//phục vụ tệp tin tĩnh từ dirname + public => tìm từ file public trong thư
//mục gốc để phục vụ
//nếu chỉ để localhost:3000 sẽ mặc định phục vụ file index.html

//ở đây chưa chỉ ra cách handle file không tồn tại nên nếu gặp sẽ sử dụng 
//app use "This is an Express Server" ở dưới

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