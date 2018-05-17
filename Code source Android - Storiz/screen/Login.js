import React from 'react';
import {
    StyleSheet, StatusBar,ActivityIndicator,PermissionsAndroid, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import strings from '../strings/strings'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
export default class Login extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '', emailErr: '',
            password: '', passwordErr: '',
            showpassword: true,
            isLoading:false,
            fcm_token:'',
        };
    }
    componentDidMount() {
        AsyncStorage.getItem("fcm_token")
            .then(fcm_token => {
                this.setState({ fcm_token: fcm_token });
                console.log("state fcm_token============" + fcm_token);
            })
            if (Platform.OS === 'android') {
                this.requestLocationPermission()
            } else {
            }
    }
    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION ,
                 PermissionsAndroid.PERMISSIONS.CAMERA , 
                 PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                 PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE])

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Location permission granted")
            } else {
                console.log("Location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }
    validation() {
        //  Actions.push("NextRegister")
        var isValidation = 0;
        if (this.state.email != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                emailErr: 'Ne devrait pas être vide'
            })
        }
        if (this.state.password != '') {
            isValidation += 1;
            if (this.validatePassword(this.state.password)) {
                isValidation += 1;
            } else {
                isValidation -= 1;
                this.setState({
                    passwordErr: "La longueur devrait être min 8",

                });
            }

        } else {
            isValidation -= 1;
            this.setState({
                passwordErr: 'Ne devrait pas être vide'
            })
        }
        console.log("isValidation   "+isValidation)
        if (isValidation == 3) {
          
            console.log("Data :: "+JSON.stringify({
                "device_token" : this.state.fcm_token
            }))
             this.loginApi();

        }
    }
    loginApi() {
        this.setState({
            isLoading:true
        })
        fetch(strings.base_Url + 'user-login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email" :this.state.email.trim(),
                "password" :this.state.password,
                "device_token" : this.state.fcm_token
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData register===" + JSON.stringify(responseData));
                if(responseData.success === true ){
                    this.setState({
                        isLoading:false
                    })
                    AsyncStorage.setItem("user_id",responseData.user._id)
                    AsyncStorage.setItem("token",responseData.token)
                    Actions.push("Home")
                 //   Actions.push("HomeViewPager")
                }else{
                    this.setState({
                        isLoading:false,
                        passwordErr:responseData.message,
                    })
                   // alert(responseData.message)
                }   
            }
            )
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    validatePassword(password) {
        if (password.length < 8) {
            return false;
        } else if (password.length > 16) {
            return false;
        }else {
            return true;
        }

    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
                <ScrollView style={{ width: '100%' }}>
                <TouchableOpacity onPress={() => Actions.push("SignUp")} style={{marginLeft:10,alignItems:'center', width: 45, height: 45, justifyContent: 'center', marginTop: 20 }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain',  tintColor: '#000' }} source={require('../assets/25.png')} />
                            </TouchableOpacity>
                    <View style={{ width: '85%', flexDirection: 'column', alignSelf: 'center' }}>
                    
                        <Text style={[styles.font_regu, { fontSize: 22, fontWeight: 'bold', color: colors.themeColor, marginTop: 20 }]}>Se connecter</Text>
                        <View style={[styles.input_view, { marginTop: 100 }]}>
                            <TextInput style={[styles.font_regu,{ fontSize: 16, color: colors.textColorBlack }]}
                                keyboardType='email-address'
                                placeholderTextColor={'#000'}
                                onChangeText={(email) => { this.setState({ email, emailErr: '' }) }}
                                placeholder={'Adresse mail ou pseudo'}>
                            </TextInput>
                        </View>
                        {!!this.state.emailErr && (
                            <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.emailErr}</Text>
                        )}
                        <View style={[styles.input_view, { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <TextInput style={[styles.font_regu,{width:'80%', fontSize: 16, color: colors.textColorBlack }]}
                                secureTextEntry={this.state.showpassword}
                                placeholderTextColor={'#000'}
                                onChangeText={(password) => { this.setState({ password, passwordErr: '' }) }}
                                placeholder={'Mot de passe'}>
                            </TextInput>
                            <TouchableOpacity onPress={() => this.setState({ showpassword: !this.state.showpassword })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                                {this.state.showpassword === true ?
                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/eyeclose.png')} />
                                    :
                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/222.png')} />
                                }
                            </TouchableOpacity>
                        </View>
                        {!!this.state.passwordErr && (
                            <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.passwordErr}</Text>
                        )}
                        <TouchableOpacity onPress={()=>Actions.push("ForgotPassword")} style={{ alignSelf: 'center', padding: 20 }}>
                            <Text style={[styles.font_regu, { fontSize: 14, color: colors.themeColor, textDecorationLine: 'underline' }]}>J'ai oublié mon mot de passe !</Text>
                        </TouchableOpacity>

                        <TouchableOpacity  onPress={()=>this.validation()} style={{ width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 80 }}>
                        <Text style={[styles.font_regu, {fontSize: 18, color: '#fff'}]}>Connexion</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.state.isLoading === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent" }}>
                        <View style={[styles.lodaing_view,{ width: 50, height: 50,}]}>
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
        height: 55,
        borderRadius: 20,
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