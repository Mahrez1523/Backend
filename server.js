const express = require('express')
const useRoutes = require('./routes/user.routes')
const postRoutes= require('./routes/post.routes')
require("dotenv").config({path:'./config/.env'})
require('./config/db')
const app= express()
const bodyParser = require('body-parser')
const cookieParser= require('cookie-parser')
const {checkUser, requireAuth} = require('./midlleware/auth.midlleware')




const cors = require('cors');
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type','Authorization'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));

const multer = require("multer")
const path = require("path")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));



// routes
app.use('/api/user',useRoutes)
app.use('/api/post',postRoutes)


//jwt
app.use(checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
  });

// Configurer Multer pour stocker les fichiers en local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renomme le fichier avec un timestamp pour éviter les doublons
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille des fichiers (ex: 10MB)
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mkv/; // Extensions autorisées
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images et les vidéos sont autorisées.'));
    }
  }
});

//server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT} ...`);
});
