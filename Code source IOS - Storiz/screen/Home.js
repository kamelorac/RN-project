import React from 'react';
import {
    StyleSheet, StatusBar, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import VideoRecording from './VideoRecording';
import Message from './Message';
import Store from './Store';
//import RecordingCamera from '../screen/RecordingVideo/RecordingCamera'
import RecordingCamera from '../screen/ZoomVideoCamera'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import strings from '../strings/strings';
export default class Home extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            index: 1,
            email: '', emailErr: '',
            password: '', passwordErr: '',
            showpassword: true,
            unreadMessages:0
        };
    }
    start = () => {
        // 30 seconds
        this.videoRecorder.open({ maxLength: 30 }, (data) => {
            console.log('captured data', data);
            this.setState({ videoUrl: data.uri })
            this.props.navigation.navigate("VideoRecording", { videoUrl: data.uri })
        });
        // console.log('captured data', 'null');
    }
    componentDidMount() {
        if (this.props.type_index == 0) {
            this.setState({ index: 0 })
        } else {
            this.setState({ index: 1 })
        }
       // this.timer = setInterval(() => this.wll_focus() , 15000)
      //  clearInterval(this.state.timer);
        this.wll_focus() 
    }
    wll_focus(){
        AsyncStorage.getItem("user_id")
        .then(user_id => {
            this.setState({ user_id: user_id });
            console.log("state userId============" + user_id);
            AsyncStorage.getItem("token")
                .then(token => {
                    //var tokens = JSON.parse(token)
                    this.setState({ token: token });
                    console.log("state token=====SSSS=======" + token);
                    this.unreadMessageCount(user_id, token)
                })
        })
    }
    unreadMessageCount(user_id, token) {
        fetch(strings.base_Url + 'unreadMessageCount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ "id": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("messages::unreadMessageCount: $$$$$:" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                       
                        unreadMessages:responseData.unreadMessages
                    })
                } else {
                    this.setState({
                       
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                          this.props.navigation.navigate("Login")         
                                     AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("responsenewSubscribedCounterr::unreadMessageCount:" + err);
                this.setState({
                    
                });
            });
    }

    onSwipeUp(gestureState) {
        this.setState({ myText: 'You swiped up!' });
    }

    onSwipeDown(gestureState) {
        this.setState({ myText: 'You swiped down!' });
    }

    onSwipeLeft(gestureState) {
        this.setState({ myText: 'You swiped left!' });
    }

    onSwipeRight(gestureState) {
        this.setState({ myText: 'You swiped right!' });
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        this.setState({ gestureName: gestureName });
        switch (gestureName) {

            case SWIPE_LEFT:
                if (this.state.index == 0) {
                    this.setState({ index: 1 })
                } else {
                    this.setState({ index: 2 })
                }
                //this.setState({backgroundColor: 'blue'});
                break;
            case SWIPE_RIGHT:
                if (this.state.index == 2) {
                    this.setState({ index: 1 })
                } else {
                    this.setState({ index: 0 })
                }
                //this.setState({backgroundColor: 'yellow'});
                break;
        }
    }
    render() {
        let AppComponent = null;
        if (this.state.index == 0) {
            AppComponent = Message
        } else if (this.state.index == 1) {
            AppComponent = Store
        } else {
            AppComponent =RecordingCamera;
            this.props.navigation.navigate("RecordingCamera")
            //this.props.navigation.navigate("VideoRecording", { videoUrl: 'https://cfcdn.streamlike.com/c/1695d77efaa21d05/medias/42aefccd81460d6d/files/mp4/42aefccd81460d6d_1920_1080_4312_192_high.mp4' })

        }
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
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
                }}
            >
             
                <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
                  
                    {/* {this.state.index == 0 && (
                    <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.font_regu, { fontSize: 25, fontWeight: 'bold', color: colors.themeColor, marginLeft: 20 }]}>Messages</Text>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate("Profile")} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/7.png')} />
                        </TouchableOpacity>
                    </View>
                )
                } */}
                    {/* {this.state.index == 2 && (
                    <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.font_regu, { fontSize: 25, fontWeight: 'bold', color: colors.themeColor, marginTop: 0 }]}>Storiz</Text>
                        <TouchableOpacity style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/7.png')} />
                        </TouchableOpacity>
                    </View>
                )
                } */}
                    {/* {this.state.index == 1 && (
                    <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.font_regu, { fontSize: 20, fontWeight: 'bold', color: colors.themeColor, marginTop: 0 }]}>Store</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/16.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'black' }} source={require('../assets/search.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', }} source={require('../assets/7.png')} />
                            </TouchableOpacity>
                        </View>

                    </View>
                )
                } */}
                   
                    <View style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}>
                 
                        {this.state.index == 2 ?  null :
                            <AppComponent />
                        }
                        {/* <AppComponent /> */}
                
                    </View>
                   
                    <View style={{ position: 'absolute', bottom: 0, height: 80, width: '100%', alignItems: 'center', backgroundColor: colors.themeColor }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', height: 70,alignItems:'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ index: 0 })} style={{ width: 45, height: 45,flexDirection:'row', justifyContent: 'center', alignItems: 'center', }}>
                                {this.state.index == 0 ?
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/18.png')} />
                                    :
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain', }} source={require('../assets/018.png')} />
                                }
                                {this.state.unreadMessages != 0 ?
                                <View style={{width:10,height:10,borderRadius:50,backgroundColor:'red',marginTop:-8,marginLeft:-5}} />:null

                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ index: 1 })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                                {this.state.index == 1 ?
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../assets/21.png')} />
                                    :
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../assets/021.png')} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>
                                // this.start()
                                this.setState({ index: 2 })
                                // this.props.navigation.navigate("RecordingCamera")
                            }
                                style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                                {this.state.index == 2 ?
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../assets/22.png')} />
                                    :
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: 'rgba(255,255,255,0.5)' }} source={require('../assets/22.png')} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                </SafeAreaView>
               
            </GestureRecognizer>
        );
    }
}

/* ************************CSS Stye ****************************/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    font_medi: {
        fontWeight:'800'
    },
    font_regu: {
       fontWeight:'800'
    },
    font_bold: {
        fontFamily: 'CamSemiItalic'
    },
    input_view: {
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.textGrey,
        justifyContent: 'center'
    },
    lodaing_view: {
        height: 50, backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 8, marginBottom: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        alignItems: 'center', justifyContent: 'center'
    },

});
