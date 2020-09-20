var express = require('express');
var indexRouter = express.Router();
const verifyAuth = require('../middleware/verify-auth');


/* GET home page. */
indexRouter.get('/', verifyAuth, function(req, res, next) {
  console.log("Hello")
  res.status(201).json({
    message: " JWT is working",
  })
});

module.exports = indexRouter;
