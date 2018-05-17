import React from 'react';
import {
    StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, SafeAreaView, View, Text, Image, Modal, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import country_array from '../countryList/country_array';
import strings from '../strings/strings';
import RNGooglePlaces from 'react-native-google-places';
const datas = country_array.country_data
export default class PersonalInfo extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '', emailErr: '',
            password: '', passwordErr: '',
            confirm_password: "",
            showpassword: true,
            showconfpassword: true,
            passwordView: false,
            name: '',
            nameErr: '',
            last_name: '',
            last_nameErr: '',
            user_name: '',
            user_nameErr: '',
            phone_number: '',
            phone_numberErr: '',
            addressView: false,
            country_modal: false,
            count_name: datas[0].name,
            count_flag: datas[0].flag,
            country_code: datas[0].dial_code,
            count_List: datas,
            location: 'N*',
            locationErr: '',
            rue: '',
            rueErr: '',
            code_postal: '',
            code_postalErr: '',
            ville: '',
            villeErr: '',
            user_id: '',
            token: '',
            isLoading: false,
        };
    }
    componentDidMount() {
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });
                        console.log("state token============" + token);
                        this.getprofile(user_id, token)
                    })
            })
    }
    getprofile(user_id, token) {
        this.setState({
            isLoading: true
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
                        isLoading: false,
                        name: responseData.user.first_name,
                        email: responseData.user.email,
                        last_name: responseData.user.last_name,
                        user_name: responseData.user.username,
                        phone_number: responseData.user.contactNumber,
                        count_name: responseData.user.country,
                        location: responseData.user.address,
                        rue: responseData.user.city,
                        code_postal: responseData.user.postal_code,
                        ville: responseData.user.city,
                        current_latitude: responseData.user.location.coordinates[0],
                        current_longitude: responseData.user.location.coordinates[1]
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.message)
                }
            }
            )
    }
    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal(
        //     {
        //     country: 'fr', // need to use 'us', 'dk' or somethink like ['us', 'dk']
        //     useOverlay: true
        // }
        )
            .then((place) => {
                console.log("place :: location:::" + JSON.stringify(place))
                for (let index = 0; index < place.addressComponents.length; index++) {
                    if(place.addressComponents[index].types[0] == "postal_code"){
                        this.setState({code_postal: place.addressComponents[index].shortName})
                    }else
                    if(place.addressComponents[index].types[0] == "street_number"){
                       this.setState({location: place.addressComponents[index].shortName})
                   }else if(place.addressComponents[index].types[0] == "route"){
                       this.setState({rue: place.addressComponents[index].shortName})
                   }else if(place.addressComponents[index].types[0] == "locality" ){
                       this.setState({ville: place.addressComponents[index].name})
                   }else if(place.addressComponents[index].types[0] == "country" ){
                       this.setState({count_name: place.addressComponents[index].name})
                   }else{
                      this.setState({count_name:'Pays'})
                   }  
               }
                this.setState({
                    locationErr: '',
                    villeErr: '',
                    current_latitude: JSON.stringify(place.location.latitude),
                    current_longitude: JSON.stringify(place.location.longitude),
                })
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    addressValidation() {
        var isValidation = 0;
        if (this.state.location != 'N*') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                locationErr: 'Le Prénom ne doit pas être vide '
            })
        }

        if (this.state.ville != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                villeErr: 'Ne devrait pas être vide'
            })
        }
        if (this.state.count_name != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                //  phone_numberErr: 'Ne devrait pas être vide'
            })
        }
        console.log("isValidation   " + isValidation)
        if (isValidation == 3) {
            console.log("Data :: " + JSON.stringify({
                "id": this.state.user_id,
                "first_name": this.state.name,
                "last_name": this.state.last_name,
                "username": this.state.user_name,
                "email": this.state.email,
                // "password" : '123456',
                "contactNumber": this.state.phone_number,
                "address": this.state.location,
                "country": this.state.count_name,
                "city": this.state.ville,
                "postal_code": this.state.code_postal,
                "lat": this.state.current_latitude,
                "long": this.state.current_longitude,
            }))
            this.updateUserProfile();

        }
    }
    validation() {
        //  Actions.push("NextRegister")
        var isValidation = 0;
        if (this.state.name != '') {
            isValidation += 1;
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
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                emailErr: 'Ne devrait pas être vide'
            })
        }

        console.log("isValidation   " + isValidation)
        if (isValidation == 4) {

            console.log("Data :: " + JSON.stringify({
                "id": this.state.user_id,
                "first_name": this.state.name,
                "last_name": this.state.last_name,
                "username": this.state.user_name,
                "email": this.state.email,
                // "password" : '123456',
                "contactNumber": this.state.phone_number,
                "address": this.state.location,
                "country": this.state.count_name,
                "city": this.state.ville,
                "postal_code": this.state.code_postal,
                "lat": this.state.current_latitude,
                "long": this.state.current_longitude,
            }))
            this.updateUserProfile();

        }
    }
    updateUserProfile() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'update-user-profile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "first_name": this.state.name,
                "last_name": this.state.last_name,
                "username": this.state.user_name,
                "email": this.state.email,
                //"password" : this.state.password,
                "contactNumber": this.state.phone_number,
                "address": this.state.location,
                "country": this.state.count_name,
                "city": this.state.ville,
                "postal_code": this.state.code_postal,
                "lat": this.state.current_latitude,
                "long": this.state.current_longitude,
                // "lat" : JSON.stringify(this.state.current_latitude),
                // "long" :JSON.stringify(this.state.current_longitude),
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData register===" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                        user_name: responseData.user.username
                    })
                    //alert(responseData.message)
                    this.componentDidMount()
                    //AsyncStorage.setItem("user_id", responseData.data._id)
                    // this.setState({ profile_uploadView: true }) 
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.message)
                }
            }
            )
    }
    passwordValidation(){
        var isValidation = 0;
        if (this.state.password != '') {
            isValidation += 1;
            if (this.validatePassword(this.state.password)) {
                isValidation += 1;
                if (this.state.password == this.state.confirm_password) {
                    isValidation += 1;
                } else {
                    isValidation -= 1;
                    this.setState({
                        passwordErr: 'Le mot de passe ne correspond pas'
                    })
                }
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
        if (isValidation == 3) {

            console.log("Data :: " + JSON.stringify({
                "id": this.state.user_id,
                "password":this.state.password
            }))
            this.updatePassword();

        }  
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
    updatePassword() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'update-password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "password":this.state.password
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData update-password===" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                        passwordView: false,
                        password:'',
                        confirm_password:''
                    })
                    alert(responseData.message)
                    this.componentDidMount()
                  
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.message)
                }
            }
            )
    }
    render() {

        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
               
                <TouchableOpacity onPress={() => Actions.pop()} style={{ alignSelf: 'flex-start', marginLeft: 15, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                </TouchableOpacity>
                <ScrollView style={{ width: '100%' }}>
                    <View style={{ width: '85%', alignSelf: 'center', marginTop: 20 }}>
                        <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 22, color: colors.themeColor }]}>
                            {'Information pers.'}
                        </Text>

                        <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', marginTop: 50 }}>
                            <TouchableOpacity onPress={() => this.setState({ addressView: false })} style={{ width: '50%', alignItems: 'center' }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: colors.textColorBlack }]}>
                                    {'Propre à moi'}
                                </Text>
                                {this.state.addressView === false && (
                                    <View style={{ marginTop: 10, width: '100%', height: 4, borderRadius: 50, backgroundColor: colors.textColorBlack }} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ addressView: true })} style={{ width: '50%', alignItems: 'center' }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: colors.textColorBlack }]}>
                                    {'Adresse'}
                                </Text>
                                {this.state.addressView === true && (
                                    <View style={{ marginTop: 10, width: '100%', height: 4, borderRadius: 50, backgroundColor: colors.textColorBlack }} />
                                )}
                            </TouchableOpacity>
                        </View>
                        {this.state.addressView === false ?
                            <View style={{ width: '100%', flexDirection: 'column', alignSelf: 'center' }}>
                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30}}>
                                    <View style={[styles.input_view, { width: '49%',}]}>
                                        <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                            onChangeText={(name) => { this.setState({ name, nameErr: '' }) }}
                                            placeholderTextColor={colors.textGrey}
                                            value={this.state.name}
                                            placeholder={'Prénom'}>
                                        </TextInput>
                                    </View>
                                    <View style={[styles.input_view, { width: '49%', }]}>
                                        <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                            onChangeText={(last_name) => { this.setState({ last_name, last_nameErr: '' }) }}
                                            placeholderTextColor={colors.textGrey}
                                            value={this.state.last_name}
                                            placeholder={'Nom '}>
                                        </TextInput>
                                    </View>
                                </View>
                                {!!this.state.nameErr && (
                                    <Text style={[styles.font_regu, { marginLeft: 20, width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.nameErr}</Text>
                                )}
                                <View style={[styles.input_view, { marginTop: 20 }]}>
                                    <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                        onChangeText={(user_name) => { this.setState({ user_name, user_nameErr: '' }) }}
                                        placeholderTextColor={colors.textGrey}
                                        value={this.state.user_name}
                                        placeholder={'Nom d\'utilisateur'}>
                                    </TextInput>
                                </View>
                                {!!this.state.user_nameErr && (
                                    <Text style={[styles.font_regu, { marginLeft: 20, width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.user_nameErr}</Text>
                                )}
                                <View style={[styles.input_view, { marginTop: 20 }]}>
                                    <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                        keyboardType='number-pad'
                                        onChangeText={(phone_number) => { this.setState({ phone_number, phone_numberErr: '' }) }}
                                        placeholderTextColor={colors.textGrey}
                                        value={this.state.phone_number}
                                        placeholder={'Numéro de mobile'}>
                                    </TextInput>
                                </View>
                                {!!this.state.phone_numberErr && (
                                    <Text style={[styles.font_regu, { marginLeft: 20, width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.phone_numberErr}</Text>
                                )}
                                <View style={[styles.input_view, { marginTop: 20 }]}>
                                    <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                        keyboardType='email-address'
                                        onChangeText={(email) => { this.setState({ email, emailErr: '' }) }}
                                        placeholderTextColor={colors.textGrey}
                                        value={this.state.email}
                                        placeholder={'Adresse mail '}>
                                    </TextInput>
                                </View>
                                {!!this.state.emailErr && (
                                    <Text style={[styles.font_regu, { marginLeft: 20, width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.emailErr}</Text>
                                )}
                                {/* <View style={[styles.input_view, { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                    <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                        secureTextEntry={this.state.showpassword}
                                        onChangeText={(email) => { this.setState({ email, emailErr: '' }) }}
                                        placeholderTextColor={colors.textGrey}
                                        placeholder={'Mot de passe '}>
                                    </TextInput>
                                    <TouchableOpacity onPress={() => this.setState({ showpassword: !this.state.showpassword })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                                        {this.state.showpassword === true ?
                                            <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/eyeclose.png')} />
                                            :
                                            <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/222.png')} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                {!!this.state.emailErr && (
                                    <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.emailErr}</Text>
                                )} */}

                                <TouchableOpacity onPress={() => this.validation()} style={{ alignSelf: 'center', width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30 }}>
                                    <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Valider</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({passwordView:!this.state.passwordView})} style={{ alignSelf: 'center', padding: 10, marginTop: 10 }}>
                                    <Text style={[styles.font_regu, { color: colors.themeColor, fontSize: 18, textDecorationLine: 'underline' }]}>Changer le mot de passe</Text>
                                </TouchableOpacity>
                                {this.state.passwordView === true && (
                                    <View style={[styles.input_view2, { width: '100%', alignSelf: 'center',padding:20 }]}>
                                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 20 }}
                                            onPress={() => this.setState({ passwordView: false })}>
                                            <Image source={require('../assets/cancel.png')}
                                                style={{ height: 15, width: 15, tintColor: colors.themeColor }} />
                                        </TouchableOpacity>
                                        <View style={[styles.input_view, { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                            <TextInput style={[styles.font_regu, {width:'80%', paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                                secureTextEntry={this.state.showpassword}
                                                onChangeText={(password) => { this.setState({ password, passwordErr: '' }) }}
                                                placeholderTextColor={colors.textGrey}
                                                placeholder={'Nouveau mot de passe '}>
                                            </TextInput>
                                            <TouchableOpacity onPress={() => this.setState({ showpassword: !this.state.showpassword })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                                                {this.state.showpassword === true ?
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/eyeclose.png')} />
                                                    :
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/222.png')} />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.input_view, { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                            <TextInput style={[styles.font_regu, {width:'80%', paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                                secureTextEntry={this.state.showconfpassword}
                                                onChangeText={(confirm_password) => { this.setState({ confirm_password, passwordErr: '' }) }}
                                                placeholderTextColor={colors.textGrey}
                                                placeholder={'Confirmer le mot de passe '}>
                                            </TextInput>
                                            <TouchableOpacity onPress={() => this.setState({ showconfpassword: !this.state.showconfpassword })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center', }}>
                                                {this.state.showconfpassword === true ?
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/eyeclose.png')} />
                                                    :
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/222.png')} />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        {!!this.state.passwordErr && (
                                            <Text style={[styles.font_regu, {marginLeft:20, width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.passwordErr}</Text>
                                        )}
                                        <TouchableOpacity onPress={() => this.passwordValidation()} style={{ alignSelf: 'center', width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30, marginBottom: 30 }}>
                                            <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Valider</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                                }

                            </View> :
                            <View style={{ width: '100%', flexDirection: 'column', alignSelf: 'center', marginTop: 20 }}>
                                <View style={{ width: '100%', flexDirection: 'column', alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => this.openSearchModal()} style={[styles.input_view, { marginTop: 20 }]}>
                                        <Text style={[styles.font_regu, { padding: 12, fontSize: 16, color: colors.textColorBlack }]}
                                            onChangeText={(location) => { this.setState({ location, locationErr: '' }) }}
                                            placeholder={'N*'}
                                            placeholderTextColor={colors.textGrey}>
                                            {this.state.location}
                                        </Text>
                                    </TouchableOpacity>
                                    {!!this.state.locationErr && (
                                        <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.locationErr}</Text>
                                    )}
                                    <View style={[styles.input_view, { marginTop: 20 }]}>
                                        <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                            onChangeText={(rue) => { this.setState({ rue, rueErr: '' }) }}
                                            value={this.state.rue}
                                            placeholderTextColor={colors.textGrey}
                                            placeholder={'Rue'}>
                                        </TextInput>
                                    </View>
                                    {!!this.state.rueErr && (
                                        <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.rueErr}</Text>
                                    )}
                                    <View style={[styles.input_view, { marginTop: 20 }]}>
                                        <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                            keyboardType='number-pad'
                                            value={this.state.code_postal}
                                            onChangeText={(code_postal) => { this.setState({ code_postal, code_postalErr: '' }) }}
                                            placeholderTextColor={colors.textGrey}
                                            placeholder={'Code postal'}>
                                        </TextInput>
                                    </View>
                                    {!!this.state.code_postalErr && (
                                        <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.code_postalErr}</Text>
                                    )}
                                    <View style={[styles.input_view, { marginTop: 20 }]}>
                                        <TextInput style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}
                                            placeholderTextColor={colors.textGrey}
                                            value={this.state.ville}
                                            onChangeText={(ville) => { this.setState({ ville, villeErr: '' }) }}
                                            placeholder={'Ville'}>
                                        </TextInput>
                                    </View>
                                    {!!this.state.villeErr && (
                                        <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.villeErr}</Text>
                                    )}
                                    <TouchableOpacity onPress={() => { this.setState({ country_modal: true }) }} style={[styles.input_view, { alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                        <Text style={[styles.font_regu, { paddingLeft: 10, fontSize: 16, color: colors.textColorBlack }]}>
                                            {this.state.count_name}
                                        </Text>
                                        <View style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', marginRight: 20 }}>
                                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', rotation: 90, tintColor: '#000' }} source={require('../assets/right_icon.png')} />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.addressValidation()} style={{ alignSelf: 'center', width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 30 }}>
                                        <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Valider</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.country_modal}
                    onRequestClose={() => { this.setState({ country_modal: false }); }}>
                    <View style={styles.modal_view}>
                        <View style={{ width: "80%", backgroundColor: colors.testColorWhite, borderRadius: 20 }}>

                            <TouchableOpacity style={{ marginTop: 20, paddingHorizontal: 30 }}
                                onPress={() => this.setState({ country_modal: false })}>
                                <Image source={require('../assets/cancel.png')}
                                    style={{ height: 15, width: 15, tintColor: colors.themeColor }} />
                            </TouchableOpacity>
                            <FlatList
                                data={this.state.count_List}
                                style={{ marginTop: 5, marginBottom: 10, width: '85%', alignSelf: 'center', height: 300 }}
                                // horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <View style={{ marginTop: 20, }} >
                                        <TouchableOpacity style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between' }}
                                            onPress={() => this.setState({ count_flag: item.flag, country_code: item.dial_code, count_name: item.name, country_modal: false })}>
                                            <Text style={{ color: colors.textColorBlack, fontSize: 18, lineHeight: 20, width: '70%', fontFamily: 'CamptonMedium' }}>{item.name}</Text>
                                            <Text style={{ fontSize: 18, color: '#fff', }}>{item.flag}</Text>
                                        </TouchableOpacity>
                                    </View>} />
                        </View>
                    </View>
                </Modal>
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
    input_view2: {
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 5,
        margin: 10,
    },
    input_view: {
        height: 55,
        borderRadius: 20,
       // paddingHorizontal: 10,
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
    modal_view: {
        flex: 1,
        width: "100%",
        backgroundColor: 'rgba(52, 52, 52, 0.9)',
        alignItems: 'center',
        justifyContent: "center"
    },

});