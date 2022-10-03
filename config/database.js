if(process.env.NODE_ENV == 'production') {
  module.exports = {
    mongoDbUrl: process.env.MONGO_DB_URI
  } 
} else {
  module.exports = {
    mongoDbUrl: 'mongodb://127.0.0.1:27017/cms'
  }
}
