const multer = require('multer') // Import de multer, qui gère les images
require('dotenv').config() // Pour cacher le token

// Destination et nom du fichier
const multerConfig = multer.diskStorage({
    // Où le fichier sera enregistrer
    destination: (req, file, callback) => {
        callback(null, '../client/public/')    
    },
    // Le nom du fichier
    filename: (req, file, callback) => {
        // On récupère l'extension dans file.mimetype, deuxième élément après le slash
        const ext = file.mimetype.split('/')[1] 
        callback(null, `image-${Date.now()}.${ext}`) // On crée le nom du fichier : image-date.extension
    }
})

// Vérifie si c'est une image
const isImage = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) { // Vérifie si le mimetype commence avec image
        callback(null, true)
    } else {
        callback(new Error('Image seulement !'))
    }
}

// Configuration de Multer
const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})

exports.uploadImage = upload.single('photo') // Pour envoyer une seule image, 'photo' doit être indiqué en front