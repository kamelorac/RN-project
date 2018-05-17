import React from 'react';
import {
    StyleSheet, StatusBar,Linking, ActivityIndicator, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import strings from '../strings/strings'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
export default class Register extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '', emailErr: '',
            password: '', passwordErr: '',
            showpassword: true,
            name: '',
            nameErr: '',
            last_name: '',
            last_nameErr: '',
            user_name: '',
            user_nameErr: '',
            phone_number: '',
            phone_numberErr: '',
            isLoading: false,
            check_term: false

        };
    }
    validation() {
        //Actions.push("NextRegister")
        var isValidation = 0;
        if (this.state.name != '') {
            isValidation += 1;
            // if (this.state.last_name != '') {
            //     isValidation += 1;
            // } else {
            //     isValidation -= 1;
            //     this.setState({
            //         nameErr: 'Le nom ne doit pas être vide'
            //     })
            // }
        } else {
            isValidation -= 1;
            this.setState({
                nameErr: 'Le Prénom ne doit pas être vide '
            })
        }

        if (this.state.user_name != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                user_nameErr: 'Ne devrait pas être vide'
            })
        }
        if (this.state.phone_number != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                phone_numberErr: 'Ne devrait pas être vide'
            })
        }
        if (this.state.email != '') {
            let text = this.state.email.toLowerCase().trim()
            let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9._%+-]+\.)+[a-zA-Z]{2,}))$/;
            if (reg.test(text) === false) {
                this.setState({ emailErr: 'le Email est obligatoire' })
            } else {
                isValidation += 1;
            }
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
        console.log("isValidation   " + isValidation)
        if (isValidation == 6) {

            console.log("Data :: " + JSON.stringify({
                "first_name": this.state.name,
                "last_name": this.state.last_name,
                "username": this.state.user_name,
                "email": this.state.email.trim(),
                "password": this.state.password,
                "contactNumber": this.state.phone_number,
            }))
            this.registerApi();

        }
    }
    validatePassword(password) {
        if (password.length < 8) {
            return false;
        } else if (password.length > 16) {
            return false;
        } else {
            return true;
        }

    }
    registerApi() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'user-register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "first_name": this.state.name,
                "last_name": this.state.last_name,
                "username": this.state.user_name,
                "email": this.state.email.trim(),
                "password": this.state.password,
                "contactNumber": this.state.phone_number
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData register===" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false
                    })
                    AsyncStorage.setItem("user_id", responseData.data._id)
                    Actions.push("NextRegister")
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.msg)
                }
            }
            )
    }
    render() {
        const { check_term } = this.state
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>

                <ScrollView style={{ width: '100%' }}>
                    <TouchableOpacity onPress={() => Actions.push("SignUp")} style={{ marginLeft: 10, alignItems: 'center', width: 45, height: 45, justifyContent: 'center', marginTop: 20 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../assets/25.png')} />
                    </TouchableOpacity>
                    <View style={{ width: '85%', flexDirection: 'column', alignSelf: 'center' }}>
                        <Text style={[styles.font_regu, { fontSize: 22, fontWeight: 'bold', color: colors.themeColor, marginTop: 20 }]}>S'inscrire</Text>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 100 }}>
                            <View style={[styles.input_view, { width: '49%' }]}>
                                <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                    onChangeText={(name) => { this.setState({ name, nameErr: '' }) }}
                                    placeholderTextColor={colors.textColorBlack}
                                    placeholder={'Prénom'}>
                                </TextInput>
                            </View>
                            <View style={[styles.input_view, { width: '49%', }]}>
                                <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                    onChangeText={(last_name) => { this.setState({ last_name, nameErr: '' }) }}
                                    placeholderTextColor={colors.textColorBlack}
                                    placeholder={'Nom '}>
                                </TextInput>
                            </View>
                        </View>
                        {!!this.state.nameErr && (
                            <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.nameErr}</Text>
                        )}
                        <View style={[styles.input_view, { marginTop: 20 }]}>
                            <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                onChangeText={(user_name) => { this.setState({ user_name, user_nameErr: '' }) }}
                                placeholderTextColor={colors.textColorBlack}
                                placeholder={'Nom d\'utilisateur'}>
                            </TextInput>
                        </View>
                        {!!this.state.user_nameErr && (
                            <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.user_nameErr}</Text>
                        )}
                        <View style={[styles.input_view, { marginTop: 20 }]}>
                            <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                keyboardType='number-pad'
                                onChangeText={(phone_number) => { this.setState({ phone_number, phone_numberErr: '' }) }}
                                placeholderTextColor={colors.textColorBlack}
                                placeholder={'Numéro de mobile'}>
                            </TextInput>
                        </View>
                        {!!this.state.phone_numberErr && (
                            <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.phone_numberErr}</Text>
                        )}
                        <View style={[styles.input_view, { marginTop: 20 }]}>
                            <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                keyboardType='email-address'
                                onChangeText={(email) => { this.setState({ email, emailErr: '' }) }}
                                placeholderTextColor={colors.textColorBlack}
                                placeholder={'Adresse mail'}>
                            </TextInput>
                        </View>
                        {!!this.state.emailErr && (
                            <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.emailErr}</Text>
                        )}
                        <View style={[styles.input_view, { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <TextInput style={[styles.font_regu, { width: '80%', fontSize: 16, color: colors.textColorBlack }]}
                                secureTextEntry={this.state.showpassword}
                                onChangeText={(password) => { this.setState({ password, passwordErr: '' }) }}
                                placeholderTextColor={colors.textColorBlack}
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
                        <View style={{ width: '100%', flexDirection: 'row', marginTop: 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ check_term: !this.state.check_term })} style={{ width: '10%', height: 40, alignItems: 'center', paddingTop: 5 }}>
                                {check_term === false ?
                                    <View style={{ width: 22, height: 22, borderWidth: 1.5, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    </View> :
                                    <View style={{ width: 22, height: 22, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.themeColor }}>
                                        <Image style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/right.png')} />
                                    </View>


                                }
                            </TouchableOpacity>
                            <View style={{ width: '88%' }}>
                                <Text style={[styles.font_regu, { marginLeft: 10, width: '100%', fontSize: 14, color: '#000', lineHeight: 25, }]}>
                                    En continuant, j’accepte les
                                    <Text onPress={() => Linking.openURL('https://www.portal.storiz.eu/terms')} style={{ color: colors.themeColor }}>
                                        {" conditions générales "}
                                    </Text>
                                    d’utilisation, et confirme avoir lu la
                                    <Text onPress={() => Linking.openURL('https://www.portal.storiz.eu/privacy')} style={{ color: colors.themeColor }}>
                                        {" politique de confidentialité. "}
                                    </Text>
                                </Text>
                            </View>

                        </View>
                        {check_term === false ?
                                <TouchableOpacity onPress={() => ''} style={{width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30,marginBottom:50 }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Suivant</Text>
                            </TouchableOpacity> :
                               <TouchableOpacity onPress={() => this.validation()} style={{ width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30 ,marginBottom:50}}>
                               <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Suivant</Text>
                           </TouchableOpacity>
                            }
                        
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