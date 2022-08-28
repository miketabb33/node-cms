const express = require('express')
const Post = require('../models/Post')
const router = express.Router()

const uploadFileUnlessNull = (file) => {
  let fileName = null
  if (file) {
    fileName = Date.now() + '-' + file.name
    file.mv('./public/uploads/' + fileName, (err) => {
      if (err) throw err
    })
  }
  return fileName
}

router.get('/', (req, res) => {
  Post.find({}).lean()
    .then(posts => {
      res.render('admin/posts/index', { posts: posts})
    })
    .catch(err => {
      res.send('Cant find posts')
    })  
})

router.get('/create', (req, res) => {
  res.render('admin/posts/create')
})

router.post('/create', (req, res) => {
  const title = req.body.title
  const body = req.body.body
  const status = req.body.status
  const allowComments = req.body.allowComments == 'on'
  const fileName = uploadFileUnlessNull(req.files?.file)

  Post.create({title, body, status, allowComments, fileName})
    .then(_ => {
      res.redirect('/admin/posts')
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/edit/:id', (req, res) => {
  Post.findById(req.params.id).lean()
    .then(post => {
      if(!post) { res.send('Cant find post') }
      res.render('admin/posts/edit', {post: post})
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/edit/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      console.log(post)

      post.title = req.body.title
      post.body = req.body.body
      post.status = req.body.status
      post.allowComments = req.body.allowComments == 'on'

      post.save()
      .then(updatedPost => {
        res.redirect('/admin/posts')
      })
      .catch(err => {
        console.log(err)
      })

    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/:id', (req, res) => {
  Post.remove({_id: req.params.id})
  .then(_ => {
    res.redirect('/admin/posts')
  })
})

module.exports = router