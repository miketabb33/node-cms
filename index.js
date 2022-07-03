const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const expHbs = require('express-handlebars')

app.use(express.static(path.join(__dirname, 'public')))

const handlebars = expHbs.create({
  defaultLayout: 'home-layout',
  extname: '.hbs'
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use('/', require('./routes/home-routes.js'))
app.use('/admin', require('./routes/admin-routes.js'))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})