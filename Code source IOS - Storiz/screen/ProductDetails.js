import React from 'react';
import {
    StyleSheet, StatusBar, Platform, ActivityIndicator, FlatList, TextInput, ImageBackground, Dimensions, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import colors from '../color/color'
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import strings from '../strings/strings';
import Video from "react-native-video"
import SocketIO from "socket.io-client";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import moment from 'moment';
import { WebView } from 'react-native-webview';
import 'moment/locale/fr';
import RNFetchBlob from 'rn-fetch-blob';
var vidoeUrl = "https://www.portal.storiz.eu/uploads/product_videos/2022-04-16T10-37-04.680Zname.mp4"
const html = `<script 

 src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
const connectionConfig = {
    secure: true,
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    //rejectUnauthorized: false
}
export default class ProductDetails extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isLoading: false,
            // paused: false,
            //playerState: PLAYER_STATES.PLAYING,
            // playvideo: false,
            videoUrl: 'https://cfcdn.streamlike.com/c/1695d77efaa21d05/medias/42aefccd81460d6d/files/mp4/42aefccd81460d6d_1920_1080_4312_192_high.mp4',
            imagePath: '',
            user_name: '',
            user_image: '',
            price: '',
            condition: '',
            address: '',
            date: '',
            title: '',
            currentTime: 0,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: false,
           // playerState: PLAYER_STATES.PLAYING,
            video_play: false,
            user_id: '',
            token: '',
            recieverId: '',
            receiverName: '',
            receiverProfile: '',
            senderId: '',
            senderName: '',
            senderProfile: '',
            productID: '',
            productName: '',
            chatMessageView: false,
            text_msg: '',


        };
    }
    componentDidMount() {
        this.socket = SocketIO(strings.base_sckote, connectionConfig);
        this.socket.on('connect', () => {
            console.log('connected to Storize server');
        });
        this.socket.on('connect_error', (err) => {
            console.log(err);
        });
        console.log("videoUrl %%%%  " + this.props.route.params.videoUrl)
        console.log("posterImage %%%%  " + this.props.route.params.posterImage)
        console.log("product_id  %%%%  " + this.props.route.params.product_id)
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });
                        console.log("state token============" + token);
                        this.viewProduct(this.props.route.params.product_id, token)
                        this.getprofile(user_id, token)
                    })
            })
      
    }
    getprofile(user_id, token) {
        this.setState({
            //isLoading: true
        })
        fetch(strings.base_Url + 'show-user/' + user_id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            // body: JSON.stringify({})
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData show-user===" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        senderName: responseData.user.username,
                        senderProfile: responseData.user.profile_image
                    })
                } else {
                    this.setState({
                        //  isLoading: false
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                          this.props.navigation.navigate("Login")        
                                      AsyncStorage.setItem("token", '');
                    }
                    alert(responseData.message)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    viewProduct(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'viewProduct', {
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

                if (responseData.success === true) {
                    console.log(" viewProduct ==" + JSON.stringify(responseData))
                    var profiles = ''
                    if (responseData.user.profile_image == "false") {
                        profiles = require('../assets/4.png')
                    } else {
                        profiles = { uri: strings.base_image + responseData.user.profile_image }
                    }
                    this.setState({
                        isLoading: false,
                        user_name: responseData.user.username,
                        user_image: profiles,
                        price: responseData.product.price + responseData.product.currency,
                        condition: responseData.product.condition,
                        address: responseData.product.city,
                        date: moment(responseData.product.createdAt).format("DD,MMM YYYY"),
                        title: responseData.product.name,

                        recieverId: responseData.user._id,
                        receiverName: responseData.user.username,
                        receiverProfile: responseData.user.profile_image,
                        productID: responseData.product._id,
                        productName: responseData.product.name

                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    onSeek = seek => {
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState
        });
    };

    onReplay = () => {
        console.log("on reply calll :::: ")
        // this.onLoadStart()
       // this.setState({ playerState: PLAYER_STATES.PLAYING, paused: true });
        this.videoPlayer.seek(0);
    };

    // onProgress = data => {
    //     const { isLoading, playerState } = this.state;
    //     // Video Player will continue progress even if the video already ended
    //     if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
    //         this.setState({ currentTime: data.currentTime });
    //     }
    // };
    onSeeking = seek => {
        this.videoPlayer.seek(seek);
    };

    onLoad = data => this.setState({ duration: data.duration, isLoading: false });

    onLoadStart = data => this.setState({ isLoading: true });

  //  onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });

    onError = () => alert("Oh! ", error);

    exitFullScreen = () => { };

    enterFullScreen = () => { };

    onFullScreen = () => { };

    saveProduct() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'saveProduct', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "productId": this.props.route.params.product_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {

                if (responseData.success === true) {
                    console.log(" responseDatagetMyProductList= newArr ==" + JSON.stringify(responseData.user))
                    this.setState({
                        isLoading: false,
                    })
                    alert(responseData.message)
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.message)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    validation() {
        if (this.state.text_msg == '') {
        } else {
            this.submitChatMessage()
        }
    }
    submitChatMessage() {
        console.log("send msg ::::")
        var msg_sent = {
            message: this.state.text_msg,
            recieverId: this.state.recieverId,
            receiverName: this.state.receiverName,
            receiverProfile: this.state.receiverProfile,
            senderId: this.state.user_id,
            senderName: this.state.senderName,
            senderProfile: this.state.senderProfile,
            productID: this.state.productID,
            productName: this.state.productName

        }
        console.log(msg_sent)
        this.socket.emit('chat', msg_sent);
        this.setState({ text_msg: '', chatMessageView: false })
        this.socket.on('chatsend', (data) => {
            console.log('chatsend  :::::' + JSON.stringify(data));
        })

    }


    render() {
        moment.locale('fr');
        let { currentTime, duration, paused } = this.state;
        let { onClosePressed, video, volume } = this.props;
        return (
 <SafeAreaView style={{  alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent"  }}>
               


                {this.state.video_play === false ?
                    <ImageBackground style={{ width: '100%', height: '100%', }}
                        source={{ uri: this.props.route.params.posterImage }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/25.png')} />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'space-between', flex: 1 }}>
                            <View>
                                <View style={{ alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', }}>
                                        <Image style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 50 }} source={this.state.user_image} />
                                        <View>
                                            <Text style={[styles.font_regu, { fontSize: 17, color: '#fff', paddingLeft: 5, }]}> {this.state.user_name} </Text>
                                            <Text style={[styles.font_regu, { fontSize: 14, color: 'grey', paddingLeft: 5, }]}> Le {this.state.date} </Text>

                                        </View>
                                    </View>
                                    <View style={{ width: '50%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: '70%', height: 40, justifyContent: 'center', marginRight: 10, alignItems: 'center', borderRadius: 50, backgroundColor: 'rgba(255,255,255,1)' }}>
                                            <Text style={[styles.font_regu, { padding: 4, fontSize: 14, color: colors.textColorBlack, textAlign: 'center',fontWeight:'bold' }]}>{this.state.address}</Text>
                                        </View>
                                        {this.props.route.params.save == 'true' ? null :
                                            <TouchableOpacity onPress={() => this.saveProduct()} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'rgba(255,255,255,1)' }}>
                                                <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../assets/11.png')} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                <Text style={[styles.font_regu, { alignSelf: 'center', marginTop: 20, fontSize: 20, fontWeight: 'bold', color: '#fff', paddingLeft: 5, }]}> {this.state.title} </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ video_play: true })} style={{ width: 40, height: 40, backgroundColor: colors.themeColor, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/ui_play.png')} />
                            </TouchableOpacity>
                            <View>
                                {this.state.chatMessageView === true ?
                                    <View>
                                        <TouchableOpacity onPress={() => this.setState({ chatMessageView: false })} style={{ alignSelf: 'flex-end', marginLeft: 10, marginBottom: 30, marginRight: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                            <Image source={require('../assets/cancel.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 0, tintColor: '#fff' }} />
                                        </TouchableOpacity>
                                        <View style={{ borderRadius: 50, alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
                                            <TextInput
                                                value={this.state.text_msg}
                                                placeholder={'Ecrire un message ...'}
                                                placeholderTextColor='#fff'
                                                multiline={true}
                                                onChangeText={(text_msg) => this.setState({ text_msg })}
                                                style={[styles.font_regu, { color: '#fff', padding: 8, paddingLeft: 20, width: width * 85 / 100 - 30, fontSize: 16, elevation: 5, borderRadius: 50, backgroundColor: 'rgba(180,180,180,0.5)' }]}
                                            />
                                            <TouchableOpacity onPress={() => this.validation()} style={{ marginLeft: 10, marginRight: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                                <Image source={require('../assets/23.png')} style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View> :
                                    <View style={{ alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
                                        <View style={{ justifyContent: 'center', }}>
                                            <View style={{ width: 130, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {this.state.price} </Text>
                                            </View>
                                            <View style={{ marginTop: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, paddingRight: 5 }]}> {this.state.condition} </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ chatMessageView: true })} style={{ width: 60, height: 40, borderRadius: 50, backgroundColor: colors.themeColor, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ width: 25, height: 25, resizeMode: 'contain', }} source={require('../assets/2.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </ImageBackground> :
                    <View style={{ width: width, height: height }}>
                        <TouchableOpacity onPress={() => { this.setState({ video_play: false, paused: false }) }} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../assets/cancel.png')} />
                        </TouchableOpacity>
                       
                        <WebView
                        source={{
                            uri:  strings.base_video + this.props.route.params.videoUrl
                            //uri: 'https://www.portal.storiz.eu/uploads/product_videos/2022-04-16T10-37-04.680Zname.mp4'
                        }} 
                            style={{ overflow: 'scroll', marginLeft: 0 }}
                            originWhitelist={["*"]}
                            mixedContentMode={'always'}
                            useWebKit={Platform.OS == 'ios'}
                            mediaPlaybackRequiresUserAction={true}
                            //onError={() => {alert('Error Occured'); this.props.navigation.goBack()}}
                            // onLoadEnd={() => this.passValues()}
                            ref="webview"
                            thirdPartyCookiesEnabled={true}
                            scrollEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            injectedJavaScript={this.patchPostMessageJsCode}
                            allowUniversalAccessFromFileURLs={true}
                            javaScriptEnabled={true}
                        />
                        {/* <View style={{ width: '100%', height: '100%' }}>
                            <Video
                                volume={0.0}
                                resizeMode="cover"
                                onEnd={this.onEnd}
                                onLoad={this.onLoad}
                                paused={this.state.paused}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: "black"
                                }}
                                onProgress={this.onProgress}
                                onLoadStart={this.onLoadStart}
                                ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                source={{ uri: strings.base_video + this.props.route.params.videoUrl }}
                            >
                            </Video>
                            <MediaControls
                                mainColor={colors.themeColor}
                                onSeek={this.onSeek}
                                onReplay={this.onReplay}
                                onPaused={this.onPaused}
                               onSeeking={this.onSeeking}
                                duration={this.state.duration}
                                // toolbar={this.renderToolbar()}
                                isLoading={this.state.isLoading}
                                onFullScreen={this.onFullScreen}
                                progress={this.state.currentTime}
                                playerState={this.state.playerState}
                            />
                        </View> */}
                    </View>

                }

                {this.state.isLoading === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent" }}>
                        <View style={[styles.lodaing_view, { width: 50, height: 50, }]}>
                            <ActivityIndicator size="large" color={colors.themeColor} />
                        </View>
                    </View>
                )
                }
            </SafeAreaView >
          
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
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 8, marginBottom: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center'
    },
    fullScreen: {
        flex: 1,
        backgroundColor: "black"
    },
    videoView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    videoContainerAndroid: {
        height: "100%",
        width: "100%"
    },
    videoContainerIOS: {
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width,
        minWidth: Dimensions.get('window').height,
        minHeight: Dimensions.get('window').width,
        width: Dimensions.get('screen').height,
        height: Dimensions.get('screen').width,

        transform: [{ rotate: '90deg' }],
    },
    videoIcon: {
        width: 50,
        height: 50
    },
    pauseImageWrapper: {
        alignItems: 'center',
        alignSelf: 'center',
        position: "absolute",
    },
    backButtonWrapper: {
        backgroundColor: 'red',
        position: 'absolute',
        zIndex: 1,
        alignSelf: "flex-end"
    }

});

{/* <CameraScreen
                    // Barcode props
                    scanBarcode={false}
                    onReadCode={(event) => Alert.alert('QR code found')} // optional
                    showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                    laserColor='red' // (default red) optional, color of laser in scanner frame
                    frameColor='white' // (default white) optional, color of border of scanner frame
                /> */}