const multer = require('multer')
const { Posts } = require('../models')
const axios = require('axios')
require('dotenv').config()

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


exports.upload = (req, res, next) => {
    // const { post } = require('../routes/Posts')
    // console.log("Middle : ", post)

    // if (post && req.file) {
    //     const { filename } = req.file
    //     await Posts.update({ imageUrl: filename }, { where: { id: post } })
    // }

    axios
        .get('http://localhost:3001/posts', {
            headers: { accessToken: `${process.env.TOKEN}`},
        })
        .then((response) => {
            id = response.data.listOfPosts.at(0).id // Récupère l'id du premier élément du tableau
            console.log("Middle : ", id)
            
                if (id && req.file) {
                    const { filename } = req.file
                    Posts.update({ imageUrl: filename }, { where: { id: id } })
                }
            })
    
    res.status(200).json()
}