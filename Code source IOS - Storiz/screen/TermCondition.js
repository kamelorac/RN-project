import React from 'react';
import {
    StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import strings from '../strings/strings'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { WebView } from 'react-native-webview';
export default class TermCondition extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            temp:this.props.route.params.link_data
        };
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginLeft: 10, alignItems: 'center', width: 45, height: 45, justifyContent: 'center', marginTop: 10, marginBottom: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../assets/25.png')} />
                </TouchableOpacity>
                <WebView source={{
                    uri: 'https://www.portal.storiz.eu/'+this.state.temp
                   // uri: 'https://www.portal.storiz.eu/uploads/product_videos/2022-04-16T10-37-04.680Zname.mp4'
                }}
                    style={{ overflow: 'scroll', marginLeft: 0}}
                    originWhitelist={["*"]}
                    mixedContentMode={'always'}
                    useWebKit={Platform.OS == 'ios'}
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