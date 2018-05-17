import React from 'react';
import { SafeAreaView, StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
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
    AsyncStorage.getItem("token")
      .then(token => {
        this.setState({ token: token });
        console.log("state userId============" + token);
        if (token != null && token != "" && token != undefined) {
           //this.props.navigation.navigate("HomeViewPager")
           this.props.navigation.navigate("Tabs",{screen:'Store'})
        } else {
           this.props.navigation.navigate("SignUp");
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
    fontFamily: 'CamSemiItalic'
  },

});