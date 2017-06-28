/*
 * server.js
 * This file is the core of your bot
 *
 * It creates a little server using express
 * So, your bot can be triggered throught "/" route
 *
 * This file was made for locally testing your bot
 * You can test it by running this command
 * curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 * You might modify the server port ^^^^  depending on your configuration in config.js file
 */
/*
 * server.js
 * Ce fichier est le coeur du bot
 *
 * Il crée un petit serveur en utilisant express
 * Donc le bot peut être actionné en utilisant la route "/"
 *
 * Ce fichier a été fait pour tester localement le bot.
 * On peut le tester en lançant cette commande:
 * curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 * à noter que selon ce qui est écrit dans le fichier config.js, il peut être nécessaire de changer le port du serveur
 */

const express = require('express');
const bodyParser = require('body-parser');

// Load configuration
// Charge la configuration
require('./config');
const bot = require('./bot').bot;

// Start Express server
// Démarre un serveur Express
const app = express()
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());

// Handle / route
// Routage
app.use('/', (request, response) => 
{

  // Call bot main function
  // appel de la fonction principale du bot
  bot(request.body, response, (error, success) => 
  {
    if (error) 
    {
      console.log('Error in your bot:', error);
      if (!response.headersSent) 
        { 
          response.sendStatus(400);
        }
    } 
    else if (success) 
    {
      console.log(success);
      if (!response.headersSent) 
        { 
          response.status(200).json(success); 
        }
    }
  })
});

if (!process.env.REQUEST_TOKEN.length) 
{
  console.log('ERROR: process.env.REQUEST_TOKEN variable in src/config.js file is empty ! You must fill this field with the request_token of your bot before launching your bot locally');
  process.exit(0);
} 
else 
{
  // Run Express server, on right port
  // Démarre le serveur Express sur le bon port
  app.listen(app.get('port'), () => 
  {
    console.log('Our bot is running on port', app.get('port'));
  })
}
