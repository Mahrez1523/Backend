const multer = require('multer');
const path = require('path');

// Configuration du stockage avec multer
const storagepost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts/'); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renomme le fichier avec un timestamp pour éviter les doublons
  }
});

// Filtrage des fichiers (pour n'accepter que les images/vidéos)
const fileFilterpost = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|mp4|avi/; // Types de fichiers autorisés
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accepte le fichier
  } else {
    cb(new Error('Seules les images et les vidéos sont autorisées !'));
  }
};

// Configuration du stockage avec multer
const storagePDP = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile'); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renomme le fichier avec un timestamp pour éviter les doublons
  }
});

// Filtrage des fichiers (pour n'accepter que les images/vidéos)
const fileFilterPDP = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Types de fichiers autorisés
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accepte le fichier
  } else {
    cb(new Error('Seules les images et les vidéos sont autorisées !'));
  }
};
// Initialisation de multer avec les configurations
module.exports.uploadpost = multer({
  storage: storagepost,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille : 10 Mo
  fileFilter: fileFilterpost
});
module.exports.uploadPDP = multer({
  storage: storagePDP,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille : 10 Mo
  fileFilter: fileFilterPDP
});

// module.exports= uploadpost
//module.exports=uploadPDP
