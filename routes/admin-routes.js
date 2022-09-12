const express = require('express')
const Post = require('../models/Post')
const faker = require('@faker-js/faker').faker
const router = express.Router()
const { removeAllUploads } = require('../core/imageUploader')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin-layout'
  next()
})

router.get('/', (req, res) => {
  res.render('admin/index')
})

router.post('/fake-posts', (req, res) => {
  for(let i = 0; i < req.body.amount; i++) {
    const post = new Post()
    post.title = faker.random.words(4)
    post.body = faker.lorem.paragraphs(5)
    const statuses = ["Public","Private", "Draft"]
    post.status = statuses[Math.floor(Math.random()*statuses.length)]
    post.allowComments = Math.random() > 0.5 

    post.save()
    .then(_ => {
      console.log("success")
    })
    .catch(err => {
      console.log(err)
    })
  }
  res.redirect('/admin/posts')
})

router.delete('/fake-posts', (req, res) => {
  removeAllUploads()

  Post.remove({})
  .then(_ => {
    res.redirect('/admin/posts')
  })
  .catch(err => {
    console.log(err)
  })
})

module.exports = router