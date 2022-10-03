if(process.env.NODE_ENV == 'production') {
  module.exports = {
    mongoDbUrl: 'mongodb+srv://udemy_cms:edQRMLgHpOlnr39J@cluster0.tnava24.mongodb.net/test'
  } 
} else {
  module.exports = {
    mongoDbUrl: 'mongodb://127.0.0.1:27017/cms'
  }
}
