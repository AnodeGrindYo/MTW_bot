/*
 * bot.js
 *
 * In this file:
 * - received message from a connected channel will be transformed with Recast.AI SDK
 * - received message from test command will be processed by Recast.AI
 *   You can run this command for testing:
 *   curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 *
 *
 * The Recast.AI SDK will handle the message and call your reply bot function (ie. replyMessage function)
 */
/*
 * bot.js
 *
 * Dans ce fichier:
 * - les messages reçus du channel connecté seront transformés avec le SDK Recast.AI
 * - les messages reçus d'une commande de test seront traités par Recast.AI
 * On peut lancer cette commande pour tester:
 * curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 */

const recastai = require('recastai').default

const replyMessage = require('./message')

// Instantiate Recast.AI SDK
// Instancie le SDK de Recast.AI
const client = new recastai(process.env.REQUEST_TOKEN)

/*
 * Main bot function
 * Parameters are:
 * - body: Request body
 * - response: Response of your server (can be a blank object if not needed: {})
 * - callback: Callback is a function called by Recast.AI hosting system when your code will be hosted
 */
/*
 * Fonction principale du bot
 * Les paramètres sont:
 * - body: corps de la requête
 * - response: réponse de notre serveur (peut aussi être un objet vide: {})
 * - callback: callback est la fonction appelée par le système d'hébergement de Recast.AI lorsque notre code sera hébergé
 */
export const bot = (body, response, callback) => {
  //console.log("body : "+JSON.stringify(body))
  

  if (body.message) {
    /*
    * Call the Recast.AI SDK function to handle message from Bot Connector
    * This function will:
    * - Return a response with the status code 200
    * - Create a Message object, easily usable in your code
    * - Call the 'replyMessage' function, with this Message object in parameter
    *
    * If you want to edit the behaviour of your code bot, depending on user input,
    * go to /src/message.js file and write your own code under "YOUR OWN CODE" comment.
    */
   /*
    * Appel à une fonction du SDK de Recast.AI pour obtenir le message de BotConnector
    * Cette fonction va:
    * - Retourner une réponse avec le status code 200
    * - Créer un objet Message, facilement utilisable dans le code
    * - Appeler la fonction 'replyMessage' avec cet objet Message en paramètre
    *
    * Si on veut modifier le comportement du bot, selon l'input,
    * il faut aller dans message.js et écrire notre code sous le commentaire "NOTRE CODE VA ICI"
    */
    client.connect.handleMessage({ body }, response, replyMessage)

    /*
     * This function is called by Recast.AI hosting system when your code will be hosted
     */
    /*
     * Cette fonction est appelée par Recast.AI hébergeant notre système, lorsque ce code sera hébergé
     */
    callback(null, { result: 'Bot answered :)' })
  } else if (body.text) {
    /*
    * If your request comes from the testing route
    * ie curl -X "POST" "https://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
    * It just sends it to Recast.AI and returns replies
    */
   /*
    * Si notre requête vient de la route de test:
    * ie curl -X "POST" "https://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
    * ça envoie juste YOUR_TEXT et retourne la réponse
    */
    client.request.converseText(body.text, { conversationToken: process.env.CONVERSATION_TOKEN || null })
      .then((res) => {
        if (res.reply()) {
          /*
           * If response received from Recast.AI contains a reply
           */
          /*
           * Si res (reçu de Recast.AI) contient une réponse
           */
          callback(null, {
            reply: res.reply(),
            conversationToken: res.conversationToken,
          })
        } else {
          /*
           * If response received from Recast.AI does not contain any reply
           */
          /*
           * Si res (reçu de Recast.AI) ne contient pas de réponse
           */
          callback(null, {
            reply: 'No reply :(',
            conversationToken: res.conversationToken,
          })
        }
      })
      .catch((err) => {
        callback(err)
      })
  } else {
    callback('No text provided')
  }
}
