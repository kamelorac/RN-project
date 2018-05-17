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
var sub_true_false = false;
export default class SeeUserProfile extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {

            profile_uploadView: false,
            picture: '',
            user_name: '',
            messageList: [],
            subscriptionModel: false,
            subscriptionDailog: false,
            profileblockModel: false,
            profileblockDailog: false,
            listofSubscribedUsers_count: 0,
            isSubscribed: false,


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
                        this.listofSubscribedUsers(token)
                        this.isSubscribed(user_id, token)
                    })
            })
    }
    getprofile(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'otherProfile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ id: this.props.other_user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData otherProfile===" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    var profiles = ''
                    if (responseData.employee.profile_image == "false") {
                        profiles = require('../assets/dummy_profile.png')
                    } else {
                        profiles = { uri: strings.base_image + responseData.employee.profile_image }
                    }
                    this.setState({
                        //   isLoading: false,
                        user_name: responseData.employee.username,
                        // messageList: responseData.products,
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
                console.log("response: otherProfile:::err:::" + err);
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
            body: JSON.stringify({ "id": this.props.other_user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("saveProductList ==" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        messageList: responseData.products
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
    subscribe() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'subscribe', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "subscriberId": this.props.other_user_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("subscribe   ==" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                        isSubscribed: true
                    })
                    sub_true_false = true
                    this.componentDidMount()
                } else {
                    this.setState({ isLoading: false })
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    unsubscribe() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'unsubscribe', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "subscriberId": this.props.other_user_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("unsubscribe   ==" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                        isSubscribed: false
                    })
                    sub_true_false = false
                    this.componentDidMount()
                } else {
                    this.setState({ isLoading: false })
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    isSubscribed(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'isSubscribed', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                "id": user_id,
                "subscriberId": this.props.other_user_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("isSubscribed  ==" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                        isSubscribed: responseData.isSubscribed
                    })
                    sub_true_false = responseData.isSubscribed
                } else {
                    this.setState({ isLoading: false })
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    listofSubscribedUsers(token) {
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
            body: JSON.stringify({ "id": this.props.other_user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("listofSubscribedUsers ==" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        //   listofSubscribedUsers_count: responseData.products
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
        console.log("this.state.isSubscribed" + sub_true_false);
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>


                <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => 
                    Actions.push("Home")
                   // Actions.push("HomeViewPager")
                }
                    
                    style={{ alignSelf: 'flex-start', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <TouchableOpacity onPress={() => this.setState({ subscriptionModel: true })} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: 'black' }} source={require('../assets/menu.png')} />
                        </TouchableOpacity>

                    </View>
                </View>
                <ScrollView>
                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                            {this.state.picture == '' ?
                                <View style={{ width: 100, height: 100, }}>
                                    <Image source={this.state.picture} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
                                    {/* <View style={{ width: 40, height: 40, marginTop: -30, marginLeft: 60 }}>
                                        <Image style={{ width: 30, height: 30, resizeMode: 'contain', }} source={require('../assets/6.png')} />

                                    </View> */}
                                </View>
                                :
                                <View style={{ width: 100, height: 100, }}>
                                    <Image source={this.state.picture} style={{ width: 100, height: 100, borderRadius: 100 / 2 }} />
                                    {/* <View style={{ width: 40, height: 40, marginTop: -30, marginLeft: 60 }}>
                                        <Image style={{ width: 30, height: 30, resizeMode: 'contain', }} source={require('../assets/6.png')} />
                                    </View> */}
                                </View>

                            }
                            <Text style={[styles.font_regu, { marginTop: 15, fontWeight: 'bold', fontSize: 20, color: colors.textColorBlack }]}>
                                {this.state.user_name}
                            </Text>
                        </View>
                        <View style={{ alignSelf: 'center', marginTop: 30, alignItems: 'center', width: '90%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {sub_true_false === false ?
                                <TouchableOpacity onPress={() => this.subscribe()} style={{ width: '48%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{'S’abonner'} </Text>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={() => this.setState({ subscriptionModel: true })} style={{ width: '48%', height: 55, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{'Se désabonner'} </Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={() => Actions.push("Subscribers")} style={{ width: '48%', height: 55, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{this.state.listofSubscribedUsers_count} Abonnés</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '90%', alignSelf: 'center', backgroundColor: 'rgba(180,180,180,0.1)', padding: 10, marginTop: 30, borderRadius: 10 }}>
                            <Text style={[styles.font_regu, { marginTop: 20, alignSelf: 'center', fontWeight: 'bold', fontSize: 20, color: colors.textColorBlack, }]}>
                                {'Storiz en ligne'}
                            </Text>
                            {this.state.messageList.length == 0 ?
                                <Text style={[styles.font_regu, { width: '100%', fontSize: 16, color: "#000", padding: 20, alignSelf: 'center' }]}>{' Données de la liste non disponibles '}</Text>
                                :
                                <View style={{ width: '100%', alignSelf: 'center', marginTop: 20 }}>
                                    <FlatList
                                        keyExtractor={this.keyExtractor}
                                        data={this.state.messageList}
                                        numColumns={2}
                                        // style={{ backgroundColor: 'rgba(180,180,180,0.1)' }}
                                        renderItem={({ item, index }) =>
                                            <View style={{ width: '50%', alignItems: 'center' }}>
                                                <View style={{ width: width * 40 / 100, alignItems: 'center', marginTop: 20 }}>
                                                    <TouchableOpacity
                                                        onPress={() => Actions.push("WebVideoPlay", { videoUrl: item.videoslink[0], posterImage: strings.base_video + item.thumbnail, product_id: item._id })} 

                                                        //onPress={() => Actions.push("ProductEdit", { videoUrl: item.videoslink[0], posterImage: strings.base_video + item.thumbnail, product_id: item._id })}
                                                        style={[{ width: '90%', alignItems: 'center' }]}>
                                                        <View style={[{ width: '100%', alignSelf: 'flex-start' }]}>
                                                            {item.thumbnail == undefined ?
                                                                <View style={{ height: width * 50 / 100 }}>
                                                                </View> :
                                                                <View style={styles.input_view}>
                                                                    <Image style={{
                                                                        width: '100%', height: width * 48 / 100, borderRadius: 15
                                                                    }}
                                                                        source={{ uri: strings.base_video + item.thumbnail }} />
                                                                </View>
                                                            }
                                                        </View>
                                                        <View style={{ width: '100%', marginTop: 10, marginBottom: 20, marginLeft: 10 }}>
                                                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 14, color: '#000', }]}>{item.viewersCount} vues</Text>
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

                {this.state.subscriptionModel === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <TouchableOpacity onPress={() => this.setState({ subscriptionModel: false, subscriptionDailog: true })} style={[styles.lodaing_view, { width: '80%', height: 55, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', }]}>Se désabonner</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ subscriptionModel: false })} style={[styles.lodaing_view, { width: '80%', height: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 30, marginTop: 20 }]}>
                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', }]}>Annuler</Text>

                        </TouchableOpacity>
                    </View>
                )
                }
                {this.state.subscriptionDailog === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <View style={[{ width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 15 }]}>
                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', marginTop: 20 }]}>Vous êtes sûr de vouloir vous désabonner?</Text>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: 40, marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ subscriptionDailog: false }) + this.unsubscribe()} style={{ width: '48%', height: 45, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>Se désabonner</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ subscriptionDailog: false })} style={{ width: '48%', height: 45, backgroundColor: colors.textGrey, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>Annuler</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
                }
                {this.state.profileblockModel === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <View style={[{ width: '80%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#fff' }]}>
                            <TouchableOpacity onPress={() => Actions.push("SeeUserProfile")} style={{ marginTop: 30 }} >
                                <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', }]}>Accès au profil</Text>
                            </TouchableOpacity >
                            <View style={{ width: 80, height: 1.5, backgroundColor: 'grey', marginTop: 20 }} />
                            <TouchableOpacity onPress={() => this.setState({ profileblockModel: false, profileblockDailog: true })} style={{ marginBottom: 20, marginTop: 20 }}>
                                <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000' }]}>Bloquer le profil</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity onPress={() => this.setState({ profileblockModel: false })} style={[{ borderRadius: 20, backgroundColor: '#fff', width: '80%', height: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 30, marginTop: 20 }]}>
                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', }]}>Annuler</Text>

                        </TouchableOpacity>
                    </View>
                )
                }
                {this.state.profileblockDailog === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <View style={[{ width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 15 }]}>
                            <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', marginTop: 20, padding: 10, lineHeight: 25 }]}>Tu es sur de vouloir bloquer ce profil ?</Text>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ profileblockDailog: false })} style={{ width: '40%', height: 45, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>Bloquer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ profileblockDailog: false })} style={{ width: '40%', height: 45, backgroundColor: colors.textGrey, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>Annuler</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
                }
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
        height: width * 50 / 100,
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