//npm install firebase-admin --save

//Request to Firebase to send Push Notifications to Applications
var db = require('my-sql');

var firebase = require('firebase-admin');

var ServiceAccount = require('');
//Comes from Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(ServiceAccount),
  databaseURL: "http://spotlite-93587.firebaseio.com",
});

exports.sendNotifications = function(notificationIDs, messageContent){
  var message = {
    data: {
      messageVal: messageContent,
    }
  }
  for(var index = 0; index < notificationIDs.length; index++){
    firebase.messaging().sendToDevice(notificationIDs[index], messageContent)
      .then(function(response){
        console.log("Successfully Sent Message:", response);
      })
      .then(function(error){
        console.log("Error Sending Message:", error);
      });
  }
};
