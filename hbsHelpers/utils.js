const moment = require('moment')

module.exports = {
  ifEquals: (arg1, arg2, options) => (arg1 == arg2) ? options.fn(this) : options.inverse(this),
  formatDate: (date) => moment(date).format('MMMM Do YYYY'),
  getImageUrl: (filename) => `/uploads/${filename}`,
  paginate: (options) => {
    let output = ''
    const current = Number(options.hash.current)
    const pages = Number(options.hash.pages)
    let i = current > 5 ? current - 4 : 1

    output += getFirstCrumb(current)
    if(i>1) output += getEllipse()
    output += getMiddleCrumbs(i, current, pages)
    output += getLastCrumb(current, pages)

    return output
  }
}

const getFirstCrumb = (current) => {
  const disabledClass = current==1 ? 'disabled' : ''
  return `<li class="page-item ${disabledClass}"><a href="?page=1" class="page-link">First</a></li>`
}

const getLastCrumb = (current, pages) => {
  const disabledClass = current==pages ? 'disabled' : ''
  return `<li class="page-item ${disabledClass}"><a href="?page=${pages}" class="page-link">Last</a></li>`
}

const getEllipse = () => {
  return `<li class="page-item disabled"><a class="page-link">...</a></li>`
}

const getMiddleCrumbs = (i, current, pages) => {
  let result = ''
  for(; i <= (current + 4) && i <= pages; i++) {
    const activeClass = i == current ? 'active' : ''
    result += `<li class="page-item ${activeClass}"><a href="?page=${i}" class="page-link">${i}</a></li">`
    if(i==(current+4) && i < pages) result += getEllipse()
  }
  return result
}