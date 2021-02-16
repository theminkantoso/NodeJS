const express = require('express');
const cors = require('cors');
const app = express();

//all origins this server accept
var whitelist = var whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://Admin:3001']
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) { 
        //if incoming request header contains the origin field
        //then check if that origin presents in whitelist
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
        //not return by my serverside
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);