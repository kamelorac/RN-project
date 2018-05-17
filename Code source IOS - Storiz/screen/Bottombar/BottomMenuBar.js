import React, { useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Dimensions, Alert, Animated } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import Message from '../Message';
import Store from '../Store';
import Store2 from '../Store';
import RecordingCamera from '../RecordingVideo/RecordingCamera'

const images = {
  homeIcon: require("../../assets/018.png"),
  foodIcon: require("../../assets/021.png"),
  toyIcon: require("../../assets/22.png"),
 // profileIcon: require("../../assets/018.png"),
};

const focusedImg = {
  homeFocused: require("../../assets/18.png"),
  foodFocused: require("../../assets/21.png"),
  toyFocused: require("../../assets/22.png"),
 // profileFocused: require("../../assets/018.png"),
};

const TabList = [
  { route: 'Message', type: images.homeIcon, typefocus: focusedImg.homeFocused, component: Message },
  { route: 'Store', type: images.foodIcon, typefocus: focusedImg.foodFocused, component:Store },
  { route: 'RecordingCamera', type: images.toyIcon, typefocus: focusedImg.toyFocused, component: RecordingCamera },
  //{ route: 'Store3', type: images.profileIcon, typefocus: focusedImg.profileFocused, component: Store3 },
];

const Tab = createBottomTabNavigator();

const animate1 = { 0: { scale: .5, translateY: 7 }, .92: { translateY: 4 }, 1: { scale: 1.2, translateY: 8 } }
const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } }

const circle1 = { 0: { scale: 0 }, 0.3: { scale: .9 }, 0.5: { scale: .2 }, 0.8: { scale: .7 }, 1: { scale: 1 } }
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }


const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={1000}
        style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View
            ref={circleRef}
           style={styles.circle}
             />
          {focused == true ?
            <Image source={item.typefocus}
              style={{ height: 25, width: 25 ,resizeMode:'contain',}} />
            :
            <Image source={item.type}
              style={{ height: 25, width: 25,resizeMode:'contain',}} />}
        </View>
        <Animatable.Text
          ref={textRef}
          style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  )
}

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {TabList.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 100,
    position: 'absolute',
    bottom:0,
    right:0,
    left:0,
    borderRadius:0,
    paddingLeft:30,paddingRight:30,
    backgroundColor:'#00D4F5'
  },
  btn: {
    width:35,
    height:35,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#00D4F5',
    backgroundColor: '#00D4F5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
   // backgroundColor: '#00D4F5',
   // borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  }
})

