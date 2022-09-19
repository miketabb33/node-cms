const moment = require('moment')

module.exports = {
  ifEquals: (arg1, arg2, options) => (arg1 == arg2) ? options.fn(this) : options.inverse(this),
  formatDate: (date) => moment(date).format('MMMM Do YYYY'),
  getImageUrl: (filename) => `/uploads/${filename}`
}