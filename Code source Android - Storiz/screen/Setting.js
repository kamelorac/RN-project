import React from 'react';
import {
    StyleSheet,Alert, StatusBar,ActivityIndicator, TouchableOpacity, SafeAreaView,Linking, View, Text, Image, Modal, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import strings from '../strings/strings';
export default class Setting extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
        this.wll_focus() 
    }
    wll_focus(){
        AsyncStorage.getItem("user_id")
        .then(user_id => {
            this.setState({ user_id: user_id });
            console.log("state userId============" + user_id);
            AsyncStorage.getItem("token")
                .then(token => {
                    this.setState({ token: token });
                    console.log("state token=====SSSS=======" + token);
                })
        })
    }
    logout() {
        this.setState({
            isLoading:true
        })
        fetch(strings.base_Url + 'logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({ "id": this.state.user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("messages::logout: $$$$$:" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading:false
                    })
                    this.logout2()
                } else {
                    this.setState({
                        isLoading:false
                    })
                }
            }
            ).catch((err) => {
                console.log("logout::unreadMessageCount:" + err);
                this.setState({
                    isLoading:false
                })
            });
    }
    logoutAlert() {
        Alert.alert(
            "Storiz",
            'Vous êtes sûr de vouloir vous déconnecter',

            [
                {
                    text: 'Déconnexion',
                    onPress: () => { this.logout() },
                    style: 'cancel',
                },
                { text: 'Annuler', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        )
    }
    logout2(){
      //  this.setState({logoutdailog:false})
        AsyncStorage.setItem("token", '');
          Actions.push("Login")                
    }

    render() {
       
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
               
                <TouchableOpacity onPress={() => Actions.pop()} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                </TouchableOpacity>
                <ScrollView style={{ width: '100%' }}>
                    <View style={{ width: '100%', alignItems: 'center',marginBottom:50 }}>
                        <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 25, color: colors.textColorBlack }]}>
                            {'Paramètres'}
                        </Text>

                        <TouchableOpacity onPress={()=>Actions.push("PersonalInfo")} style={{marginTop:80, flexDirection: 'row', alignItems: 'center', width: '85%', height: 75, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 40 }} source={require('../assets/7.png')} />
                            <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {'Informations personnelles'}
                            </Text>
                        </TouchableOpacity>
                        
                      
                        <TouchableOpacity onPress={()=>Actions.push("BlockProfile")} style={{marginTop:50, flexDirection: 'row', alignItems: 'center', width: '85%', height: 75, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 40 }} source={require('../assets/block.png')} />
                            <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {'Profils bloqués'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>Actions.push("Contactus")} style={{marginTop:50, flexDirection: 'row', alignItems: 'center', width: '85%', height: 75, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 40 }} source={require('../assets/8.png')} />
                            <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {'Nous contacter'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>
                            //Linking.openURL('https://www.portal.storiz.eu/terms')
                            Actions.push("TermCondition",{link_data:'terms'})
                            
                            } style={{marginTop:50, flexDirection: 'row', alignItems: 'center', width: '85%', height: 75, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 40 }} source={require('../assets/9.png')} />
                            <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {'CGU et mentions légales'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>
                            //Linking.openURL('https://www.portal.storiz.eu/terms')
                            Actions.push("TermCondition",{link_data:'privacy'})
                            
                            } style={{marginTop:50, flexDirection: 'row', alignItems: 'center', width: '85%', height: 75, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 40 }} source={require('../assets/9.png')} />
                            <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {'Politique de confidentialité'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.logoutAlert()} style={{marginTop:50, flexDirection: 'row', alignItems: 'center', width: '85%', height: 75, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 20 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 40 }} source={require('../assets/10.png')} />
                            <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {'Se deconnecter'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.state.isLoading === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent" }}>
                        <View style={[styles.lodaing_view, { width: 50, height: 50, }]}>
                            <ActivityIndicator size="large" color={colors.themeColor} />
                        </View>
                    </View>
                )
                }
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
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 5,
        margin: 10,
    },
    lodaing_view: {
        height: 50, backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 8, marginBottom: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        alignItems: 'center', justifyContent: 'center'
    },
    modal_view: {
        flex: 1,
        width: "100%",
        backgroundColor: 'rgba(52, 52, 52, 0.9)',
        alignItems: 'center',
        justifyContent: "center"
    },

});