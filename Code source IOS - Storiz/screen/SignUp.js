import React from 'react';
import {
    StyleSheet, StatusBar, TouchableOpacity, SafeAreaView, View, Text,Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import RNFetchBlob from 'rn-fetch-blob';

const html = `<script 

 src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
 import { WebView } from 'react-native-webview';

export default class Splash extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.themeColor }}>
               
                <View style={{width:'100%', height: '100%', justifyContent: 'space-between', flexDirection: 'column', }}>
                    <View style={{alignItems:'center',height:300,justifyContent:'center'}} >
                    {/* <Text style={[styles.font_regu,{ fontSize: 102,fontWeight:'bold', color:colors.testColorWhite,marginBottom:0}]}>Sz</Text> */}
                    <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={require('../assets/logo.png')} />
                    </View>
                    <View style={{ width: '100%',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>  this.props.navigation.navigate("Login")} style={{width:'90%',height:55,backgroundColor:'#fff',borderRadius:20,marginBottom:20,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ fontSize: 14, color: '#000',fontWeight:'bold'}}>Se connecter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Register")} style={{width:'90%',height:55,borderWidth:1,borderColor:'#fff',borderRadius:20,marginBottom:100,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ fontSize: 14, color: '#fff',fontWeight:'bold'}}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        fontWeight:'800'
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