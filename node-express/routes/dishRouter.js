const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/') //chain all get, put, post, delete in this
//for example if I mistype the dishes to dish in app.get in index.js 
// this will help avoid miss leading
.all((req,res,next) => {
    //để all mà không specify get put post
    //=> đoạn mã này sẽ được thực hiện đầu tiên
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //trùng với next ở trên, tiếp tục tìm kiếm thêm các miêu tả ở dưới mà khớp với "dishes" ở trên
    //ví dụ ở đây se gọi tiếp đến dòng 21, req và res sẽ tiếp tục được truyền vào tham số ở dòng 21
    //vì vậy nếu req và res bị sửa đổi ở hàm này thì nó sẽ tiếp tục được truyền vào hàm ở dòng 21
})
.get((req,res,next) => {
    res.end('Will send all the dishes to you!');
})
.post((req,res,next) => {
    //carry information in the body of the message
    res.end('Will add the dish: ' + req.body.name + 
    ' with details: ' + req.body.description);
    //body như một đối tượng, với các thuộc tính ví dụ name hay description
})
.put((req,res,next) => {
    res.statusCode = 403; //forbidden
    //put on "dishes" doesn't make sense
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
    res.end('Deleting all the dishes!');
});

module.exports = dishRouter;