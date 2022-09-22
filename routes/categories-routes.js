const express = require('express')
const router = express.Router()
const Category = require('../models/Category')

router.get('/', (req, res) => {
  Category.find({}).lean()
  .then(categories => {
    res.render('admin/categories/index', {categories})
  })
})

router.post('/create', (req, res) => {
  const newCategory = Category({
    name: req.body.name
  })

  newCategory.save()
  .then(category => {
    res.redirect('/admin/categories')
  })
})

router.get('/edit/:id', (req, res) => {
  Category.findById(req.params.id).lean()
  .then(category => {
    res.render('admin/categories/edit', {category})
  })
})

router.put('/edit/:id', (req, res) => {
  Category.findById(req.params.id)
  .then(category => {
    category.name = req.body.name

    category.save()
    .then(savedCategory => {
      res.redirect('/admin/categories')
    })
  })
})

router.delete('/:id', (req, res) => {
  Category.findByIdAndDelete(req.params.id)
  .then(_ => {
    res.redirect('/admin/categories') 
  })
})

module.exports = router
