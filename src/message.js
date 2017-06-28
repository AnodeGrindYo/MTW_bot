/*
 * message.js
 * This file contains your bot code
 */
/*
 * message.js
 * Ce fichier contient le code du bot
 */

const recastai = require('recastai');

// This function is the core of the bot behaviour
// Cette fonction est le coeur du fonctionnement du bot
const replyMessage = (message) => 
{
  // Instantiate Recast.AI SDK, just for request service
  // Instancie le SDK de Recast.AI pour le service de requêtes
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE);
  // Get text from message received
  // Obtient le texte du message reçu
  const text = message.content;

  console.log('I receive: ', text);


  // Get senderId to catch unique conversation_token
  // Obtient le senderId qui est le token unique de la conversation
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  // Appel du SDK de Recast.AI à travers la route de conversation
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    /*
    * YOUR OWN CODE
    * Here, you can add your own process.
    * Ex: You can call any external API
    * Or: Update your mongo DB
    * etc...
    */
   /*
    * NOTRE CODE VA ICI !
    * Ici, on peut ajouter notre propre process
    * Ex: Appel à une API externe
    * Ou mettre à jour une BDD, etc
    */

    ///////////////////  TEST  ///////////////////////////
    // récupère le nom de l'intention identifiée par l'IA
    var requestIntent = new recastai.request('fca3215abc3eeec7df0ca5fcd4e943d6');
    requestIntent.analyseText(text)
    .then(function(res) 
    {
      var intent = res.intent()
      //var parsedJSON = JSON.parse(res)
      console.log("intent : "+JSON.stringify(intent))
      console.log("message JSON: "+JSON.stringify(message))
      console.log("res : "+JSON.stringify(res))
      //console.log("ENTITY GREETING : "+JSON.stringify(greeting))
      console.log("ENTITY GREETING : "+ res.entities.greeting[0].value)
    });
    // récupère la liste des entités
    /*var requestEntities = require('superagent');
    var urlEnt = "https:";
    urlEnt += "/";
    urlEnt += "/";
    urlEnt += "api.recast.ai/v2/entities";
    requestEntities.get(urlEnt)
    .send()
    .set('Authorization', 'Token fca3215abc3eeec7df0ca5fcd4e943d6')
    .end((err, res) => 
      {
        console.log("Entities : "+res.text);
        var fs = require('fs'); // pour écrire dans un fichier
        fs.writeFile("entitiesTEST.txt", res.text, function (err) 
        {
          if (err) throw err;
        });
      });*/
    //////////////////  \TEST  /////////////////////////


    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)
    }

    // If there is not any message return by Recast.AI for this current conversation
    // S'il n'y a pas de message retourné par Recast.AI pour la conversation courante
    if (!result.replies.length) 
    {
      message.addReply({ type: 'text', content: 'Je ne sais pas répondre à ça pour l\'instant :)' })
    } else 
    {
      // Add each reply received from API to replies stack
      // Ajoute chaque réponse reçue à la pile des réponses
      result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
    }

    // Send all replies
    // Envoie toutes les réponses
    message.reply()
    .then(() => {
      // Do some code after sending messages
      // Si on veut effectuer du code après l'envoi des messages
    })
    .catch(err => {
      console.error('Error while sending message to channel', err)
    })
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
