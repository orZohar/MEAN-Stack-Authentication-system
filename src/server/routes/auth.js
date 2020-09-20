var express = require('express');
var authRouter = express.Router();
const userController = require('../controllers/auth');
const checkAuth = require('../middleware/verify-auth');

authRouter.post('/login', userController.user_login);

authRouter.post('/register', userController.user_signup);

authRouter.delete('/:userId', userController.user_delete);

module.exports = authRouter;