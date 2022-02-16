const multer = require('multer') // Import de multer, qui gère les images
const { Posts } = require('../models')
const axios = require('axios') // Pour récupérer le bon postId
require('dotenv').config() // Pour cacher le token

// Destination et nom du fichier
const multerConfig = multer.diskStorage({
    // Où le fichier sera enregistrer
    destination: (req, file, callback) => {
        callback(null, '../client/public/')    
    },
    // Le nom du fichier
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1] // On récupère l'extension dans file.mimetype, deuxième élément après le slash
        callback(null, `image-${Date.now()}.${ext}`) // On crée le nom du fichier : image-date.extension
    }
})

// Vérifie si c'est une image
const isImage = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) { // Vérifie si le mimetype commence avec image
        callback(null, true)
    } else {
        callback(new Error('Only Image is Allowed..'))
    }
}

// Configuration de Multer
const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})

exports.uploadImage = upload.single('photo') // Pour envoyer une seule image, 'photo' doit être indiqué en front


exports.upload = (req, res, next) => {
    // const { post } = require('../routes/Posts')
    // console.log("Middle : ", post)

    // if (post && req.file) {
    //     const { filename } = req.file
    //     await Posts.update({ imageUrl: filename }, { where: { id: post } })
    // }

    // On utilise axios pour récupérer le dernier postId
    axios
        .get('http://localhost:3001/posts', {
            headers: { accessToken: `${process.env.TOKEN}`},
        })
        .then((response) => {
            id = response.data.listOfPosts.at(0).id // Récupère l'id du premier élément du tableau
            console.log("Middle : ", id)
            
                if (id && req.file) {
                    const { filename } = req.file // Récupère le nom du fichier
                    Posts.update({ imageUrl: filename }, { where: { id: id } }) // Met à jour la BDD avec imageUrl
                }
            })
    
    res.status(200).json()
}