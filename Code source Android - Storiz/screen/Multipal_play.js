import React from 'react';
import {
    StyleSheet, StatusBar, Dimensions, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Image, SafeAreaView, View, Text, ImageBackground, KeyboardAvoidingView,
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
import RBSheet from "react-native-raw-bottom-sheet";
var vidoeUrl = "https://www.portal.storiz.eu/uploads/product_videos/2022-04-16T10-37-04.680Zname.mp4"
const html = `<script 
 src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
import { WebView } from 'react-native-webview';
var index_poss = 0;
const connectionConfig = {
    secure: true,
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    //rejectUnauthorized: false
}
import Video from 'react-native-video';
export default class Multipal_Play extends React.Component {
    constructor(props, context) {
        super(props);
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
            messageList: [{}, {}, {}]
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
        console.log("videoUrl %%%%  " + this.props.videoUrl)
        // vidoeUrl = strings.base_video + this.props.videoUrl
        vidoeUrl = this.props.videoUrl.replace('/uploads/product_videos/', '');
        console.log("posterImage %%%%  " + this.props.posterImage)
        console.log("product_id  %%%%  " + this.props.product_id)
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });
                        console.log("state token============" + token);
                        //   this.viewProduct(this.props.product_id, user_id, token)
                        //  this.getprofile(user_id, token)
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
                          Actions.push("Login")            
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
                    console.log(" viewProductOthers ==" + JSON.stringify(responseData))
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
                "productId": this.props.product_id
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
    possition() {
        index_poss = index_poss + 1
    }
    leftswipe(id) {
        console.log('leftswipe:::::' + JSON.stringify(id))
    }
    rightswipe(id) {
        console.log('rightswipe:::::' + JSON.stringify(id))
    }

    render() {
        console.log(" vide path base  " + strings.base_Url + 'playVideo?filename=' + '2022-04-20T08-49-33.313Zname.mp4')
        return (


            <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>

                <Video source={
                    // { uri: strings.base_Url + 'playVideo?filename=' + '2022-04-20T08-49-33.313Zname.mp4' }
                    {
                        uri: strings.base_Url + 'playVideo?filename=' + vidoeUrl,
                        // headers: {
                        //   Authorization: 'bearer some-token-value',
                        //   'X-Custom-Header': 'some value'
                        // }
                      }
                }   // Can be a URL or a local file.
                    ref={(ref) => {
                        this.player = ref
                    }} 
                    bufferConfig={{
                        minBufferMs: 15000,
                        maxBufferMs: 50000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000
                      }}
                      maxBitRate={2000000} 
                      controls={true}
                      minLoadRetryCount={5}                                     // Store reference
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    onError={this.videoError}               // Callback when video cannot be loaded
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }} />
            </SafeAreaView>





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
        fontFamily: 'CamptonMediumItalic'
    },
    font_regu: {
        fontFamily: 'CamptonMedium'
    },
    font_bold: {
        fontFamily: 'CamptonSemiBoldItalic'
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