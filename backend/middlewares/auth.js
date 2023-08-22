const jwt = require('jsonwebtoken'); // Importer le module jsonwebtoken

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupérer le token du header

        // Vérifier si le token a été fourni dans le header
        if (!token) {
            throw new Error('Token non fourni');
        }

        // Utiliser la variable d'environnement JWT_SECRET
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) {
            throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
        }

        // Vérifier et décoder le token
        const decodedToken = jwt.verify(token, secretKey);

        // Extraire l'ID de l'utilisateur à partir du token décodé
        const userId = decodedToken.userId;

        // Stocker l'ID de l'utilisateur dans l'objet de requête pour les prochains middlewares
        req.auth = {
            userId: userId
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentification échouée' });
    }
};