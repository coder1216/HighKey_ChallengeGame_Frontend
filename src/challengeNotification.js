/**
 * @authors lin
 * @date    2017-11-09 
 * @version V1.0
 */
'use strict'
class challengeNotification{

	constructor(){
		this.admin = require("firebase-admin");
		this.serviceAccount = require("./myremote-d5156-firebase-adminsdk-r0ykf-5fc576436b.json");
		this.admin.initializeApp({
    	credential: this.admin.credential.cert(this.serviceAccount),
    	databaseURL: "https://myremote-d5156.firebaseio.com"
		});
	}
	
	sendGroupMessage(topic = "challenge", contents = "new challenge is coming"){
		var payload = {
    		notification: {
        		title: "Spotlite",
        		body: contents,
    		}
		};

		this.admin.messaging().sendToTopic(topic, payload)
    	.then(function(response) {
        console.log("Successfully group sent group message:", response);
    	})
    	.catch(function(error) {
        console.log("Error sending group message:", error);
    	});
	}

	sendSingleMessage(registrationToken, contents = "your firends challenge you"){
		var payload = {
    		notification: {
        		title: "Spotlite",
        		body: contents,
    		}
		};

		this.admin.messaging().sendToDevice(registrationToken, payload)
	    .then(function(response) {
	        console.log("Successfully sent single message:", response);
	    })
	    .catch(function(error) {
	        console.log("Error sending single message:", error);
	     });
	}

	addUserToGroup(registrationToken, topic){

		this.admin.messaging().subscribeToTopic(registrationToken, topic)
    	.then(function(response) {
        console.log("Successfully subscribed to topic:", response);
    	})
    	.catch(function(error) {
        console.log("Error subscribing to topic:", error);
    	});
	}

	removeUserToGroup(registrationToken, topic){
		this.admin.messaging().unsubscribeFromTopic(registrationToken, topic)
    	.then(function(response) {
        console.log("Successfully unsubscribed to topic:", response);
    	})
    	.catch(function(error) {
        console.log("Error unsubscribed to topic:", error);
    	});
	}


}

module.exports = challengeNotification







