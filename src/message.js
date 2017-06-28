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
      //console.log("intent : "+JSON.stringify(intent)) // l'intention liée au message
      //console.log("message JSON: "+JSON.stringify(message)) // le corps du message
      //console.log("res : "+JSON.stringify(res)) // reçoit le JSON entier
      //console.log("ENTITY GREETING : "+ res.entities.greeting[0].value) // récupère la value de la première entité greeting
      console.log(getKeys(res));
      var entitiesArray = getEntities(res);
      var buttons = new Array();
      var btn0 = new Array();
      btn0['title'] = 'btn0 title';
      btn0['value'] = 'btn0 value';
      buttons[0] = btn0;
      var btn1 = new Array();
      btn1['title'] = 'btn1 title';
      btn1['value'] = 'btn1 value';
      buttons[1] = btn1;
      makeQuickReply('quickRep TEST', buttons)
    });
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



///////////////// Functions //////////////////////

/*
 * Cette fonction renvoie un tableau associatif contenant les clés et
 * valeurs du json passé en paramètres
 */
function getKeys(jsonData) 
{
  var key;
  var val;
  var convertedJSON = new Array();
  for (var i in jsonData)
  {
    key = i;
    val = jsonData[i];
    convertedJSON[key] = val;
  }
  return convertedJSON;
};

/*
 * Cette fonction extrait la liste des entités ainsi que leur valeur
 * et les retourne dans un tableau associatif
 * par exemple, si le message contient "bonjour" et que dans Recast.AI
 * nous avons une entité qui s'appelle "greeting" qui contient le mot "bonjour"
 * alors myArray["greeting"]["value"] == "bonjour"
 */
function getEntities(jsonData)
{
  var arr = [];
  var subArr = new Array();
  var jsonArray = getKeys(jsonData);
  var ent = jsonArray["entities"];
  var key;
  var subKey;
  var subsubKey;
  var val;
  var subVal;
  var subsubVal;
  if (ent != null)
  {
    //console.log("ent n'est pas nul");
    for(var x in ent)
    {
      key = x;
      //console.log("key = "+key);
      val = ent[key];
      //console.log("val = "+JSON.stringify(val));
      //console.log("val.length = "+val.length);
      for(var y in val)
      {
        subKey = y;
        //console.log("subKey = "+subKey);
        subVal = val[subKey];
        //console.log("subVal = "+JSON.stringify(subVal));
        for (var z in subVal)
        {
          subsubKey = z;
          //console.log("subsubKey = "+subsubKey);
          subsubVal = subVal[subsubKey];
          //console.log("subsubVal = "+subsubVal);
          subArr[subsubKey] = subsubVal;
          arr[key] = subArr;
          //console.log('arr["'+key+'"]["'+subsubKey+'"] = '+subsubVal);
          //console.log("vérification : "+arr[key][subsubKey]);
        }
      }
      //console.log('arr["greeting"]["value"] = '+arr["greeting"]["value"]);
      //console.log("arr.length = "+Object.keys(arr).length);
      //console.log("version string de arr = "+JSON.stringify(arr));
    } 
  }
  //console.log("ent = "+JSON.stringify(ent));
  //console.log("ent.length = "+ent.length);
  return arr;
};

/*
 * Cette fonction aide à créer des boutons
 * retourne un json, que l'on peut ensuite ajouter à un tableau 
 * pour l'intégrer dans un message enrichi
 */
function makeBtn(title, value)
{
  var btn = {};
  btn['title'] = title;
  btn['value'] = value;
  return btn;
};

/*
 * Cette fonction permet de créer des messages de type "quick replies"
 * 
 * paramètres:
 * - title : un string
 * - buttons: un array de la forme buttons[0][title], buttons[0][value]
 *   la première dimension est l'indice du bouton. Chaque bouton doit avoir
 *   un titre et une valeur
 */
function makeQuickReply(btntitle, buttons)
{
  var quickRep = {};
  quickRep['type'] = 'quickReplies';
  quickRep['content'] = {title : btntitle};
  quickRep['content']['buttons'] = [];
  if(Object.keys(buttons).length > 0 )
  {
    for (var i=0; i<Object.keys(buttons).length; i++)
    {
      var btn = {};
      btn.title = buttons[i]['title'];
      btn.value = buttons[i]['value'];
      quickRep['content']['buttons'].push(btn);
    }
  }
  console.log('makeQuickReply() result : '+JSON.stringify(quickRep));
  return quickRep;
};

/*
 * cette fonction sert à faire les messages de type "card"
 *
 * paramètres:
 * - cardTitle: le titre (un string)
 * - cardSubtitle: le sous-titre (un string)
 * - imageUrl: l'adresse de l'image (un string)
 * - buttons: un tableau qui contient des boutons (faits avec la fonction makeBtnMsg)
 * 
 */
function makeCard(cardTitle, cardSubtitle, cardImageUrl, buttons)
{
  var card = {};
  card['type'] = 'card';
  card['content'] = {title: cardTitle, subtitle: cardSubtitle, imageUrl: cardImageUrl};
  card['content']['buttons'] = [];
  if(Object.keys(buttons).length > 0)
  {
    for (var i=0; i<Object.keys(buttons).length; i++)
    {
      var btn = {};
      btn.title = buttons[i]['title'];
      btn.value = buttons[i]['value'];
      card['content']['buttons'].push(btn);
    }
  }
  return card;
};

/*
 * cette fonction sert à faire les messages de type "button"
 *
 * paramètres:
 * - btnMsgTitle: le titre (un string)
 * - buttons: le tableau qui contient les boutons
 * 
 */
function makeBtnMsg(btnMsgTitle, buttons)
{
  var btnMsg = {};
  btnMsg['type'] = 'card';
  btnMsg['content'] = {title: btnMsgTitle};
  btnMsg['content']['buttons'] = [];
  if(Object.keys(buttons).length > 0)
  {
    for(var i=0; i<Object.keys(buttons).length; i++)
    {
      var btn = {};
      btn.title = buttons[i]['title'];
      btn.value = buttons[i]['value'];
      card['content']['buttons'].push(btn);
    }
  }
  return btnMsg;
};

/*
 * Cette fonction sert à faire des card pour un carousel.
 * ces cartes doivent être assignées à un tableau
 *
 * paramètres:
 * - cardTitle: un string, le titre de la card
 * - cardImageUrl: l'url de l'image de la card
 * - buttons: un tableau qui contient des boutons (faits avec la fonction makeBtnMsg)
 */
function makeCardForCarousel(cardTitle, cardImageUrl, buttons)
{
  var card = {};
  card = {title: title, imageUrl: cardImageUrl};
  card['buttons'] = [];
  if(Object.keys(buttons).length > 0)
  {
    for (var i=0; i<Object.keys(buttons).length; i++)
    {
      var btn = {};
      btn.title = buttons[i]['title'];
      btn.value = buttons[i]['value'];
      card['content']['buttons'].push(btn);
    }
  }
  return card;
};

/*
 * Cette fonction sert à faire des messages de type "carousel"
 *
 * paramètres:
 * - carouselTitle: le titre du carousel
 * - cardArray: un tableau de card (faits avec la fonction makeCardForCarousel)
 */
function makeCarousel(carouselTitle, cardArray)
{
  var carousel = {};
  carousel['type'] = 'carousel';
  carousel['content'] = cardArray;
  return carousel;
}

/*
 * Cette fonction sert à créer les éléments qui seront ajoutés à un tableau d'éléments
 *
 * paramètres:
 * - elTitle: le titre de l'élément
 * - imageUrl: l'url de l'image
 * - subtitle: le sous-titre (quoi, vous codez et vous ne parlez pas anglais? seriously???)
 * - buttons:  un tableau qui contient des boutons (faits avec la fonction makeBtnMsg)
 */
function makeElement(elTitle, imageUrl, subtitle, buttons)
{
  
}