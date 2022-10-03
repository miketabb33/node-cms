const fs = require('fs')
const path = require('path')

const uploadDir = __dirname + "/../public/uploads/"

const uploadFileUnlessNull = (file) => {
  let fileName = null
  if (file) {
    fileName = Date.now() + '-' + file.name
    const dirname = uploadDir + fileName
    file.mv(dirname, (err) => {
      if (err) throw err
    })
  }
  return fileName
}

const removeAllUploads = () => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(uploadDir, file), err => {
        if (err) throw err;
      });
    }
  });
}

const removeFile = (fileName) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      if (file == fileName) {
        fs.unlink(path.join(uploadDir, file), err => {
          if (err) throw err;
        });
        break
      }
    }
  }); 
}


module.exports = {uploadFileUnlessNull, removeAllUploads, removeFile}
