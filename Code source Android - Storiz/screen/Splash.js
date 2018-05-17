import React from 'react';
import { SafeAreaView, StyleSheet, Image,Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import {requestNotifications,openSettings} from 'react-native-permissions';
import colors from '../color/color'
export default class Splash extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      setlangDefault: "", isUpdated: false,
      showUpdateDialog: false,
      isAuthorized: "1",
      userid: '',
    };
  }
  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        3000
      )
    )
  }

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();
    requestNotifications(['alert', 'sound']).then(({status, settings}) => {
      console.log("status $$$$#####  settings $$$$ ####  "+status ,settings )
      if(status == 'granted'){
       
      }else{
        Alert.alert("Notifications",`Autorise les notifications dans les paramètres si elles ne sont pas activées.`,[
          { text: "OK", onPress: () => openSettings().catch(() => console.warn('cannot open settings'))}
        ])
        ;
      }
      
    });
    AsyncStorage.getItem("token")
      .then(token => {
        this.setState({ token: token });
        console.log("state userId============" + token);
        if (token != null && token != "" && token != undefined) {
           //Actions.push("HomeViewPager")
          Actions.push("Home")
        } else {
           Actions.push("SignUp");

        }
      })
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center' }}>
       <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={require('../assets/logo.png')} />
      </SafeAreaView>
    );
  }
}

/* ************************CSS Stye ****************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  viewStyle: {
    width: 200,
    height: 300,
    backgroundColor: 'red'
  },
  font_bold: {
    fontFamily: 'CamptonSemiBoldItalic'
  },

});