import React from 'react';
import {
    StyleSheet, StatusBar, ActivityIndicator, Linking, TouchableOpacity, SafeAreaView, View, Text, Image, Modal, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import country_array from '../countryList/country_array'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNGooglePlaces from 'react-native-google-places';
import RNFetchBlob from 'rn-fetch-blob';

import strings from '../strings/strings'
const datas = country_array.country_data

export default class NextRegister extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            country_modal: false,
            count_name: 'Pays',
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
            profile_uploadView: false,
            picture: '',
            current_latitude: null,
            current_longitude: null,
            isLoading: false,
            user_name: '',
            fsPath: '',
            user_id: '',
            check_term: false

        };
    }
    componentDidMount() {
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
            })
    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                this.setState({
                    code_postal: '',
                    rue: '',
                    ville: '',
                    location: '',
                    count_name: 'Pays'
                })
                console.log("place :: location:::" + JSON.stringify(place))
                for (let index = 0; index < place.addressComponents.length; index++) {
                    if (place.addressComponents[index].types[0] == "postal_code") {
                        this.setState({ code_postal: place.addressComponents[index].shortName })
                    } else
                        if (place.addressComponents[index].types[0] == "street_number") {
                            this.setState({ location: place.addressComponents[index].shortName })
                        } else if (place.addressComponents[index].types[0] == "route") {
                            this.setState({ rue: place.addressComponents[index].shortName })
                        } else if (place.addressComponents[index].types[0] == "locality") {
                            this.setState({ ville: place.addressComponents[index].name })
                        } else if (place.addressComponents[index].types[0] == "country") {
                            this.setState({ count_name: place.addressComponents[index].name })
                        } else {
                            this.setState({ count_name: 'Pays' })
                        }

                }

                // if (place.addressComponents.length == 6) {
                //     this.setState({ code_postal: place.addressComponents[5].shortName })

                // } else {
                //     if (place.addressComponents.length == 5) {
                //         var str = place.addressComponents[4].shortName
                //         if (typeof str != "string") {
                //             console.log("str $$$$", str)
                //         } else {
                //             console.log("str %%%", isNaN(str) && isNaN(parseFloat(str)))
                //             if (isNaN(str) === false) {
                //                 this.setState({ code_postal: place.addressComponents[4].shortName })
                //             } else {
                //               //  this.setState({ code_postal: '' })
                //             }
                //         }
                //     } else {
                //       //  this.setState({ code_postal: '' })
                //     }
                // }
                this.setState({
                    locationErr: '',
                    villeErr: '',
                    // rue: place.name,
                    // location: place.address,
                    // ville: place.addressComponents[1].shortName,
                    current_latitude: JSON.stringify(place.location.latitude),
                    current_longitude: JSON.stringify(place.location.longitude),
                })
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    chooseFromGallary() {
        var options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose Photo from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton
                );
                alert(response.customButton);
            } else {
                this.setState({
                    picture: { uri: response.assets[0].uri }, img_upload: true,
                    fsPath: RNFetchBlob.wrap(response.assets[0].uri),
                })
                this.uploadImage(RNFetchBlob.wrap(response.assets[0].uri))

            }
        });
    }
    validation() {
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
        if (this.state.count_name != 'Pays') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                phone_numberErr: 'Ne devrait pas être vide'
            })
        }
        console.log("isValidation   " + isValidation)
        if (isValidation == 3) {
            //this.props.navigation.navigate("NextRegister")
            console.log("Data :: " + JSON.stringify({
                "id": this.state.user_id,
                "address": this.state.location,
                "country": this.state.count_name,
                "city": this.state.ville,
                "postal_code": this.state.code_postal,
                "lat": this.state.current_latitude,
                "long": this.state.current_longitude
            }))
            this.registerApi();

        }
    }
    registerApi() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'user-register-new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                //"id": "625931aa0f7d7bb04f59bf41",
                "id": this.state.user_id,
                "address": this.state.location,
                "country": this.state.count_name,
                "city": this.state.ville,
                "postal_code": this.state.code_postal,
                "lat": this.state.current_latitude,
                "long": this.state.current_longitude
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
                    //AsyncStorage.setItem("user_id", responseData.data._id)
                    this.setState({ profile_uploadView: true })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.message)
                }
            }
            )
    }
    uploadImage = (url) => {
        console.log("Image URL@@@###%% " + url, this.state.user_id)
        this.setState({
            isLoading: true
        })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        };
        RNFetchBlob.fetch('POST', strings.base_Url + "user-image-upload/" + this.state.user_id, headers, [
            { name: 'profile', filename: 'photo.jpg', type: 'image/png', data: url }
        ],
        )
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData userupdate ===" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false
                    })
                    this.props.navigation.navigate("Login")
                    AsyncStorage.setItem("token", '');
                } else {
                    this.setState({
                        isLoading: false
                    })
                }
            }
            )
            .catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });

    }
    render() {
        console.log("data countre::: " + this.state.count_List.length)
        const {check_term} = this.state
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>

                {this.state.profile_uploadView === false ?
                    <ScrollView style={{ width: '100%' }}>
                        <View style={{ width: '85%', flexDirection: 'column', alignSelf: 'center' }}>
                            <Text style={[styles.font_regu, { fontSize: 22, fontWeight: 'bold', color: colors.themeColor, marginTop: 60 }]}>S'inscrire</Text>
                            <TouchableOpacity onPress={() => this.openSearchModal()} style={[styles.input_view, { marginTop: 100 }]}>
                                <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                    onChangeText={(location) => { this.setState({ location, locationErr: '' }) }}
                                    placeholder={'N*'}
                                    placeholderTextColor={colors.textColorBlack}>
                                    {this.state.location}
                                </Text>
                            </TouchableOpacity>
                            {!!this.state.locationErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.locationErr}</Text>
                            )}
                            <View style={[styles.input_view, { marginTop: 20 }]}>
                                <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                    onChangeText={(rue) => { this.setState({ rue, rueErr: '' }) }}
                                    value={this.state.rue}
                                    placeholderTextColor={colors.textColorBlack}
                                    placeholder={'Rue'}>
                                </TextInput>
                            </View>
                            {!!this.state.rueErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.rueErr}</Text>
                            )}
                            <View style={[styles.input_view, { marginTop: 20 }]}>
                                <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                    keyboardType='number-pad'
                                    value={this.state.code_postal}
                                    onChangeText={(code_postal) => { this.setState({ code_postal, code_postalErr: '' }) }}
                                    placeholderTextColor={colors.textColorBlack}
                                    placeholder={'Code postal'}>
                                </TextInput>
                            </View>
                            {!!this.state.code_postalErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.code_postalErr}</Text>
                            )}
                            <View style={[styles.input_view, { marginTop: 20 }]}>
                                <TextInput style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}
                                    placeholderTextColor={colors.textColorBlack}
                                    value={this.state.ville}
                                    onChangeText={(ville) => { this.setState({ ville, villeErr: '' }) }}
                                    placeholder={'Ville'}>
                                </TextInput>
                            </View>
                            {!!this.state.villeErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.villeErr}</Text>
                            )}
                            <TouchableOpacity onPress={() => { this.setState({ country_modal: true }) }} style={[styles.input_view, { alignItems: 'center', marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <Text style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack }]}>
                                    {this.state.count_name}
                                </Text>
                                <View style={{ width: 55, height: 55, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Image style={{ width: 15, height: 15, resizeMode: 'contain', rotation: 90, tintColor: '#000' }} source={require('../assets/right_icon.png')} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: '100%', flexDirection: 'row' ,marginTop:30}}>
                                <TouchableOpacity onPress={()=> this.setState({check_term:!this.state.check_term})} style={{ width: '10%', height: 40, alignItems: 'center',paddingTop:5 }}>
                                    {check_term === false ?
                                        <View style={{ width: 22, height: 22, borderWidth: 1.5, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                        </View> :
                                        <View style={{ width: 22, height: 22, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.themeColor }}>
                                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/right.png')} />
                                        </View>


                                    }
                                </TouchableOpacity>
                                <View style={{width:'88%'}}>
                                <Text style={[styles.font_regu, {marginLeft:10, width: '100%', fontSize: 14, color: '#000', lineHeight: 25,}]}>
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
                            <TouchableOpacity style={{ width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 40 }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Terminer</Text>
                            </TouchableOpacity>:
                            <TouchableOpacity onPress={() => { this.validation() }} style={{ width: '100%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 40 }}>
                            <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Terminer</Text>
                        </TouchableOpacity>
    }
                        </View>
                    </ScrollView> :
                    <View style={{ height: '100%', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 80 }}>
                            {this.state.picture == '' ?
                                <View style={{ width: 130, height: 130, borderRadius: 130 / 2, backgroundColor: '#dadada', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ width: 40, height: 40, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/17.png')} />
                                </View>
                                :
                                <Image source={this.state.picture} style={{ width: 130, height: 130, borderRadius: 130 / 2 }} />

                            }
                            <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 22, color: colors.textColorBlack, marginTop: 15 }]}>
                                {this.state.user_name}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', width: '100%', marginBottom: 80 }}>
                            <TouchableOpacity onPress={() => this.chooseFromGallary()} style={{ width: '80%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Importer une photo de profil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Login") + AsyncStorage.setItem("token", '')} style={{ alignSelf: 'center', padding: 20 }}>
                                <Text style={[styles.font_regu, { fontSize: 14, color: 'grey', textDecorationLine: 'underline' }]}>Pas maintenant</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

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
                                            <Text style={{ color: colors.textColorBlack, fontSize: 18, lineHeight: 20, width: '70%',fontWeight:'800' }}>{item.name}</Text>
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
        justifyContent: 'center',
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