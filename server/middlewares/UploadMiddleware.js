const multer = require('multer')
const { Posts } = require('../models')

const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '../client/public/')    
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1]
        callback(null, `image-${Date.now()}.${ext}`)
    }
})

const isImage = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new Error('Only Image is Allowed..'))
    }
}

const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})

exports.uploadImage = upload.single('photo')

exports.upload = async (req, res, next) => {
    const {post} = await require('../routes/Posts')
    console.log("middleware", post)
    
    
    if (post && req.file) {
        const { filename } = req.file
        await Posts.update({ imageUrl: filename }, { where: { id: post } })
    }
    
    res.status(200).json()
}