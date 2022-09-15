const moment = require('moment')

module.exports = {
  ifEquals: (arg1, arg2, options) => {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },

  formatDate: (date) => {
    return moment(date).format('MMMM Do YYYY')
  }
}