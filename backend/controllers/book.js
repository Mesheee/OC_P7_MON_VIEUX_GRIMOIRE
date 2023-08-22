const Book = require("../models/book");
const fs = require("fs");  // Module 'fs' pour gérer les opérations de fichiers

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books); 
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Récupérer les livres les mieux notés (limités à 3)
exports.getBestrating = (req, res, next) => {
  Book.find({})
    .sort({ averageRating: -1 })
    .limit(3)
    .then((bestRatedBooks) => {
      res.status(200).json(bestRatedBooks);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Récupérer un livre par son identifiant
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Créer un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);  // Analyser les données JSON du livre
  delete bookObject._id; 
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Ajouter une note à un livre
exports.createRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const currentUserId = req.auth.userId;  // Identifiant de l'utilisateur actuel
      const existingRating = book.ratings.find(
        (rating) => rating.userId === currentUserId
      );
      if (existingRating) {
        return res.status(400).json({ error: "Note déjà ajoutée auparavant." });
      } else {
        book.ratings.push({
          userId: req.auth.userId,
          grade: req.body.rating,
        });
      }
      // Calculer la note moyenne mise à jour
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );
      const averageRating = Math.round(sumRatings / totalRatings);
      book.averageRating = averageRating;
      book
        .save()
        .then(() => {
          res.status(200).json(book);
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Modifier les informations d'un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: Demande non autorisée" });
      } else {
        // Mettre à jour les informations du livre dans la base de données
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: Demande non autorisée" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        // Supprimer le fichier image associé
        fs.unlink(`images/${filename}`, () => {
          // Supprimer l'entrée du livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
