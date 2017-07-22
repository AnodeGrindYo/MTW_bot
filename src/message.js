/*
 * message.js
 * Ce fichier contient le code de notre bot
 */

const recastai = require('recastai');
var fs = require('fs');
var vm = require('vm');
var content = fs.readFileSync("src/private.js")
vm.runInThisContext(content)


// Cette fonction est le coeur du comportement du bot
const replyMessage = (message) => {
  // Instancie Recast.AI SDK, juste pour le service de requêtes
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // récupère senderId pour obtenir un unique conversation_token
  const senderId = message.senderId

  // Appelle Recast.AI SDK, via /converse
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    /*
    * traitement des messages
    */
    
    //console.log("DEV_TOKEN : "+DEV_TOKEN);

    // quelques test ici
    var now = new Date();
    console.log("Aujourd'hui, nous sommes "+now.getDayName()+", soit le "+getDateNow());
    var nextMonday = nextDateByDayName("lundi");
    var devToken = DEV_TOKEN;
    var intent = getIntent(devToken, text);
    console.log("contenu de la variable intent"+JSON.stringify(intent));
    var entitiesArray = getEntities(result);
    console.log('entitiesArray = '+JSON.stringify(entitiesArray));
    console.log("entitiesArray keys :");
    printObjectKeys(entitiesArray);
    var actionSlug = (result.action != undefined)? result.action.slug : null;
    var userinfo = [];
    var richMsgSent = false;
    var greetQuickRep = { type: 'quickReplies', 
                          content:  
                          {
                            title: 'Bonjour, que puis-je faire pour toi?', 
                            buttons: [
                            {
                              title: 'je cherche',
                              value: 'je cherche un service'
                            },
                            {
                              title: 'je fournis',
                              value: 'je fournis un service'
                            }]
                          }
                        };
    var greetCard = { type: 'card',
                      content:
                      {
                        title: 'Bonjour Daniel !',
                        subtitle: 'Est-ce que tu cherches ou est-ce que tu fournis un service?',
                        imageUrl: 'https://lh3.googleusercontent.com/peEhPWRJESWXX-67iKK33ETthlCcqY2Fwd_E9TX5vK_HiK54x1ihievmHxOcIbSOc_djvF4FXIgwZ2wdqVYJABpoy--smWlF53E5StTmoT0dtM-UmZPpB-DzZJ01TrqIKqRbidh8xkT_AGzAvIZ2CEDAL259UrSYm-z8KPKf89hl1ZX29E_7b9n-xVxMcWRNO87z6qaVQC-CRXJtp0FaUNVcFKC8GldLUnKNIKUp2l_5TvCXtstVeLydm1XukDweM00PpVERXCMdcYVHhxrfqTg98vhNFmjDZknjQv39q7uZY1vPXZl508QFyVdQly5fneImieuHnpKYzSbUaLAFPcz6F-ZhDZCVXgjdslQnp0EBTPmHxlJfflZt0gYsnRDSk6ExtLmhQknlXjaiqkAQxdB12bEw7ocIhgI0piBB2-9zKEFtvukyjacbB8CQJx6b9zNMv8x4ch_qUgq9KkCnxuHzjh6MYi6w2m0FZkXnr8DIs--j4rPDsE05uxFt6_F_IovAzSOmkyn--00UBZV0dCTTw3mBZ8IhyQLDNu4sM8dCkKZ1N_FPW1gOqbw5NUI1pR-Bmg4wfP3Xmvl28QehcdQ-3Re0su9fRvZ4hkbMqvMs_Qt_9JTygg63z3-21ZH9qaiLsEqQUjnU2gO3I8ecUcJ3JLsf7KjqtMFzlx5BMmK0FQ=w1024-h768-no',
                        buttons: [
                        {
                          title: 'je cherche', 
                          value: 'je cherche un service'
                        },
                        {
                          title: 'je fournis', 
                          value: 'je fournis un service'
                        }]
                      }
                    };
    var lawyersCarousel = { type: "carousel",
                            content: 
                            [
                            {
                              title: "Marcel Fecteau",
                              imageUrl: "https://lh3.googleusercontent.com/C3EQ6t46cWVZCbjijeO3EKD79Ai6S1OgqZ0AQZl3__R_Q5FduwncE8rNMql-mvjhLaixtMjtk18S-S-WHXK4l5mcu31xZe1Q588Ao23QJNUE2_PsunXihbQD3TERucJMLiUU0zcJQfDbvPLa0_3zdtdwZ9ow_ocqkNvWiMucXK5C0khq8O8FV42xXMlbBNo2cmL2qLbA9Rwrrk7bFbvEK2jELnxS8msf9rxlMdGWWFDiZUaemS_EKQd6TcNkPID-ZM2TU4rlxLArywG51FOA-zkVLYaI65-VaX22VKRwR7be1nO6AJ0Qhwo_Oaj3lHxVZHKgg1k5uhDR3fUQvzy4LBliVLosLrEXNuSm7xnSTnQbfpfAo0rYXBhvJNPpN_Enk8CzAUlOSA9Jr9PUlDKvyF_5eLiBMFT3-brhYelDms2bpqsdPViqVPG9I89TuwTTwkOcsyDCV84k2B72EhCOwjKVXrgvxP3BiNrFv5BFCm1Cse7khu_rlv9hfBXwswxN-6VRZ2ZzNS664ep1wxPYeGGV_XuNa16l6PxLDi6e3GQP3lHr1qVLS7rW1E7C_87mC3r9dq9KGdi9bOR0hGO25RSIegvYAvl_RNRZkmr-pVp7Cdms9itaJnebzdEhCkQ87E0xmoFDmfDk3UPH3c3LcXluq3SFJCW-X3MHFGeGLbpS1WM=w1024-h768-no",
                              buttons: [
                              {
                                title: "choisir Marcel Fecteau",
                                value: "je choisis Marcel Fecteau",
                                type: "postback"
                              }]
                            },
                            {
                              title: "Eustache Bonnet",
                              imageUrl: "https://lh3.googleusercontent.com/0XhNes3zdmwA5VdwavJMP4uZHkDKEzsjvCBiaoBYTlU5U4R11oDUx8oe9ypGHQFiLfZCKSpTnZmhOajo9ipzRvku7rxlp6zhSQqT6YzzjsVne7VXexJaRRCWcWasHBvn3waPBH2_Xi2SIrRnkYRgI2iwO2BlimNsgDK0FFbR8VX1O0kxFoN-o2Z5fbpZbarj-qrfhkoEgXAQN8boQMv_rEzljeclIqCj7dc5dNO2fJCMSclVqYfFxdmcn5IUCXibPPgPMOgnGtmqy-Pn-3ytz3Dw5-_Qnku9mrbVIOh0MElobyccheog9JAjVfZbwQTu6PwD06B5rMf9buoBsVzVTKddZuEr77g91p8NZWKQCPuEqfSiS85e7Cbq7reMKEr4rbdUioHcBn7jgLqDwP2QlSBHSssV4-sVvxCF1MjYqznP0YdcWXNR74nDUBJe-I4e9Nn6nZ4AeNkECQj-cx8SktqoYte297RNeh4Mhp63_-VdmZcLmfsP-X9yEr90smlkG8-GgiUFOO1AVfx0ZLaJu9f4uR9GSE54sxnSsn-KHMaucGcZ1fVqNFl0D76jap7MOHBGgJMd_vwbI1XzNxotYhYRSyXd2ICGhxQMlgR1vXFLDLycFmCFLk4doP3eP-_GUyS0c2HTJh3YvAwE_HRaWFmJ5BT17ez1XC1iuS-5G2Qim7k=w1024-h768-no",
                              buttons: [
                              {
                                title: "choisir Eustache Bonnet",
                                value: "je choisis Eustache Bonnet",
                                type: "postback"
                              }]
                            },
                            {
                              title: "Marjolaine Phaneuf",
                              imageUrl: "https://lh3.googleusercontent.com/7UHzvRO9sZsp5hDCd3a313D_EA6m4e_1XA1JQcMJtwyy6pSOI5dM2vno2T9CpAev2WUG9cE8naV9p61Y7vdzI7A6Rz4l8PNyf8yeUVfklCg-lk4vfUf123bmZFVpElfGwoHGf_6oQ_SJUjN9NNn8mFtk5UgZ9OYei8RfeYKE9YTG4zZPJE-8vaPXKQPB9U8QWbPyudU_ERfO_24j1_vj8ygoxANl1PF-q75AcpVJNn60S42lGp0W3SfQE-lc5QS1Il_sbsQANegSZlCwdFnddAbonD_3qhO8jr-iQ2PqIKK30dkCwyMoAUlITwhH0g1_R4n-g7dmOjwSBzNrmIfto76VSaDc58Bs2Im_fpjyt5efXyoMgW9mXFISBroo0Yp86YeJ_mm3qAO4zroPSqW5azuRd6YszZPCyXEYoka-kQ_aGwblMuB0fYb-tNkS_HA7EpjoLjLe3gjilfY8TkRAwBQ4p-aggmc7h8BaS2c1oSHMwXim-ou7Xl5Yf1QdgNjeF6H6u7fSC75V868B7Ntqal2iI1Lm7IQlXkHvLgxPGgp50nk3s-bpNuxaWILHjU0CLoLzELTB1qN_dC6COSo3fs-FtKAFO037WbkBzFEIiJN8gzs-qL_ApJupC5FPqoujT7Wo2PeY7B1t3wXrP19vbgyZ7PhzQW7GwGlKKV4mMqQRx7c=w1024-h768-no",
                              buttons: [
                              {
                                title: "choisir Marjolaine Phaneuf",
                                value: "je choisis Marjolaine Phaneuf",
                                type: "postback"
                              }]
                            }  
                            ]
                          };
    var connectLawyer = { type: 'quickReplies', 
                          content:  
                          {
                            title: '', 
                            buttons: [
                            {
                              title: 'ouvrir une table', 
                              value: 'https://opentokdemo.tokbox.com/room/mtw?userName=mtw'
                            }]
                          }
                        };
    var rep;
    //message.addReply({type: 'text', content:'test'});
    //message.reply();



    if (result.action) {
      console.log('The conversation action is: ', result.action.slug)
    }

    // S'il n'y a pas de messge retourné par recast.ai pour cette conversation
    if (!result.replies.length) {
      message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
    } else {
      // ajoute chaque réponse au stack de réponses
      var myReply = null;
      if (result.action != undefined)
      {
        if (result.action.slug != undefined)
          console.log (result.action.slug);
      }

      // vérifie l'action courante, et ajoute les infos extraites à userinfo
      if (actionSlug != null || actionSlug != undefined)
      {
        switch (actionSlug)
        {
          case 'greetings':        
                                   message.addReply(greetQuickRep);
                                   //message.reply(greetQuickRep);
                                   //rep = greetQuickRep;
                                   richMsgSent = true;
                                   break;
          case 'job-1':            if (entitiesArray['job_title'] != undefined)
                                   {
                                     var info = entitiesArray['job_title']['value'];
                                     userinfo['job_title'] = info.toLowerCase();
                                     userinfo['wants'] = 'cherche_service';
                                     console.log("user's job : "+userinfo['job']);
                                     if (userinfo["job_title"] == "avocat")
                                    {
                                      //message.addReply(lawyersCarousel);
                                      //message.reply(lawyersCarousel);
                                    }
                                   }
                                  break;
          case 'job':             if (entitiesArray['job_title'] != undefined)
                                   {
                                     var info = entitiesArray['job_title']['value'];
                                     userinfo['job_title'] = info.toLowerCase();
                                     userinfo['wants'] = 'offre_un_service';
                                     console.log("user's job : "+userinfo['job']);
                                   }
                                  break;
          case 'chose_profile':   
                                  break;
          case "connect_with_pro":  message.addReply(connectLawyer);
                                    //message.reply(connectLawyer);
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
      console.log("richMsgSent = "+richMsgSent);
      result.replies.forEach(replyContent => console.log("replyContent : "+replyContent))
      if (richMsgSent == false) result.replies.forEach(replyContent => message.addReply({ type: 'text', content: replyContent })) // <==== message à renvoyer ici
      console.log("Object.keys(result.replies).length : "+Object.keys(result.replies).length);
    }

    // Envoyer toutes les réponses
      message.reply()
        .then(() => {
          // Exécuter du code après l'envoi des messages
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

  //now = dd+'/'+mm+'/'+yyyy+' '+hh+':'+min+':'+ss;
  now = yyyy+'-'+mm+'-'+dd;
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
    console.log("i = "+i);
    //_dateincr = _date.setDate(_date.getDate()+i);
    if (_dateincr.getDayName() == dayname)
    {
      if (i == 0) console.log("Ajourd'hui nous sommes "+dayname+", donc "+dayname+" prochain est dans 7 jours");
      //console.log(dayname+" prochain, nous serons le "+_dateincr.getDate()+"/"+(_dateincr.getMonth()+1)+"/"+_dateincr.getFullYear());
      var yy = _dateincr.getFullYear();
      var mm = _dateincr.getMonth()+1;
      var dd = _dateincr.getDate();
      if (mm < 10) mm = '0'+mm;
      if (dd < 10) dd = '0'+dd;
      console.log("le prochain "+dayname+" sera le "+yy+'-'+mm+'-'+dd);
      return yy+'-'+mm+'-'+dd;
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