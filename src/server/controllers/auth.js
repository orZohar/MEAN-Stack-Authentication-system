const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    // make sure username is still avaiable.
    User.find({ username: req.body.username }).exec().then(user => {
      if (user.length >= 1) { // find returns an array
        console.log(user)
        return res.status(409).json({
          message: "User exists"
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              email: req.body.email,
              password: hash
            })
            user.save().then(result => {
              console.log(result)
              res.status(201).json({
                message: "User created",
              })
            }).catch(err =>
              res.status(500).json({ error: err }));
            }
        });
    }
    })
}

exports.user_login = (req, res, next) => {
    User.find({ username: req.body.username }).exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed",
          })
        }
        bcrypt.compare(req.body.password, user[0].password).then(result => {
          console.log(process.env.JWT_KEY)
          if (result) {
            const token = jwt.sign({
              username: user[0].username,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
  
             )
            return res.status(200).json({
              message: 'Auth successful',
              token: token
  
            })
          } else {
            return res.status(401).json({
              message: "Auth failed",
            })
          }
        })
      }).catch(err =>
        res.status(401).json({
          message: "Auth failed",
        }))
  }


exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId }).exec()
      .then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

