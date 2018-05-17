import React from 'react';
import {
    StyleSheet, StatusBar, Dimensions, ActivityIndicator, TextInput, TouchableOpacity, Image, SafeAreaView, View, Text, ImageBackground, KeyboardAvoidingView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import strings from '../strings/strings';
import colors from '../color/color'
import RNFetchBlob from 'rn-fetch-blob';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import moment from 'moment';
import SocketIO from "socket.io-client";
import Videos from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import RBSheet from "react-native-raw-bottom-sheet";
var vidoeUrl = "https://www.portal.storiz.eu/uploads/product_videos/2022-04-16T10-37-04.680Zname.mp4"
const html = `<script src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
import { WebView } from 'react-native-webview';
var vidoe_file_2 = 'file:///data/user/0/com.storiz.app/cache/Camera/5af35537-7049-44a9-bb0f-d702e0da2abc.mp4'

const connectionConfig = {
    secure: true,
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    //rejectUnauthorized: false
}
export default class WebVideoPlay extends React.Component {
    constructor(props, context) {
        super(props);
        this.onProgress = this.onProgress.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
        this.state = {
            isLoading: false,
            imagePath: '',
            user_name: '',
            user_image: '',
            price: '',
            condition: '',
            address: '',
            date: '',
            title: '',
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
            vidoeLodating: false,
            other_user_id: '',
            savedProducts: [],
            save_or_not: false,
            duration: null,
            isLoading2: false,
            playerState: PLAYER_STATES.PLAYING,
            currentTime: 0,
            isBuffering:false
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
      //  vidoe_file_2 = this.props.route.params.videoUrl
        // vidoeUrl = strings.base_video + this.props.route.params.videoUrl
        vidoeUrl = this.props.route.params.videoUrl.replace('/uploads/product_videos/', '');
        // vidoeUrl = item_data.videoslink[0].replace('/uploads/product_videos/', '');

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
                        this.viewProduct(this.props.route.params.product_id, user_id, token)
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
                // console.log(" responseData show-user===" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        senderName: responseData.user.username,
                        senderProfile: responseData.user.profile_image,
                        // savedProducts:responseData.user.savedProducts,
                        save_or_not: responseData.user.savedProducts.includes(this.props.route.params.product_id)
                    })
                    console.log(" responseData save_or_not===" + JSON.stringify(this.state.save_or_not));
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
    viewProduct(product_id, user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'viewProductOthers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                "id": product_id,
                otherId: user_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {

                if (responseData.success === true) {
                    //   console.log(" viewProductOthers ==" + JSON.stringify(responseData))
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
                        date: moment(responseData.product.createdAt).format("DD MMM YYYY"),
                        title: responseData.product.name,
                        other_user_id: responseData.user._id,
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
    saveProduct() {

        this.setState({
            //  isLoading: true
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

                if (responseData.status === true) {
                    //console.log(" responseDatagetMyProductList= newArr ==" + JSON.stringify(responseData.user))
                    this.setState({
                        isLoading: false,
                        save_or_not: true
                    })
                    // alert(responseData.message)
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
    unsaveProduct() {
        this.setState({
            // isLoading: true
        })
        fetch(strings.base_Url + 'unSaveProduct', {
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
                console.log(" unSaveProduct= newArr ==" + JSON.stringify(responseData))

                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                        save_or_not: false,

                    })
                    //  alert(responseData.message)
                } else {
                    this.setState({
                        isLoading: false
                    })
                    console.log(" responseDatagetMyProductList= newArr ==" + JSON.stringify(responseData.message))

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
            messageType: 'text',
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
        this.RBSheet.close()
        this.setState({ text_msg: '', chatMessageView: false })
        this.socket.on('chatsend', (data) => {
            console.log('chatsend  :::::' + JSON.stringify(data));
        })
    }
    handleMessage(event) {
        console.log("handleMessage", event)
        console.log("UrlhandleMessageevent ::" + event.url)
    }
    handleNavigation(event) {
        console.log("handleNavigation ", event)
        console.log("Url::: handleNavigation:" + event.loading)
        this.setState({ vidoeLodating: event.loading })
    }
    onSeek = seek => {
        console.log("currentTime " + this.state.currentTime + 10)
        var number
        this.videoPlayer.seek(this.state.currentTime + 10);
    };

    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState
        });
    };

    onReplay = () => {
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onProgress(data) {
        console.log("data ", data)
        this.setState({ currentTime: data.currentTime });
    }

    onLoad = data => this.setState({ duration: data.duration, isLoading2: false });

    onLoadStart = data => this.setState({ isLoading2: true });

    onEnd = () => {
        if (this.videoPlayer) {
            this.videoPlayer.seek(0);
        }
    };
    onBuffer({ isBuffering }) {
        console.log("data isBuffering ", isBuffering)
        this.setState({ isBuffering });
        }
    // playNext() {
    //     console.log("playNext  play ::::: ")
    //     //this.videoPlayer.seek(0);
    //     vidoe_file_2 = 'file:///data/user/0/com.storiz.app/cache/Camera/7312c3e9-b544-4a99-91f5-8730e730ae05.mp4'
    // }

      playNext(){
        // playNext() method takes the first item in the this.state.playlist array and moves it to the back
       console.log('video did just finish');
      vidoe_file_2 = 'file:///data/user/0/com.storiz.app/cache/Camera/7312c3e9-b544-4a99-91f5-8730e730ae05.mp4'
      }
    render() {
       // console.log("vidoeUrl  paly duration %%% " + this.state.duration)
       //file:///data/user/0/com.storiz.app/cache/Camera/7312c3e9-b544-4a99-91f5-8730e730ae05.mp4
        return (
            <KeyboardAvoidingView behavior='position' style={{ backgroundColor: 'white', flex: 1 }}>
                <ImageBackground
                    source={{ uri: this.props.route.params.posterImage }}
                    style={{ width: width, height: height, backgroundColor: 'white',marginTop:40, }}>
                        <Videos
                        source={{ uri:  vidoe_file_2}}   // Can be a URL or a local file.
                        bufferConfig={{
                            minBufferMs: 15000,
                            maxBufferMs: 50000,
                            bufferForPlaybackMs: 2500,
                            bufferForPlaybackAfterRebufferMs: 5000
                        }}
                        maxBitRate={2000000}
                        fullscreenOrientation='portrait'
                        playInBackground={true}                       
                        onBuffer={this.onBuffer} 
                                       // Callback when remote video is buffering
                        onError={this.videoError}
                        fullscreen={true}
                        onEnd={() => { alert('play next video  Done!') + this.playNext()}}
                        onLoad={this.onLoad}
                        paused={this.state.paused}
                        onProgress={this.onProgress}
                        onLoadStart={this.onLoadStart}
                        ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                        // Callback when video cannot be loaded
                        style={{

                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }} />
                       
                  
                   

                    {/* <WebView
                        style={{ marginLeft: -10, marginTop: -10, bottom: 0, width: 500, height: 600, backgroundColor: "transparent" }}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        onMessage={(event) => this.handleMessage(event)}
                        onNavigationStateChange={(event) => this.handleNavigation(event)}
                        javaScriptEnabled={true}
                        source={{
                            baseUrl: RNFetchBlob.fs.dirs.DocumentDir, html,
                            html: `<html>
                            <body>
                               <video 
                               width: ${width}
                               height: ${height}    autoplay loop  >
                               <source src="${strings.base_Url + 'playVideo?filename=' + vidoeUrl}" type="video/mp4"
                                          Your browser does not support the video 
                                </video>
                             </body>
                          </html>`
                        }}
                    >
                    </WebView> */}
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent", bottom: 0 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Tabs", { type_index: 1 })} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff' }}
                                source={require('../assets/25.png')} />
                        </TouchableOpacity>
                        <View style={{ width: '100%', alignSelf: 'center', justifyContent: 'space-between', flex: 1 }}>
                            <View>
                                <View style={{ alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SeeUserProfile", { other_user_id: this.state.other_user_id })} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', }}>
                                        <Image style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 50 }} source={this.state.user_image} />
                                        <View>
                                            <Text style={[styles.font_regu, { fontSize: 17, color: '#fff', paddingLeft: 5, }]}> {this.state.user_name} </Text>
                                            <Text style={[styles.font_regu, { fontSize: 14, color: 'grey', paddingLeft: 5, }]}>Le {this.state.date} </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ width: '50%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: '50%', height: 40, justifyContent: 'center', marginRight: 10, alignItems: 'center', borderRadius: 50, backgroundColor: 'rgba(255,255,255,1)' }}>
                                            <Text style={[styles.font_regu, { padding: 4, fontSize: 14, color: colors.textColorBlack, textAlign: 'center', fontWeight: 'bold' }]}>{this.state.address}</Text>
                                        </View>
                                        {this.props.route.params.save == 'true' ? null :
                                            <View>
                                                {this.state.save_or_not === false ?
                                                    <TouchableOpacity onPress={() => this.saveProduct() + this.setState({ save_or_not: true })} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'rgba(255,255,255,1)' }}>
                                                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../assets/not_save.png')} />
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity onPress={() => this.unsaveProduct() + this.setState({ save_or_not: false })} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: 'rgba(255,255,255,1)' }}>
                                                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../assets/11.png')} />
                                                    </TouchableOpacity>
                                                }
                                            </View>

                                        }
                                    </View>
                                </View>
                                <Text style={[styles.font_regu, { alignSelf: 'center', marginTop: 20, fontSize: 20, fontWeight: 'bold', color: '#fff', paddingLeft: 5, }]}> {this.state.title} </Text>
                            </View>


                            {this.state.isLoading === false ?
                                <View>
                                    {this.state.isLoading2 === false ? null :
                                        <ActivityIndicator size="large" color={colors.themeColor} />
                                    }
                                </View>
                                :
                                <View style={{ alignSelf: 'center' }}>
                                    {this.state.isLoading === true && (
                                        <View style={[styles.lodaing_view, { width: 50, height: 50, }]}>
                                            <ActivityIndicator size="large" color={colors.themeColor} />
                                        </View>
                                    )
                                    }
                                </View>
                            }

                            <View>
                                {this.state.chatMessageView === true ?
                                    // <View style={{ justifyContent: 'flex-end', bottom: 30 }}>
                                    //     <TouchableOpacity onPress={() => this.setState({ chatMessageView: false })} style={{ alignSelf: 'flex-end', marginLeft: 10, marginBottom: 30, marginRight: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                    //         <Image source={require('../assets/cancel.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 0, tintColor: '#fff' }} />
                                    //     </TouchableOpacity>
                                    //     <View style={{ borderRadius: 50, alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
                                    //         <TextInput
                                    //             value={this.state.text_msg}
                                    //             placeholder={'Ecrire un message ...'}
                                    //             placeholderTextColor={colors.textGrey}
                                    //             multiline={true}
                                    //             onChangeText={(text_msg) => this.setState({ text_msg })}
                                    //             style={[styles.font_regu, { color: '#fff', padding: 8, paddingLeft: 20, width: width * 85 / 100 - 30, fontSize: 16, elevation: 5, borderRadius: 50, backgroundColor: 'rgba(180,180,180,0.5)' }]}
                                    //         />
                                    //         <TouchableOpacity onPress={() => this.validation()} style={{ marginLeft: 10, marginRight: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                    //             <Image source={require('../assets/23.png')} style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} />
                                    //         </TouchableOpacity>
                                    //     </View>
                                    // </View>
                                    null
                                    :
                                    <View style={{ alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 80 }}>
                                        <View style={{ justifyContent: 'center', }}>
                                            <TouchableOpacity onPress={this.onSeek} style={{ width: 130, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {this.state.price} </Text>
                                            </TouchableOpacity>
                                            <View style={{ marginTop: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, paddingRight: 5 }]}> {this.state.condition} </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ chatMessageView: false }) + this.RBSheet.open()} style={{ width: 60, height: 40, borderRadius: 50, backgroundColor: colors.themeColor, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ width: 25, height: 25, resizeMode: 'contain', }} source={require('../assets/2.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <RBSheet
                        ref={ref => { this.RBSheet = ref; }}
                        height={100}
                        duration={100}
                        customStyles={{
                            container: {
                                alignItems: "center",
                                borderRadius: 0,
                                backgroundColor: '#fff',
                                justifyContent: 'center'
                            }
                        }}>
                        <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'column', borderWidth: 0.5, borderColor: 'white', borderRadius: 4, }}>
                            <View style={{ backgroundColor: '#fff', marginBottom: 0, height: 60, alignItems: 'center' }}>
                                <View style={{ width: '95%', height: 40, borderRadius: 50, marginLeft: 5, marginRight: 5, marginTop: 5, flexDirection: 'row' }}>
                                    <View style={{ position: 'absolute', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', bottom: 0, width: width * 95 / 100, alignSelf: 'center', borderRadius: 20, height: 45 }}>
                                        <TextInput
                                            value={this.state.text_msg}
                                            placeholder={'Ecrire un message ...'}
                                            placeholderTextColor='grey'
                                            multiline={true}
                                            onChangeText={(text_msg) => this.setState({ text_msg })}
                                            style={[styles.font_regu, { color: '#000', padding: 8, paddingLeft: 20, width: width * 88 / 100 - 30, fontSize: 16, backgroundColor: 'rgba(180,180,180,0.1)', elevation: 0, borderRadius: 50 }]}
                                        />
                                        <TouchableOpacity onPress={() => this.validation()} style={{ marginRight: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                            <Image source={require('../assets/send.png')} style={{ width: 20, height: 20, resizeMode: 'contain', }} />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </RBSheet>
                </ImageBackground>
            </KeyboardAvoidingView>

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
        height: 40, backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 30, marginBottom: 5,
        paddingHorizontal: 10,
        marginTop: 10
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