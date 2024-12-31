const UserModel = require("../models/user.model");
const fs = require('fs')
const path = require('path')
module.exports.uploadProfileImage= async(req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier trouvé' });
    }
    const user = await UserModel.findById(req.body.userId);
      // Si une ancienne image existe, la supprimer
    if (user.profiliePicture) {
      
      const oldImagePath = path.join(__dirname,'..',user.profiliePicture);
     

      // Vérifie si le fichier existe avant de le supprimer
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { profiliePicture: `/uploads/profile/${file.filename}` } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );
      
          // Vérifier si l'utilisateur a été trouvé
          if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
          }else return res.status(200).json(updatedUser);
        
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

     