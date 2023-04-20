import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export const buttonClose = {
  position: 'absolute',
  right: 5,
  top: 10,
  width: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
};
export const buttonleft = {
  position: 'absolute',
  left: 5,
  top: 10,
  width: width,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
};

export const durationText = {
  marginTop: Platform.OS === 'ios' ? 20 : 20,
  color: 'white',
  textAlign: 'center',
  fontSize: 20,
  alignItems: 'center',
};

export default StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
   // marginTop:50,
    //marginBottom:20
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    width,
    height,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonClose,
  preview: {
    width,
    height,
  },
  controlLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    width,
  },
  recodingButton: {
    marginBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  durationText,
  dotText: {
    color: '#32d4f5',
    fontSize: 10,
    lineHeight: 20,
  },
  btnUse: {
    position: 'absolute',
    width: 80,
    height: 80,
    right: 20,
    top: 20,
    marginTop:-20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertingText: {
    color: 'white',
    fontSize: 17,
    marginTop: 5,
    textAlign: 'center',
  },
});

export const renderClose = () =>  <Icon name="close" size={32} color="white" />;

export const renderDone = () => <View style={{
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#32d4f5',
}}><Icon style={{
  backgroundColor: 'transparent',
}} name="done" size={24} color="white" /></View>;
