const User = require('../models/user');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) 
        .catch(error => res.status(400).json({ error })); 
    })
    .catch(error => res.status(500).json({ error }));
}

exports.login = (req, res) => {
  
  const TOKEN_SECURITY = process.env.TOKEN_SECURITY;

  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); 
          }
          bcrypt.compare(req.body.password, user.password)
            .then(valid => {
              if (!valid) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); 
              }
              res.status(200).json({ 
                userId: user._id,
                token: jwt.sign (
                  { userId: user._id },
                  TOKEN_SECURITY,
                  { expiresIn: '24h' }
                )
              });
            })
            .catch(error => res.status(500).json({ error })); // status 500 'Internal  Server  Error' > erreur serveur
        })
      .catch(error => res.status(400).json({ error }));  // status 400 'Bad Request' > pour indiquer une erreur côté client
};