// import React, { Component } from "react";
// import { View, PanResponder, Dimensions } from "react-native";

// export default class  ZoomView extends Component {
//   constructor(props) {
//     super(props)
//     this._panResponder = PanResponder.create({
//       onPanResponderMove: (e, { dy }) => {
//         const { height: windowHeight } = Dimensions.get(`window`)
//         return this.props.onZoomProgress(
//           Math.min(Math.max(dy * -1 / windowHeight, 0), 0.5),
//         )
//       },
//       onMoveShouldSetPanResponder: (ev, { dx }) => {
//         return dx !== 0
//       },
//       onPanResponderGrant: () => {
//         return this.props.onZoomStart()
//       },
//       onPanResponderRelease: () => {
//         return this.props.onZoomEnd()
//       },
//     })
//   }
//   render() {
//     return (
//       <View
//         style={{ flex: 1, width: `100%` }}
//         {...this._panResponder.panHandlers}
//       >
//         {this.props.children}
//       </View>
//     )
//   }
// }

import React, { Component } from 'react';
import { Platform,Dimensions, StyleSheet, View } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import DoubleClick from 'react-native-double-click';
export default class ZoomView extends Component {
  onGesturePinch = ({ nativeEvent }) => {
    this.props.onPinchProgress(nativeEvent.scale)
  }

  onPinchHandlerStateChange = (event) => {
    const pinch_end = event.nativeEvent.state === State.END
    const pinch_begin = event.nativeEvent.oldState === State.BEGAN
    const pinch_active = event.nativeEvent.state === State.ACTIVE
    if (pinch_end) {
      this.props.onPinchEnd()
    }
    else if (pinch_begin && pinch_active) {
      this.props.onPinchStart()
    }
  }

  render() {
    return (
      <PinchGestureHandler
        onGestureEvent={this.onGesturePinch}
        onHandlerStateChange={this.onPinchHandlerStateChange}>
        
        <View style={styles.preview}>
          {this.props.children}
        </View>
        
      </PinchGestureHandler>
    )
  }
}

const styles = StyleSheet.create({
  preview: {
    height: Dimensions.get('window').height,
 //   height:'50%',
    width: "100%",
  },
})