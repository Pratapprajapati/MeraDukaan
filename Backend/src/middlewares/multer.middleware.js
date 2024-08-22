import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')                   // upload file to emp folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)                 // keep og filename
    }
})

export const upload = multer({ storage })