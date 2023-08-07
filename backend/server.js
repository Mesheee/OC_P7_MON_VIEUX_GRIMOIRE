const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port en un nombre ou une valeur false si invalide
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port); // Configuration de l'application avec le port choisi

// Gestionnaire d'erreurs en cas de problème lors du démarrage du serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // Création du serveur HTTP en utilisant notre application (express)

server.on('error', errorHandler); // Écoute des erreurs du serveur

// Une fois que le serveur écoute, on récupère l'adresse sur laquelle il écoute
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Affichage d'un message pour indiquer que le serveur est en écoute
});

server.listen(port); // Mise en écoute du serveur sur le port choisi
