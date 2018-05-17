import React from 'react';
import {
    StyleSheet, StatusBar,ActivityIndicator, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import strings from '../strings/strings'

export default class ForgotPassword extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '', emailErr: '',
            forgotView: true,
            codeView: false,
            newPasswordView: false,
            code: '',
            codeErr: '',
            password:'',
            passwordErr:'',
            confirmPassword:'',
            confirmPasswordErr:'',
            user_id:'',
        };
    }
    validation() {
        var isValidation = 0;
        if (this.state.email != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({emailErr: 'Ne devrait pas être vide'})
        }
        if (isValidation == 1) { this.forgetApi() }
    }
    codevalidation(){
        var isValidation = 0;
        if (this.state.code != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({codeErr: 'Ne devrait pas être vide'})
        }
        if (isValidation == 1) {
            console.log("user id :::",this.state.user_id)
            this.codeApi() }
    }
    newpasswordvalidation(){
        var isValidation = 0;
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
            this.setState({passwordErr: 'Ne devrait pas être vide'})
        }
        if (isValidation == 2) {
            console.log("user id :::",this.state.user_id)
            this.updatePasswordApi() } 
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
    updatePasswordApi() {
        this.setState({
            isLoading:true
        })
        fetch(strings.base_Url + 'update-password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id" :this.state.user_id ,
                "password" :this.state.password.trim(),
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData code===" + JSON.stringify(responseData));
                if(responseData.status === true ){
                    this.setState({
                        isLoading:false,
                        forgotView: true,
                        codeView: false,
                        newPasswordView: false,
                    })
                    alert(responseData.message)
                this.props.navigation.goBack()
                }else{
                    this.setState({
                        isLoading:false
                    })
                    alert(responseData.message)
                }   
            }
            )
    }
    codeApi() {
        this.setState({
            isLoading:true
        })
        fetch(strings.base_Url + 'check-code', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id" :this.state.user_id ,
                "code" :this.state.code.trim(),
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData code===" + JSON.stringify(responseData));
                if(responseData.status === true ){
                    this.setState({
                        isLoading:false,
                        forgotView: false,
                        codeView: false,
                        newPasswordView: true,
                       
                    })
                  //  alert(responseData.message)
                }else{
                    this.setState({
                        isLoading:false
                    })
                    alert(responseData.message)
                }   
            }
            )
    }
    forgetApi() {
        this.setState({
            isLoading:true
        })
        fetch(strings.base_Url + 'user-forget', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email" :this.state.email.trim(),
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData register===" + JSON.stringify(responseData));
                if(responseData.success === true ){
                    this.setState({
                        isLoading:false,
                        forgotView: false,
                        codeView: true,
                        newPasswordView: false,
                        user_id:responseData.user
                    })
                
                }else{
                    this.setState({
                        isLoading:false
                    })
                   // alert(responseData.message)
                }   
            }
            )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
               
                <ScrollView style={{ width: '100%' }}>
                    {this.state.forgotView === true && (
                        <View style={{ width: '85%', flexDirection: 'column', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ width: 45, height: 45, justifyContent: 'center', marginTop: 20 }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain',  tintColor: '#000' }} source={require('../assets/25.png')} />
                            </TouchableOpacity>
                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: colors.textColorBlack, marginTop: 20 }]}>Saisie ton mail</Text>
                            <View style={[styles.input_view, { marginTop: 60 }]}>
                                <TextInput style={[styles.font_regu,{ fontSize: 16, color: colors.textColorBlack }]}
                                    keyboardType='email-address'
                                    placeholderTextColor={'#000'}
                                    onChangeText={(email) => { this.setState({ email, emailErr: '' }) }}
                                    placeholder={'Adresse mail'}>
                                </TextInput>
                            </View>
                            {!!this.state.emailErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.emailErr}</Text>
                            )}

                            <TouchableOpacity onPress={()=>{this.validation()}} style={{ alignSelf: 'center', width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30 }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Suivant</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }
                    {this.state.codeView === true && (
                        <View style={{ width: '85%', flexDirection: 'column', alignSelf: 'center' }}>

                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: colors.textColorBlack, marginTop: 100, lineHeight: 28 }]}>{`Saisie le code qui viens\nde t'être envoyé par mail.`}</Text>
                            <View style={[styles.input_view, { marginTop: 60 }]}>
                                <TextInput style={[styles.font_regu,{ fontSize: 16, color: colors.textColorBlack }]}
                                    keyboardType='number-pad'
                                    placeholderTextColor={'#000'}
                                    onChangeText={(code) => { this.setState({ code, codeErr: '' }) }}
                                    placeholder={'CODE'}>
                                </TextInput>
                            </View>
                            {!!this.state.codeErr && (
                                <Text style={[styles.font_regu, {marginLeft:10, width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.codeErr}</Text>
                            )}

                            <TouchableOpacity onPress={()=>{this.codevalidation()}} style={{ alignSelf: 'center', width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30 }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }
                    {this.state.newPasswordView === true && (
                        <View style={{ width: '85%', flexDirection: 'column', alignSelf: 'center' }}>

                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', color: colors.textColorBlack, marginTop: 100, lineHeight: 28,textAlign:'center'}]}>{`Saisis ton nouveau \nmot de passe`}</Text>
                            <View style={[styles.input_view, { marginTop: 60 }]}>
                                <TextInput style={[styles.font_regu,{ fontSize: 16, color: colors.textColorBlack }]}
                                    onChangeText={(password) => { this.setState({ password, passwordErr: '' }) }}
                                   secureTextEntry={true}
                                   placeholderTextColor={'#000'}
                                   placeholder={'Nouveau mot de passe'}>
                                </TextInput>
                            </View>
                            {!!this.state.passwordErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.passwordErr}</Text>
                            )}
                            

                            <TouchableOpacity onPress={()=> this.newpasswordvalidation()} style={{ alignSelf: 'center', width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30 }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }

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
        fontWeight:'800'
    },
    font_regu: {
       fontWeight:'800'
    },
    font_bold: {
        fontFamily: 'CamSemiItalic'
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