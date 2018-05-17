import { Platform, Alert, View } from 'react-native';
import { Actions, Router, Stack, Scene } from 'react-native-router-flux';
import React from 'react';
import { BackHandler } from 'react-native'
//import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import 'react-native-gesture-handler';
import Splash from './screen/Splash'
import SignUp from './screen/SignUp'
import Login from './screen/Login'
import ForgotPassword from './screen/ForgotPassword';
import Register from './screen/Register';
import NextRegister from './screen/NextRegister';
import VideoRecording from './screen/VideoRecording';
import Home from './screen/Home'
import Chat from './screen/Chat';
import ProductDetails from './screen/ProductDetails';
import Profile from './screen/Profile';
import Setting from './screen/Setting';
import PersonalInfo from './screen/PersonalInfo';
import EnRegister from './screen/EnRegister'
import ProductEdit from './screen/ProductEdit';
import Contactus from './screen/Contactus';
import TermCondition from './screen/TermCondition';
import RecordingCamera from './screen/RecordingVideo/RecordingCamera';
import WebVideoPlay from './screen/WebVideoPlay';
import ZoomVideoCamera from './screen/ZoomVideoCamera'
import HomeViewPager from './screen/HomeViewPager';
import Subscribers from './screen/Subscribers';
import Subscriptions from './screen/Subscriptions';
import BlockProfile from './screen/BlockProfile';
import SeeUserProfile from './screen/SeeUserProfile';
import Multipal_Play from './screen/Multipal_play';
import ChatVideoPlay from './screen/ChatVideoPlay';
import Swapping from './screen/Swaping';
import Taps from './screen/Bottombar/BottomMenuBar'
//const Stack = createNativeStackNavigator();

_backAndroidHandler = () => {
  const scene = Actions.currentScene;
  // alert(scene)
  if(scene === 'RecordingCamera'){
 // Actions.push("Home")
 Actions.push("HomeViewPager")
  }else{
  }
  if (scene === 'Login'|| scene === 'HomeViewPager' || scene === 'Home' || scene === 'SignUp' || scene === 'Chat') {
    Alert.alert(
      'Quitter l\'application',
      'Voulez-vous sortir?',
      [
        { text: 'Non', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Oui', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false });
    return true;
  }
  Actions.pop();
  return true;
};


const Routes = () => (
  <Router
    navigationBarStyle={{ backgroundColor: '#8B008B', height: 45 }} tintColor='white' 
    backAndroidHandler={this._backAndroidHandler}
    >
    <Stack  key="root">
      <Scene key="Splash" component={Splash} left={() => null} hideNavBar />
      <Scene key="SignUp" component={SignUp} left={() => null} hideNavBar /> 
      <Scene key="Login" component={Login} left={() => null} hideNavBar />
      {/* <Scene key="Taps" component={Taps} left={() => null} hideNavBar /> */}
      
      <Scene key="ForgotPassword" component={ForgotPassword} left={() => null} hideNavBar />
      <Scene key="Register" component={Register} left={() => null} hideNavBar />
      <Scene key="NextRegister" component={NextRegister} left={() => null} hideNavBar />
      <Scene key="VideoRecording" component={VideoRecording} left={() => null} hideNavBar />
      <Scene key="Home" component={Home} left={() => null} hideNavBar />
      <Scene key="Chat" component={Chat} left={() => null} hideNavBar /> 
      <Scene key="ProductDetails" component={ProductDetails} left={() => null} hideNavBar />
      <Scene key="Profile" component={Profile} left={() => null} hideNavBar />  
      <Scene key="Setting" component={Setting} left={() => null} hideNavBar /> 
      <Scene key="PersonalInfo" component={PersonalInfo} left={() => null} hideNavBar /> 
      <Scene key="EnRegister" component={EnRegister} left={() => null} hideNavBar /> 
      <Scene key="ProductEdit" component={ProductEdit} left={() => null} hideNavBar /> 
      <Scene key="Contactus" component={Contactus} left={() => null} hideNavBar />
      <Scene key="TermCondition" component={TermCondition} left={() => null} hideNavBar />
      <Scene key="RecordingCamera" component={RecordingCamera} left={() => null} hideNavBar />
      <Scene key="WebVideoPlay" component={WebVideoPlay} left={() => null} hideNavBar />
      <Scene key="ZoomVideoCamera" component={ZoomVideoCamera} left={() => null} hideNavBar />
      <Scene key="HomeViewPager" component={HomeViewPager} left={() => null} hideNavBar />
      <Scene key="Subscribers" component={Subscribers} left={() => null} hideNavBar />
      <Scene key="Subscriptions" component={Subscriptions} left={() => null} hideNavBar />
      <Scene key="BlockProfile" component={BlockProfile} left={() => null} hideNavBar />
      <Scene key="SeeUserProfile" component={SeeUserProfile} left={() => null} hideNavBar />
      <Scene key="Multipal_Play" component={Multipal_Play} left={() => null} hideNavBar />
      <Scene key="ChatVideoPlay" component={ChatVideoPlay} left={() => null} hideNavBar />
      <Scene key="Swapping" component={Swapping} left={() => null} hideNavBar />
       
    </Stack>
  </Router>
);
export default Routes;

// const Navigations = ({ navigation }) => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Splash">
//       <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
//       <Stack.Screen name="Taps" component={Taps} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };
// export default Navigations;
