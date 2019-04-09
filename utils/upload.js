const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    let filename
    
    /**
     * 
     * stat() checks for the presence of a file at a path
     * 
     */
    fs.stat(`public/uploads/${file.originalname}`, (err, stat) => {

      if (!err) {
        /**
         * 
         * If there's no error, the file exists
         * Therefore, the newly uploaded file needs a new name.
         * For now, lets give it a timestamp in addition to the name.
         * 
         */
        const date = Date.now();

        filename = `${date}-${file.originalname}`

      } else if (err.code === 'ENOENT') {
        /**
         * 
         * If the error is ENOENT the file doesn't exist at all
         * Set the filename to the originalname
         * 
         */
        filename = file.originalname
      } else {
        // something went wrong...
        console.log(`File upload error -> ${err}`);
      }
      cb(null, filename)
    })

  }
})

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|zip|pdf)$/)) {
    return cb(new Error('That filetype is not allowed'))
  }
  cb(null, true)
}

const upload = multer({ 
  storage,
  fileFilter
 })

module.exports = upload;