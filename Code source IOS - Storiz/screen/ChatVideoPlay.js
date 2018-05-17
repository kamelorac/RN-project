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
var vidoeUrl = "https://3d4f-2401-4900-1c19-3bbc-8ce5-732a-6f2e-510.ngrok.io/uploads/chat_media/2022-06-24T07-32-10.092Zname.mp4"
const html = `<script 
 src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
import { WebView } from 'react-native-webview';
export default class ChatVideoPlay extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isLoading: false,
            video_name: this.props.route.params.video_url
        };
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

    render() {
        console.log("video_name  $$$ " + this.state.video_name)
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ width: '100%', height: 50,backgroundColor:'#000',marginTop:50 }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff' }}
                                source={require('../assets/25.png')} />
                        </TouchableOpacity>
                </View>
                <WebView
                    style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: "#000" }}
                    allowsFullscreenVideo={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    onMessage={(event) => this.handleMessage(event)}
                    onNavigationStateChange={(event) => this.handleNavigation(event)}
                    javaScriptEnabled={true}
                    source={{ uri: strings.base_video + this.state.video_name }}
                >
                </WebView>
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