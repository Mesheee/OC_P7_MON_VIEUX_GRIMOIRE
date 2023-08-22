const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    // Hasher le mot de passe fourni par l'utilisateur 
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Créer un nouvel utilisateur avec l'e-mail et le mot de passe hashé
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistrer l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
    // Rechercher l'utilisateur dans la base de données par son e-mail
    User.findOne({ email: req.body.email })
        .then(user => {
            // Vérifier si l'utilisateur existe
            if (!user) {
                return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
            }
            // Comparer le mot de passe fourni lors de la connexion avec le mot de passe hashé de l'utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
                    }
                    // Générer un token JWT avec l'identifiant de l'utilisateur et la clé secrète
                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET, 
                        { expiresIn: '24h' }
                    );
                    // Renvoyer l'identifiant de l'utilisateur et le token JWT
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
