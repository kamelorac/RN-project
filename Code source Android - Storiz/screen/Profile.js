import React from 'react';
import {
    StyleSheet, Dimensions, StatusBar, ActivityIndicator, TouchableOpacity, SafeAreaView, View, Text, Image, Modal, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import country_array from '../countryList/country_array'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import strings from '../strings/strings';
import RNFetchBlob from 'rn-fetch-blob';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


const datas = country_array.country_data
export default class Profile extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {

            profile_uploadView: false,
            picture: '',
            user_name: '',
            messageList: [],
            listofSubscribedUsers_count:0,
            listofSubscribers_count:0,
            sub_count:0


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
                        this.saveProductList(user_id, token)
                        this.listofSubscribedUsers(user_id,token)
                        this.listofSubscribers(user_id,token)
                        this.newSubscribedCount(user_id, token)
                    })
            })
    }
    newSubscribedCount(user_id, token) {
        this.setState({isLoading: true })
        fetch(strings.base_Url + 'newSubscribedCount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ "id": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("messages::newSubscribedCount::" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({isLoading: false, sub_count:responseData.count})
                } else {
                    this.setState({isLoading: false})
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                          Actions.push("Login")                
                              AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("responsenewSubscribedCounterr:::" + err);
                this.setState({ isLoading: false });
            });
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
                    var profiles = ''
                    if (responseData.user.profile_image == "false") {
                        profiles = require('../assets/dummy_profile.png')
                    } else {
                        profiles = { uri: strings.base_image + responseData.user.profile_image }
                    }
                    this.setState({
                     //   isLoading: false,
                        user_name: responseData.user.username,
                        picture: profiles
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
                this.setState({ picture: { uri: response.assets[0].uri }, img_upload: true })
                this.uploadImage(RNFetchBlob.wrap(response.assets[0].uri))
                // ,
            }
        });
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
                    alert(responseData.message)
                    this.componentDidMount()
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
    saveProductList(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'getMyProductList', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ "id": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("saveProductList ==" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                       messageList:responseData.products
                   })
                } else {
                    this.setState({ isLoading: false })
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    listofSubscribedUsers(user_id,token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'listofSubscribedUsers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ "id": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("listofSubscribedUsers ==" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                      listofSubscribedUsers_count: responseData.products.length
                    })
                } else {
                    this.setState({ isLoading: false })
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    listofSubscribers(user_id,token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'listofSubscribers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ "id": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("listofSubscribers ==" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        listofSubscribers_count: responseData.data.length
                    })
                } else {
                    this.setState({ isLoading: false })
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
                <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() =>
                     Actions.push("Home")
                    // Actions.push("HomeViewPager")
                     } style={{ alignSelf: 'flex-start',  width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                            <TouchableOpacity onPress={() => Actions.push("Setting")} style={{marginRight:8, width: 35, height: 35,borderRadius:50/2,backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'white' }} source={require('../assets/g.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Actions.push("EnRegister")}  style={{ width: 35, height: 35,borderRadius:50/2,backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', }}>
                                <Image style={{ width: 15, height: 15, resizeMode: 'contain',tintColor: 'white'   }} source={require('../assets/save.png')} />
                            </TouchableOpacity>
                           
                        </View>
                    </View>
                <ScrollView>
                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                            {this.state.picture == '' ?
                                <TouchableOpacity onPress={() => this.chooseFromGallary()} style={{ width: 100, height: 100, }}>
                                    <Image source={this.state.picture} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
                                    <View style={{ width: 40, height: 40, marginTop: -30, marginLeft: 60 }}>
                                        <Image style={{ width: 30, height: 30, resizeMode: 'contain', }} source={require('../assets/6.png')} />

                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.chooseFromGallary()} style={{ width: 100, height: 100, }}>
                                    <Image source={this.state.picture} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
                                    <View style={{ width: 40, height: 40, marginTop: -30, marginLeft: 60 }}>
                                        <Image style={{ width: 30, height: 30, resizeMode: 'contain', }} source={require('../assets/6.png')} />
                                    </View>
                                </TouchableOpacity>
                            }
                            <Text style={[styles.font_regu, {marginTop:15, fontWeight: 'bold', fontSize: 20, color: colors.textColorBlack }]}>
                                {this.state.user_name}
                            </Text>
                        </View>
                        <View style={{ alignSelf: 'center', marginTop: 30, alignItems: 'center', width: '90%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => Actions.push("Subscriptions")} style={{ width: '48%', height: 55, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{this.state.listofSubscribedUsers_count} Abonnements</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Actions.push("Subscribers")} style={{ width: '48%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{this.state.listofSubscribers_count} Abonnés</Text>
                            </TouchableOpacity>
                            {this.state.sub_count == 0 ? null :
                            <View style={{width:10,height:10,borderRadius:50,backgroundColor:'red',marginTop:-46,marginLeft:-40}} />
                            }
                        </View>
                        <View style={{width:'90%',alignSelf:'center',backgroundColor:'rgba(180,180,180,0.1)',padding:10,marginTop:30,borderRadius:10}}>
                        <Text style={[styles.font_regu, {marginTop:20, alignSelf: 'center', fontWeight: 'bold', fontSize: 20, color: colors.textColorBlack, }]}>
                            {'Mes Storiz'}
                        </Text>
                        {this.state.messageList.length == 0 ?
                            <Text style={[styles.font_regu, {width:'100%', fontSize: 16, color: "#000", padding: 20, alignSelf: 'center' }]}>{' Données de la liste non disponibles '}</Text>
                            :
                            <View style={{ width: '100%',  alignSelf: 'center', marginTop: 20 }}>
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.messageList}
                                    numColumns={2}
                                   // style={{ backgroundColor: 'rgba(180,180,180,0.1)' }}
                                    renderItem={({ item, index }) =>
                                    <View style={{width:'50%' ,alignItems:'center'}}>
                                    <View style={{width: width*40/100, alignItems: 'center', marginTop: 20 }}>
                                        <TouchableOpacity 
                                        //onPress={() => Actions.push("WebVideoPlay", { videoUrl: item.videoslink[0], posterImage:  strings.base_video+item.thumbnail, product_id: item._id, save:'true'})} 
                                        onPress={() => Actions.push("ProductEdit", { videoUrl: item.videoslink[0], posterImage: strings.base_video+item.thumbnail, product_id: item._id })}
                                        style={[{ width: '90%', alignItems: 'center' }]}>
                                            <View style={[{ width: '100%', alignSelf: 'flex-start' }]}>
                                                {item.thumbnail == undefined ?
                                                    <View style={{ height: width*50/100 }}>
                                                    </View> :
                                                    <View style={styles.input_view}>
                                                        <Image style={{
                                                            width: '100%', height: width*48/100, borderRadius: 15
                                                        }}
                                                            source={{ uri:  strings.base_video+item.thumbnail }} />
                                                    </View>
                                                }
                                            </View>
                                            <View style={{ width: '100%', marginTop: 10, marginBottom: 20, marginLeft: 10 }}>
                                                <Text style={[styles.font_regu, {alignSelf:'center', fontSize: 14, color: '#000', }]}>{item.viewersCount} vues</Text>
                                                {/* <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 16, color: '#000', paddingTop: 5 }]}>{item.price + item.currency}</Text> */}

                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                    </View>
                                    }
                                    extraData={this.state} />
                            </View>
                        }
                        </View>  
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
    // input_view: {
    //     borderRadius: 8,
    //     backgroundColor: '#fff',
    //     elevation: 5,
    //     margin: 10,
    // },
    input_view: {
        height: width*50/100,
        width: '100%',
        borderRadius: 15,
        //padding:5,
        //borderWidth: 1,
        borderColor: colors.textGrey,
        backgroundColor: 'rgba(180.180,180,0.1)',
        // justifyContent: 'center',
        // shadowColor: "black",
        // shadowOffset: { height: 5 },
        // shadowOpacity: 0.9,
        elevation: 4,
        // margin: 10,
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