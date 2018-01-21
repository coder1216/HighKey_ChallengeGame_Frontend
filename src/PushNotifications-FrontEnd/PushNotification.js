import React, { Component } from 'react';

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import * as Firebase from 'firebase';
import { SERVER } from '../config/server';

export default class PushNotification extends Component{
  constructor(props){
    super(props);
  };

  componentDidMount(){
      FCM.requestPermissions();
      FCM.getFCMToken().then(token => {
        //Store TokenID into MySQL Database
        this.StorePushNotificationToken(token);
      });

      FCM.getInitialNotification().then(notify => {
        console.log("Notify", notify);
      });
  }

  componentUnMount(){
    this.refreshUnsubscribe();
    this.notificationUnsubscribe();
  }

  //Receiving Notifications
  NotificationReceive(notify){
    FCM.PresentLocalNotification({
      title: notify.title,
      body: notify.body,
      priority: "high",
      click_action: notify.click_action ,
      show_in_foreground: true,
      local: false,
    });
  }

  StorePushNotificationToken(tokenID) {

    var url = null;
    var request = null;

    request = this.generateRequest(tokenID);
    url = '${SERVER}/api/updateToken';

    return fetch(url, request).then((response) => response.json()).then((responseJson) => {
      console.log("data: "+ responseJson);
      return responseJson;
    }).catch(error => {
      throw error;
    });
  }

  generateRequest(messageToSend){
    var request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message : messageToSend}),
    };
    return request;
  }

  otherMethods(){
    FCM.deleteInstanceId().then(()=>{}).catch(error => {});
  };

  render(){
    return null;
  }

};

module.exports = PushNotification;
