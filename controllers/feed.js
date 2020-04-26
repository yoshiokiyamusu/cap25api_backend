const { validationResult } = require('express-validator/check');
const Post = require('../models/post');


exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  /*
  if(!req.file){
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }
  */
  // Viene en la trama inputs manuales
  //const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\" ,"/"); console.log(imageUrl);

  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Yoshio' },
    columna_detalles : { name: 'Yoshio', apellido: 'Kiyamu' }
    //createdAt: new Date()
  });
  post.save()
  .then(result => {
    res.status(201).json({
      message: 'Post created successfully!',
      post: result
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
 

};

//Para obtener el detalle de un solo ticket
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};