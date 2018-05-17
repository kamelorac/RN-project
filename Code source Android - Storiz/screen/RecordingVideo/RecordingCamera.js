import React, { Component } from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  InteractionManager,
  Dimensions,
  Image,
  Platform,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types'
import moment from 'moment';
import { RNCamera } from 'react-native-camera';
//import RecordingButton from './RecordingButton';
import styles, { buttonClose, buttonleft, durationText, renderClose, renderDone } from './style';
import colors from '../../color/color';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
//import Swipeable from 'react-native-gesture-handler/Swipeable';
import Swipeable from 'react-native-swipeable';
import { Actions } from 'react-native-router-flux';
import ZoomView from '../ZoomView';
import DoubleClick from 'react-native-double-click';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
var swippdata = false;
var swiping = false;
const MAX_ZOOM = 7; // iOS only
const ZOOM_F = Platform.OS === 'ios' ? 0.007 : 0.08;

export default class VideoRecorder extends Component {
  static propTypes = {
    isOpen: true,
    runAfterInteractions: PropTypes.bool,
    cameraOptions: PropTypes.shape({}),
    recordOptions: PropTypes.shape({}),
    buttonCloseStyle: PropTypes.shape({}),
    durationTextStyle: PropTypes.shape({}),
    renderClose: PropTypes.func,
    renderDone: PropTypes.func,
  }

  static defaultProps = {
    isOpen: true,
    runAfterInteractions: true,
    cameraOptions: {},
    recordOptions: {},
    buttonCloseStyle: buttonClose,
    buttonLeft: buttonleft,
    durationTextStyle: durationText,
    renderClose,
    renderDone,
  }

  constructor(...props) {
    super(...props);
    this.state = {
      isOpen: true,
      loading: true,
      time: 0,
      zoom: 0.0,
      recorded: false,
      recordedData: null,
      recordOptions: {},
      runAfterInteractions: true,
      typeCamera: false,
      isSwiping: false,
      type:RNCamera.Constants.Type.back
     
    };
  }
  componentDidMount() {
    const doPostMount = () => this.setState({ loading: false });
    if (this.props.runAfterInteractions) {
      InteractionManager.runAfterInteractions(doPostMount);
    } else {
      doPostMount();
    }
    this.open()
  }
  _onPinchStart = () => {
    this._prevPinch = 1
  }
  _onPinchEnd = () => {
    this._prevPinch = 1
  }
  _onPinchProgress = (p) => {
    let p2 = p - this._prevPinch
    if (p2 > 0 && p2 > ZOOM_F) {
      this._prevPinch = p
      this.setState({ zoom: Math.min(this.state.zoom + ZOOM_F, 1) }, () => {
      })
    }
    else if (p2 < 0 && p2 < -ZOOM_F) {
      this._prevPinch = p
      this.setState({ zoom: Math.max(this.state.zoom - ZOOM_F, 0) }, () => {
      })
    }
  }
  onSave = () => {
    // Actions.pop()
    if (this.callback) {
      this.callback(this.state.recordedData);
    }
    console.log("recordedData :::" + JSON.stringify(this.state.recordedData))
    this.setState({recorded:false})
    Actions.push("VideoRecording", { videoUrl: this.state.recordedData.uri })

  }
  open = (options, callback) => {
    this.callback = callback;
    this.setState({
      maxLength: 59,
      ...options,
      isOpen: true,
      isRecording: false,
      time: 0,
      recorded: false,
      recordedData: null,
      converting: false,
      count: 1,

    });
  }
  close = () => {
    if (this.callback) {
      this.callback(this.state.recordedData);
    }
    Actions.push("Home")
  //  Actions.push("HomeViewPager")
  }
  restartAndFlipCamera = async () => {
    const { type } = this.state;
    const isBackCamera = type === RNCamera.Constants.Type.back;
    const back = RNCamera.Constants.Type.back;
    const front = RNCamera.Constants.Type.front;
    const new_type = isBackCamera ? front : back;
    this.camera.stopRecording();
    this.setState({ type: new_type });
    // call again the method this.camera.startRecordingAsync() 
    // once component is re-rendered
    this.startCapture()
    console.log("again call startCapture ")

  }
  startCapture = () => {
    // console.log("call methos ")
    const shouldStartCapture = () => {
      this.camera.recordAsync(this.recordOptions)
        .then((data) => {
          // console.log('video capture', data);
          this.setState({
            recorded: true,
            recordedData: data,
          });
        }).catch(err => console.error(err));
      setTimeout(() => {
        this.startTimer();
        this.setState({
          isRecording: true,
          recorded: false,
          recordedData: null,
          time: 0,
        });
      });
    };
    if ((this.state.maxLength > 0) || (this.state.maxLength < 0)) {
      if (this.state.runAfterInteractions) {
        InteractionManager.runAfterInteractions(shouldStartCapture);
      } else {
        shouldStartCapture();
      }
    }
  }
  swippingStop(value) {
    console.log("value $$$ ", value)
    if (value == "1") {
      this.timerss = setInterval(() => {
        // console.log(" 2000  $$$ ", this.state.isSwiping, swippdata)
        if (this.state.isSwiping === true) {

        } else {
          //console.log("stop !!!!! ")
          this.stopCapture()
        }
      }, 500);
    } else {

    }
  }
  stopCapture = () => {
    const shouldStopCapture = () => {
      this.stopTimer();
      this.camera.stopRecording();
      this.setState({
        isRecording: false,
      });
    };
    if (this.props.runAfterInteractions) {
      InteractionManager.runAfterInteractions(shouldStopCapture);
    } else {
      shouldStopCapture();
    }
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      const time = this.state.time + 1;
      this.setState({ time });
      if (this.state.maxLength > 0 && time >= this.state.maxLength) {
        this.stopCapture();
      }
    }, 1000);
  }

  stopTimer = () => {
    if (this.timer) clearInterval(this.timer);
  }

  convertTimeString = (time) => {
    return moment().startOf('day').seconds(time).format('mm:ss');
  }

  renderTimer() {
    const { isRecording, time, recorded } = this.state;
    return (
      <View>
        {
          (recorded || isRecording) &&
          <Text style={this.props.durationTextStyle}>
            <Text style={styles.dotText}>●</Text> {this.convertTimeString(time)}
          </Text>
        }
      </View>
    );
  }
  onPress2 = () => {
    this.setState({
      count: 1,
      typeCamera: !this.state.typeCamera
    })
    // this.setState({
    //   count: this.state.count + 1,
    //   typeCamera: !this.state.typeCamera,
    // })
    if (this.state.count == 2) {
      //alert("double click")
      this.setState({
        count: 1,
        typeCamera: !this.state.typeCamera,
      })
    }
  }

  renderContent() {
    const { isRecording, recorded } = this.state;

    swippdata = this.state.isSwiping

    return (
      <View style={styles.controlLayer}>
        {this.renderTimer()}

        <View style={[styles.controls]}>
          <View style={{ width: '100%', marginBottom: 115 }}>
            {this.state.isSwiping === false ?
              <View style={{ width: width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 20, height: 20, marginRight: 10 }}>
                  <Image source={require('../../assets/lock.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                </View>
                <View style={{ marginRight: 110, }}>
                  <Swipeable
                    onSwipeRelease={() => this.setState({ isSwiping: true })}
                  >
                    <View style={{ width: 200, backgroundColor: 'red' }}>
                      <AnimatedCircularProgress
                        size={80}
                        width={5}
                        rotation={0}
                        fill={this.state.time}
                        tintColor="#00e0ff"
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#3d5875" >
                        {
                          (fill) => (
                            <TouchableHighlight style={{ width: 55, height: 55, backgroundColor: colors.themeColor, borderRadius: 50 }} isRecording={isRecording} onPressIn={this.startCapture}
                              onPressOut={() => this.swippingStop("1")} />
                          )
                        }
                      </AnimatedCircularProgress>
                    </View>
                  </Swipeable>
                </View>
              </View>
              :
              <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginRight: 28 }}>
                <View style={{ width: 25, height: 25, marginRight: 10, backgroundColor: '#fff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../../assets/lockblack.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                </View>
                <AnimatedCircularProgress
                  size={80}
                  width={5}
                  rotation={0}
                  fill={this.state.time}
                  tintColor="#00e0ff"
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#3d5875" >
                  {
                    (fill) => (
                      <TouchableOpacity style={{ width: 30, height: 30, backgroundColor: colors.themeColor, borderRadius: 0 }} isRecording={isRecording}
                        onPressOut={() => this.swippingStop("1")} />
                    )
                  }
                </AnimatedCircularProgress>
              </View>
            }
          </View>



          {/* <TouchableOpacity style={{ width: 50, height: 50, backgroundColor: colors.themeColor, borderRadius: 50 }} isRecording={isRecording} onPressIn={this.startCapture}
            onPressOut={this.stopCapture} /> */}
          {
            recorded &&
            <TouchableOpacity onPress={()=> this.onSave()} style={styles.btnUse}>
              {/* {this.props.renderDone()} */}
              {this.onSave()}
            </TouchableOpacity>
          }

        </View>
      </View>
    );
  }

  renderCamera() {
    const { isRecording, recorded } = this.state;
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={[styles.preview, { marginBottom: 0 }]}
        maxLength={59}
        
        type={this.state.typeCamera === false ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
        defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
       // videoBitrate={0.25 * 1000 * 1000}
        {...this.props.cameraOptions}
        zoom={this.state.zoom}
        maxZoom={MAX_ZOOM}
        
      >
       
        <ZoomView
          onPinchEnd={this._onPinchEnd}
          onPinchStart={this._onPinchStart}
          onPinchProgress={this._onPinchProgress}>
          {/* {this.renderContent()}  */}
        </ZoomView>
        {/* <View style={{ position: 'absolute', bottom: 0, height: 70, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.themeColor }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', height: 50, }}>
            <TouchableOpacity onPress={this.close} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
              <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'rgba(255,255,255,0.4)' }} source={require('../../assets/18.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.close} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
              <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'rgba(255,255,255,0.4)' }} source={require('../../assets/021.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
              <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/22.png')} />
            </TouchableOpacity>
          </View>
        </View> */}
      </RNCamera>
    );
  }

  handleClick() {
    //this.setState({typeCamera:true})
    alert('This is awesome \n Double tap succeed');
  }
  onSwipeLeft(gestureState) {
    this.setState({ myText: 'You swiped left!' });
    console.log("You swiped left!")
  }

  onSwipeRight(gestureState) {
    console.log("You swiped right!")
    this.setState({ myText: 'You swiped right!' });
  }
  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_RIGHT:
        this.close()
        break;
    }
  }
  render() {
    const { loading, isRecording, recorded, isOpen, typeCamera, zoom } = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    // console.log("zoom value::" + zoom)
    if (loading) return <View />;
    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        //onSwipeUp={(state) => this.onSwipeUp(state)}
        // onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }} >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={()=> this.onPress2()} style={{ flex: 1 }}>
            <View style={[styles.modal, { marginBottom: 100 }]}>
              <TouchableWithoutFeedback onPress={this.close}>
                <View style={styles.backdrop} >
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.container}>
                <View style={styles.content}>
                  {this.renderCamera()}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', top: 30, position: 'absolute', width: '90%' }}>
                  <TouchableOpacity onPress={() => this.setState({ typeCamera: !this.state.typeCamera })} style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 5, borderRadius: 50, width: 40, height: 30, alignItems: 'center' }} >
                    <Image source={require('../../assets/camera.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.close}>
                    {this.props.renderClose()}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            {this.state.isSwiping === false ?
              <View style={{ width: width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 20, height: 20, marginRight: 10 }}>
                  <Image source={require('../../assets/lock.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                </View>
                <View style={{ marginRight: 30, }}>
                <GestureRecognizer
                style={{alignSelf:'center'}}
                  onSwipe={(direction, state) => this.setState({ isSwiping: true })}>
                  {/* <Swipeable
                    onSwipeRelease={() => this.setState({ isSwiping: true })}
                  > */}
                      <AnimatedCircularProgress
                        size={80}
                        width={5}
                        fill={this.state.time}
                        rotation={0}
                        tintColor="#00e0ff"
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#3d5875" >
                        {
                          (fill) => (
                            <TouchableHighlight style={{ width: 55, height: 55, backgroundColor: colors.themeColor, borderRadius: 50 }}
                             isRecording={isRecording} 
                            onPressIn={this.startCapture}
                              onPressOut={() => this.swippingStop("1")}
                               />
                          )
                        }
                      </AnimatedCircularProgress>
                  </GestureRecognizer>
                </View>
              </View>
              :
              <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginRight: 28 }}>
                <View style={{ width: 25, height: 25, marginRight: 10, backgroundColor: '#fff', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={require('../../assets/lockblack.png')} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                </View>
                <AnimatedCircularProgress
                  size={80}
                  width={5}
                  rotation={0}
                  fill={this.state.time}
                  tintColor="#00e0ff"
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#3d5875" >
                  {
                    (fill) => (
                      <TouchableHighlight style={{ width: 30, height: 30, backgroundColor: colors.themeColor, borderRadius: 0 }} isRecording={isRecording}
                        onPress={()=>this.stopCapture()} />
                    )
                  }
                </AnimatedCircularProgress>
              </View>
            }
            {
              recorded &&
              <TouchableOpacity onPress={()=> this.onSave()} style={styles.btnUse}>
                {/* {this.props.renderDone()} */}
                {this.onSave()}
              </TouchableOpacity>
            }
            <View style={{ marginTop: 10, height: 70, bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.themeColor }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', height: 50, }}>
                <TouchableOpacity onPress={this.close} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ width: 22, height: 22, resizeMode: 'contain', opacity:3 }} source={require('../../assets/018.png')} />
                </TouchableOpacity>  
                <TouchableOpacity onPress={this.close} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ width: 22, height: 22, resizeMode: 'contain', opacity:4 }} source={require('../../assets/021.png')} />
                </TouchableOpacity>       
                <TouchableOpacity
                  style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                  <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/22.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </GestureRecognizer>

      // </DoubleClick>
    );
  }
}
/* ************************CSS Stye ****************************/
const styless = StyleSheet.create({
  preview: {
    height: Dimensions.get('window').height,
    width: "100%",
  }
});
