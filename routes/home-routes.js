const express = require('express')
const Post = require('../models/Post')
const router = express.Router()
const Category = require('../models/Category')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home-layout'
  next()
})

router.get('/', (req, res) => {
  Post.find({}).lean()
  .then(posts => {
    Category.find({}).lean()
    .then(categories => {
      res.render('home/index', { posts, categories })
    })
  })
  .catch(err => {
    res.send('Cant find posts')
  }) 
})

router.get('/about', (req, res) => {
  res.render('home/about')
})

router.get('/login', (req, res) => {
  res.render('home/login')
})

router.get('/register', (req, res) => {
  res.render('home/register')
})

router.post('/register', (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const passwordConfirm = req.body.passwordConfirm

  const errors = []

  if (password != passwordConfirm) {
    errors.push({message: "Passwords do not match"})
  }

  if (errors.length > 0) {
    res.render('home/register', {
      errors,
      firstName,
      lastName,
      email
    })
  } else {
    User.findOne({email}).
    then(user => {
      if(!user) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            User.create({
              firstName,
              lastName,
              email,
              password: hash
            })
            .then(user => {
              req.flash('success_message', 'User was created successfully: ' + email)
              res.redirect('/login')
            })
          })
        })
      } else {
        req.flash('error_message', 'Email already exists: ' + email)
        res.redirect('/login')
      }
    })
  }
})

router.get('/show/:id', (req, res) => {
  Post.findById(req.params.id).lean()
  .then(post => {
    Category.find({}).lean()
    .then(categories => {
      res.render('home/show', {post, categories})
    })
  })
})

module.exports = router