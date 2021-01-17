const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

//mongoDB
dishRouter.route('/') 
.get((req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes); //send back a respond to the server
    }, (err) => next(err))
    .catch((err) => next(err)); //pass the error to the overall error handling
})
.post((req,res,next) => {
   Dishes.create(req.body)
   .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); //send back a respond to the server
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put((req,res,next) => {
    res.statusCode = 403; //forbidden
    //put on "dishes" doesn't make sense
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId') 
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); //send back a respond to the server
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post((req,res,next) => {
    res.statusCode = 403; 
    res.end('POST operation not supported on /dishes/' 
        + req.params.dishId);
})
.put((req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true //return new updated dish
    })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); //send back a respond to the server
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;

// dishRouter.route('/') //chain all get, put, post, delete in this
// //for example if I mistype the dishes to dish in app.get in index.js 
// // this will help avoid miss leading
// .all((req,res,next) => {
//     //để all mà không specify get put post
//     //=> đoạn mã này sẽ được thực hiện đầu tiên
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next(); //trùng với next ở trên, tiếp tục tìm kiếm thêm các miêu tả ở dưới mà khớp với "dishes" ở trên
//     //ví dụ ở đây se gọi tiếp đến dòng 21, req và res sẽ tiếp tục được truyền vào tham số ở dòng 21
//     //vì vậy nếu req và res bị sửa đổi ở hàm này thì nó sẽ tiếp tục được truyền vào hàm ở dòng 21
// })
// .get((req,res,next) => {
//     res.end('Will send all the dishes to you!');
// })
// .post((req,res,next) => {
//     //carry information in the body of the message
//     res.end('Will add the dish: ' + req.body.name + 
//     ' with details: ' + req.body.description);
//     //body như một đối tượng, với các thuộc tính ví dụ name hay description
// })
// .put((req,res,next) => {
//     res.statusCode = 403; //forbidden
//     //put on "dishes" doesn't make sense
//     res.end('PUT operation not supported on /dishes');
// })
// .delete((req,res,next) => {
//     res.end('Deleting all the dishes');
// });

// dishRouter.route('/:dishId') 
// .get((req,res,next) => {
//     res.end('Will send details of the dish: '
//         + req.params.dishId + ' to you!');
// })
// .post((req,res,next) => {
//     res.statusCode = 403; 
//     res.end('POST operation not supported on /dishes/' 
//         + req.params.dishId);
// })
// .put((req,res,next) => {
//     res.write('Updating the dish: ' + req.params.dishId + '\n');
//     res.end('Will update the dish: ' + req.body.name + ' with details: ' 
//         + req.body.description);
// })
// .delete((req,res,next) => {
//     res.end('Deleting dish: ' + req.params.dishId);
// });

