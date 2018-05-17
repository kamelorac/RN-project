import React, { Component } from 'react'
import { Platform, StyleSheet, View, Text,Dimensions, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
//import Dimensions from 'Dimensions';
//import RecordingButton from './RecordingButton';
import ZoomView from './ZoomView';
import { TouchableOpacity } from 'react-native-gesture-handler';
const MAX_ZOOM = 7; // iOS only
const ZOOM_F = Platform.OS === 'ios' ? 0.007 : 0.08;
const DOUBLE_PRESS_DELAY = 400;
export default class ZoomVideoCamera extends Component {
  constructor(props) {
    super(props)
    this.state = { zoom: 0.0,
      lastTap:0 ,
      touchStartTime:0,
      count:1,
      typeCamera:false,
      isTerminated:false}
  }
  onPress = () => {
        this.setState({
            count: this.state.count+1
        })
        console.log("this.state.count  ",this.state.count)
    if(this.state.count == 2){
      alert("double click")
      this.setState({
        count: 1,
        typeCamera:!this.state.typeCamera
    })
    }
}
   _onPinchStart = () => {
    this._prevPinch = 1
  }
  _onPinchEnd = () => {
    this._prevPinch = 1
  }
  _onPinchProgress = (p) => {
    let p2 = p - this._prevPinch
    if(p2 > 0 && p2 > ZOOM_F) {
      this._prevPinch = p
      this.setState({zoom: Math.min(this.state.zoom + ZOOM_F, 1)}, () => {
      })
    }
    else if (p2 < 0 && p2 < -ZOOM_F) {
      this._prevPinch = p
      this.setState({zoom: Math.max(this.state.zoom - ZOOM_F, 0)}, () => {
      })
    }
  }
  render() {
    const handleClick = (e) => {
      switch (e.detail) {
        case 1:
          console.log("click");
          break;
        case 2:
          console.log("double click");
          break;
        case 3:
          console.log("triple click");
          break;
        default:
          return;
      }
    };
    return (
      <TouchableOpacity  onPress={this.onPress}>  
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        type={this.state.typeCamera === false ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
        style={styles.preview}
        zoom={this.state.zoom}
        maxZoom={MAX_ZOOM}>
        <ZoomView 
          onPinchEnd={this._onPinchEnd}
          onPinchStart={this._onPinchStart}
          onPinchProgress={this._onPinchProgress}>
        </ZoomView>
      </RNCamera>
      </TouchableOpacity>
    )
  }
}

export const styles = StyleSheet.create({
  preview: {
    height: Dimensions.get('window').height,
    width: "100%",
  }
});