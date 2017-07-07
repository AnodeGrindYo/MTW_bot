/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai');
var fs = require('fs');
var vm = require('vm');
var content = fs.readFileSync("src/private.js")
vm.runInThisContext(content)
//vm.runInThisContext(fs.readFileSync(__dirname + "/private.js"));

// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    /*
    * YOUR OWN CODE
    * Here, you can add your own process.
    * Ex: You can call any external API
    * Or: Update your mongo DB
    * etc...
    */
    
    //console.log("DEV_TOKEN : "+DEV_TOKEN);

    var now = new Date();
    console.log("Aujourd'hui, nous sommes "+now.getDayName());
    var nextMonday = nextDateByDayName("lundi");
    //var devToken = 'fca3215abc3eeec7df0ca5fcd4e943d6';
    var devToken = DEV_TOKEN;
    var intent = getIntent(devToken, text);
    console.log("contenu de la variable intent"+JSON.stringify(intent));
    var entitiesArray = getEntities(result);
    console.log('entitiesArray = '+JSON.stringify(entitiesArray));
    console.log("entitiesArray keys :");
    printObjectKeys(entitiesArray);
    /*var props="";
    for (var prop in entitiesArray)
    { 
      props+= prop +  " => " +entitiesArray[prop] + "\n"; 
      console.log("prop = "+prop);
    }
    console.log ("Entity : "+props);*/
    var actionSlug = (result.action != undefined)? result.action.slug : null;
    var userinfo = [];
    //message.addReply({type: 'text', content:'test'});
    //message.reply();



    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)
    }

    // If there is not any message return by Recast.AI for this current conversation
    if (!result.replies.length) {
      message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
    } else {
      // Add each reply received from API to replies stack
      /*var btnArray = [];
      btnArray[1] = makeBtn('Je cherche un service', 'je cherche un service');
      btnArray[2] = makeBtn('Je fournis un service', 'je fournis un service');*/
      //var replyContent = replyContent;
      //console.log(JSON.stringify(replyContent));
      var myReply = null;
      if (result.action.slug != undefined)
        console.log (result.action.slug);
      
      if (actionSlug != null || actionSLug != undefined)
      {
        switch (actionSlug)
        {
          case 'greetings':        message.addReply({ type: 'quickReplies', content:  {title: 'titre', buttons: [{title: 'je cherche un service', value: 'je cherche un service'},{title: 'je fournis un service', value: 'je fournis un service'}]}});
                                   break;
          case 'job-1':            if (entitiesArray['job_title'] != undefined)
                                   {
                                     var info = entitiesArray['job']['value'];
                                     userinfo['job'] = info.toLowerCase();
                                     userinfo['wants'] = 'cherche_service';
                                     console.log("user's job : "+userinfo['job']);
                                   }
                                  break;
          case 'job':             if (entitiesArray['job_title'] != undefined)
                                   {
                                     var info = entitiesArray['job']['value'];
                                     userinfo['job'] = info.toLowerCase();
                                     userinfo['wants'] = 'offre_un_service';
                                     console.log("user's job : "+userinfo['job']);
                                   }
                                  break;
          case 'user_location':   if (entitiesArray['city'] != undefined)
                                  {
                                    var info = entitiesArray['city']['value'];
                                    userinfo['city'] = info.toLowerCase();
                                    console.log("user's city : "+userinfo['city']);
                                  }
                                  break;
          case 'user_location-1': if (entitiesArray['city'] != undefined)
                                  {
                                    var info = entitiesArray['city']['value'];
                                    userinfo['city'] = info.toLowerCase();
                                    console.log("user's city : "+userinfo['city']);
                                  }
                                  break;
          case 'rdv':             if (entitiesArray["date"] != undefined)
                                  {
                                    var info = entitiesArray['date']['value'];
                                    userinfo['rdv_date'] = info.toLowerCase();
                                    // if (userinfo['rdv_date'] == "aujourd'hui") userinfo['rdv_date'] = 
                                    console.log("date du rendez-vous souhaité : "+userinfo['rdv_date']);
                                  }
                                  if (entitiesArray['hour'] != undefined)
                                  {
                                    var info = entitiesArray['hour']['value'];
                                    userinfo['rdv_hour'] = info.toLowerCase();
                                    console.log("heure du rendez-vous souhaitée : "+userinfo['rdv_hour']);
                                  }
                                  break;
          case "get_name":        
          case "get_name-1":      if (entitiesArray['person'] != undefined)
                                  {
                                    var info = entitiesArray['person']['value'];
                                    userinfo['identity'] = info.toLowerCase();
                                    console.log("user's identity : "+ userinfo['identity']);
                                  }
                                  if (entitiesArray['email'] != undefined)
                                  {
                                    var info = entitiesArray['email']['local']+"@"+entitiesArray['email']['domain'];
                                    userinfo['email'] = info;
                                    console.log("user's email : "+ userinfo['email']);
                                  }
                                  break;
          default:                myReply = null;
                                  break;
        }
      }
      console.log("userinfo keys");
      printObjectKeys(userinfo);
      /*if (actionSlug == 'greetings')
      {
        console.log ('action : '+result.action.slug);
        myReply = { type: 'quickReplies', content:  {title: 'titre', buttons: [{title: 'je cherche un service', value: 'je cherche un service'},{title: 'je fournis un service', value: 'je fournis un service'}]}};
        console.log('test');
      }
      else
      {
        //console.log(JSON.stringify(replyContent));
        myReply = null;
        //myReply = { type: 'text', content: 'my text' };
        //myReply = { type: 'text', content: replyContent };
        //result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }));
        
      }*/

       
      //result.replies.forEach(replyContent => message.addReply((myReply != null)? myReply: { type: 'text', content: replyContent }));
      /*if (myreply != null)
        result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }));*/
      //result.replies.forEach(replyContent => message.addReply({ type: 'quickReplies', content:  {title: 'titre', buttons: [{title: 'je cherche un service', value: 'je cherche un service'},{title: 'je fournis un service', value: 'je fournis un service'}]}}))
      result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent })) // <==== message à renvoyer ici
      //result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent }))
    }

    // Send all replies
    message.reply()
    .then(() => {
      // Do some code after sending messages
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
  console.log("fonction getEntities");
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
    console.log("ent n'est pas nul");
    for(var x in ent)
    {
      key = x;
      console.log("key = "+key);
      val = ent[key];
      //console.log("val = "+JSON.stringify(val));
      //console.log("val.length = "+val.length);
      for(var y in val)
      {
        subKey = y;
        console.log("subKey = "+subKey);
        subVal = val[subKey];
        console.log("subVal = "+JSON.stringify(subVal));
        for (var z in subVal)
        {
          subsubKey = z;
          console.log("subsubKey = "+subsubKey);
          subsubVal = subVal[subsubKey];
          console.log("subsubVal = "+subsubVal);
          subArr[subsubKey] = subsubVal;
          arr[key] = subArr;
          console.log('arr["'+key+'"]["'+subsubKey+'"] = '+subsubVal);
          //console.log("vérification : "+arr[key][subsubKey]);
        }
      }
      if (arr["greeting"] != undefined)
        console.log('arr["greeting"]["rvalue"] = '+ arr["greeting"]["value"]);
      else if (arr["cherche_service"] != undefined)
        console.log('arr["cherche_service"]["value"] = '+ arr["cherche_service"]["value"]);
      else if (arr["job_title"] != undefined)
        console.log('arr["job_title"]["value"] = '+ arr["job_title"]["value"]);
      else if (arr["city"] != undefined)
        console.log('arr["city"]["value"] = '+ arr["city"]["value"]);
      else if (arr["hour"] != undefined)
        console.log('arr["hour"]["value"] = '+ arr["hour"]["value"]);
      else if (arr["date"] != undefined)
        console.log('arr["date"]["value"] = '+ arr["date"]["value"]);
      else if (arr["person"] != undefined)
        console.log('arr["person"]["value"] = '+ arr["person"]["value"]);
      else if (arr["email"] != undefined)
        console.log('email entity : '+arr["email"]["local"]+'@'+arr["email"]["domain"]);

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
  quickRep['content']= {};
  quickRep['content']['title'] = btntitle;
  //quickRep['content'] = {title : btntitle};
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
  return JSON.parse(quickRep);
};

/*
 * cette fonction sert à faire les messages de type "card"
 *
 * paramètres:
 * - cardTitle: le titre (un string)
 * - cardSubtitle: le sous-titre (un string)
 * - imageUrl: l'adresse de l'image (un string)
 * - buttons: un tableau qui contient des boutons (faits avec la fonction makeBtnMsg, de la forme buttons[i] = un bouton)
 * 
 */
function makeCard(cardTitle, cardSubtitle, cardImageUrl, buttons)
{
  var card = {};
  card['type'] = 'card';
  card['content'] = '{title: '+cardTitle+', subtitle: '+cardSubtitle+', imageUrl: '+cardImageUrl+'}+';
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
  return JSON.parse(card);
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
 * - buttons: un tableau qui contient des boutons (faits avec la fonction makeBtnMsg, de la forme buttons[i] = un bouton)
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
  return JSON.parse(carousel);
};

/*
 * Cette fonction sert à créer les éléments qui seront ajoutés à un tableau d'éléments
 *
 * paramètres:
 * - elTitle: le titre de l'élément
 * - imageUrl: l'url de l'image
 * - subtitle: le sous-titre (quoi, vous codez et vous ne parlez pas anglais? seriously???)
 * - buttons:  un tableau qui contient des boutons (faits avec la fonction makeBtnMsg, de la forme buttons[i] = un bouton)
 */
function makeElement(elTitle, imageUrl, subtitle, buttons)
{
  var element = {};
  element['title'] = elTitle;
  element['imageUrl'] = imageUrl;
  element['subtitle'] = subtitle;
  element['buttons'] = [];
  if(Object.keys(buttons).length > 0)
  {
    for (var i=0; i<Object.keys(buttons).length; i++)
    {
      var btn = {};
      btn.title = buttons[i]['title'];
      btn.value = buttons[i]['value'];
      element['buttons'].push(btn);
    }
  }
  return JSON.parse(element);
};

/*
 * Cette fonction sert à créer des images de type "List"
 *
 * paramètres:
 * - elementArray: un tableau numéroté d'éléments de la forme elementArray[i] = un élément
 * - buttons: un tableau de boutons (faits avec la fonction makeBtnMsg, de la forme buttons[i] = un bouton)
 */
function makeList(elementArray, buttons)
{
  var listMsg = {} ;
  listMsg['content'] = {};
  listMsg['content']['elements'] = [];
  listMsg['content']['buttons'] = [];
  if(Object.keys(buttons).length > 0)
  {
    for(var i=0; i<Object.keys(buttons).length; i++)
    {
      var btn = {};
      btn.title = buttons[i]['title'];
      btn.value = buttons[i]['value'];
      listMsg['content']['buttons'].push(btn);
    }
  }
  if(Object.keys(elementArray).length > 0)
  {
    for(var i=0; i<Object.keys(elementArray).length; i++)
    {
      listMsg['content']['elements'].push(elementArray[i]);
    }
  }
  return JSON.parse(listMsg);
};

/*
 * Cette fonction sert à faire des messages de type "image" ou des messages de type "vidéo"
 *
 * paramètres:
 * - url: l'adresse URL de l'image (un string)
 */
function makePicOrVideo(url)
{
  var msg = {};
  msg['type'] = 'picture';
  msg['content'] = imgUrl;
  return JSON.parse(msg);
};

function getIntent(developper_token, text)
{
  console.log("fonction getIntent");
  var requestIntent = new recastai.request(developper_token);
    requestIntent.analyseText(text)
    .then(function(res) 
    {
      var intent = res.intent()
      console.log("intent = "+JSON.stringify(intent));
      return intent;
    });
};

function getDateNow()
{
  var now = new Date();
  var dd = now.getDate();
  var mm = now.getMonth()+1; //January is 0!
  var yyyy = now.getFullYear();
  var hh = now.getHours();
  var min = now.getMinutes();
  var ss = now.getSeconds();

  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  }

  if (hh<10)
  {
    hh='0'+hh;
  }

  if (min<10)
  {
    min='0'+min;
  }

  if (ss<10)
  {
    ss='0'+ss;
  }

  now = dd+'/'+mm+'/'+yyyy+' '+hh+':'+min+':'+ss;
  return(now);
};

(function() {
    var days = ['samedi','dimanche','lundi','mardi','mercredi','jeudi','vendredi'];

    var months = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Decembre'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth()+1 ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay()+1 ];
    };
})();

function nextDateByDayName(dayname)
{
  dayname = dayname.toLowerCase();
  var days = ['samedi','dimanche','lundi','mardi','mercredi','jeudi','vendredi'];
  //var _date = new Date();
  var _dateincr;
  for(var i=0; i<8; i++)
  {
    _dateincr = new Date();
    _dateincr.setDate(_dateincr.getDate()+i);
    //_dateincr = _date.setDate(_date.getDate()+i);
    if (_dateincr.getDayName() == dayname)
    {
      if (i == 0) console.log("Ajourd'hui nous sommes "+dayname+", donc "+dayname+" prochain est dans 7 jours");
      console.log(dayname+" prochain, nous serons le "+_dateincr.getDate()+"/"+(_dateincr.getMonth()+1)+""+_dateincr.getFullYear());
      return _dateincr;
    }
  }
};

function printObjectKeys(obj)
{
  var props="";
  for (var prop in obj)
  { 
    props+= prop +  " => " +obj[prop] + "\n"; 
    console.log("prop = "+prop);
  }
  console.log ("Entity : "+props);
}