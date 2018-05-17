
 import React, { Component } from 'react';
 import Routes from './Routes.js'
 import {Alert,Linking} from 'react-native';
 import messaging from '@react-native-firebase/messaging';
 import AsyncStorage from '@react-native-community/async-storage';
 async function saveTokenToDatabase(token) {
   console.log('FCM token is ',token);
  var tokenn = AsyncStorage.setItem('fcm_token',token)
 }
 
 async function requestUserPermission() {
   const authStatus = await messaging().requestPermission();
   const enabled =
     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
 
   if (enabled) {
     console.log('Authorization status:', authStatus);
     messaging()
     .getToken()
     .then(token => {
       return saveTokenToDatabase(token);
     });
 
   return messaging().onTokenRefresh(token => {
     saveTokenToDatabase(token);
   });
 
   }
   else
   {
     requestUserPermission()
   }
 }

 // Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
 // EventRegister.emit('myCustomEvent', remoteMessage)

});
 class App extends Component {
   async componentDidMount()
   {
     // notifee.createChannel({
     //   id: 'notificationchannelhakweuser',
     //   name: 'notificationchannelhakweuser',
     //   sound: 'uber.wav',
     // });
     requestUserPermission()
    this.createNotificationListeners()
   // this.toggleNotification()
   }
   async createNotificationListeners() {
     this.messageListener = messaging().onMessage(async remoteMessage => {
       console.log('onMessage ',JSON.stringify(remoteMessage))
      if(remoteMessage.data.type == "Chat"){

      }else{
        Alert.alert(remoteMessage.notification.title,remoteMessage.notification.body,[
          { text: "OK", onPress: () =>null }
      ]);
      }
      
    
     });
     messaging().onNotificationOpenedApp(remoteMessage => {
       console.log(
         'Notification caused app to open from background state:',
         remoteMessage.notification,
       );
     
     });
     // Check whether an initial notification is available
     messaging().getInitialNotification()
       .then(remoteMessage => {
         if (remoteMessage) {
           console.log(
             'Notification caused app to open from quit state:',
             remoteMessage.notification,
           );
         }
       });
     }
     async toggleNotification(){
      if(Platform.OS === 'ios'){
          const authStatus = await messaging().hasPermission();
          if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
              const authorizationStatus = await messaging().requestPermission();
              if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                  this.setState({
                      notification: true
                  })
              }
          } else{
              Linking.openURL('app-settings://')
          }
      }else{
          Linking.openSettings();
      }
    }
    render() {
       return (
          <Routes />  
       )
    }
 }
 export default App
 