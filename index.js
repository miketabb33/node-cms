const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const expHbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbsHelperMap = require('./hbsHelpers/hbsHelperMap')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')

const connectToDatabase = () => {
  console.log('Connecting to database...')
  mongoose.connect('mongodb://127.0.0.1:27017/cms')
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  connectToDatabase()
})
