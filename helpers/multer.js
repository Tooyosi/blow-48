const multer = require('multer')

module.exports = (fileLocation) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, fileLocation)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "file/pdf" || file.mimetype.includes("pdf") || file.mimetype.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1590000
        },
        fileFilter: fileFilter
    })

    return upload
}
