const express = require('express');
const mongoose = require('mongoose'); 
const app = express(); 
const booksRoutes = require('./routes/book'); // Importation des routes pour les livres
const userRoutes = require('./routes/user'); // Importation des routes pour les utilisateurs
const path = require('path');
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env

// Connexion à la base de données
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.3f1sd9s.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !')) 
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour gérer les erreurs cross-origin
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
    next(); 
});

app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app; 
