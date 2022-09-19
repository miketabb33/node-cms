const express = require('express')
const Post = require('../models/Post')
const router = express.Router()

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home-layout'
  next()
})

router.get('/', (req, res) => {
  Post.find({}).lean()
  .then(posts => {
    res.render('home/index', { posts })
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

router.get('/show/:id', (req, res) => {
  Post.findById(req.params.id).lean()
  .then(post => {
    console.log('id: ', post)
    res.render('home/show', {post})
  })
})

module.exports = router