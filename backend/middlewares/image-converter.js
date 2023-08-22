const sharp = require("sharp");
const fs = require("fs");

// Middleware pour modifier une image en format WebP
const modifyImage = (req, res, next) => {
  // Vérifier si un fichier a été téléchargé
  if (!req.file) return next();

  // Chemin d'entrée de l'image et chemin de sortie pour l'image WebP
  const imageInput = req.file.path;
  const imageOutput = req.file.path.replace(/\.(jpg|jpeg|png)$/, ".webp");

  // Modifier la taille et le format de l'image en utilisant Sharp
  sharp(imageInput)
    .resize({ width: 500, height: 700, fit: 'cover'})
    .toFormat("webp") 
    .toFile(imageOutput) 
    .then(() => {
      // Supprimer le fichier d'image original
      fs.unlinkSync(imageInput);

      // Mettre à jour les propriétés du fichier dans la requête
      req.file.path = imageOutput;
      req.file.mimetype = "image/webp";
      req.file.filename = req.file.filename.replace(/\.(jpg|jpeg|png)$/, ".webp");

      next();
    })
    .catch((error) => {
      console.error("Erreur lors de la modification de l'image :", error);
      next();
    });
};

module.exports = modifyImage;
