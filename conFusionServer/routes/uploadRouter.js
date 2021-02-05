const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({ //enable define storage
    destination: (req, file, cb) => {
        //request, file processed by multer, callback
        //error - destination folder
        cb(null, 'public/images');//destination configured as a function
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)//filename for the specific uploaded file
        //gives us the original name of the file from the client side that has been uploaded
        //he file is saved on the server side, the file will be given exactly the same name as the original name of the file that has been uploaded
        //I can know that I'm uploading exactly the same file and on the server side when the file is uploaded will stored with the same name. 
        // if you don't configure this then, multer by default will give some random string as the name of the file with no extensions. 
    }
});

//check file type
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});
//two function defined above

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    //usage upload function above, single(/formField/) => only a single file
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
    //req.file object will also contain the path to the file in there and that path 
    //can be used by the client to configure any place where it needs to know the location of this image file
    //so you can include the url of the image in the json file
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;