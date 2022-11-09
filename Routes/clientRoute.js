const router = require('express').Router()
const controller = require('../Controllers/clientController')
const multer = require('multer')

const Storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './contactImage')
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage : Storage})



router.post('/create-contact', upload.single("image"), controller.postContact)

router.delete('/delete-contact/:id', controller.deleteContact)


module.exports = router;