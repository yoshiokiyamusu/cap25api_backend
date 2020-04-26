const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const multer = require('multer');

//const uuidv4 = require('uuid/v4')
const feedRoutes = require('./routes/feed');

const app = express();
/*
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
       // cb(null, new Date().toISOString() + '-' + file.originalname);
        cb(null, uuidv4());
    }
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4())   
    }
});

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
};
*/


app.use(bodyParser.json()); // application/json
//app.use( multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});




//Para crear el objecto Error:
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

//Rutas del servidor
app.use('/feed', feedRoutes);

mongoose
  .connect('mongodb+srv://yoshio:yoshiopassword@cluster0-luueb.mongodb.net/test?retryWrites=true&w=majority')
  .then(result => {
    app.listen(8080);
  }).catch(err => console.log(err));