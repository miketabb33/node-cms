const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const expHbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbsHelperMap = require('./hbsHelpers/hbsHelperMap')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const flash = require('connect-flash')
const { mongoDbUrl } = require('./config/database')
const passport = require('passport')

const connectToDatabase = () => {
  console.log('Connecting to database...')
  mongoose.connect(mongoDbUrl)
    .then(() => {
      console.log("Connected to database")
    }).catch((err) => {
      console.log("Error connecting to database: ", err)
    })
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(fileUpload())
app.use(session({
  secret: 'anysecret',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user || null
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.error = req.flash('error')
  next()
})

const handlebars = expHbs.create({
  defaultLayout: 'home-layout',
  extname: '.hbs', 
  helpers: hbsHelperMap
});

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use('/', require('./routes/home-routes.js'))
app.use('/admin', require('./routes/admin-routes.js'))
app.use('/admin/posts', require('./routes/posts-routes.js'))
app.use('/admin/categories', require('./routes/categories-routes.js'))
app.use('/admin/comments', require('./routes/comment-routes.js'))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  connectToDatabase()
})
