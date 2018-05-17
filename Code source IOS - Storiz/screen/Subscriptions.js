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
var other_user_id ;
export default class Subscriptions extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {

            profile_uploadView: false,
            picture: '',
            user_name: '',
            messageList: [],
            subscriptionModel:false,
            subscriptionDailog:false,
            listofSubscribedUsers_count:0




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
                        //this.getprofile(user_id, token)
                        this.listofSubscribedUsers(user_id, token)
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
                          this.props.navigation.navigate("Login")     
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
                        messageList: responseData.products,
                        listofSubscribedUsers_count: responseData.products.length
                    })
                } else {
                    this.setState({ isLoading: false ,messageList:[]})
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    unclick(other_user_ids){
        other_user_id = other_user_ids
        this.setState({ subscriptionModel: true })
        console.log("other_user_id ::: "+other_user_id)
       // this.unsubscribe(other_user_id)
    }

    unsubscribe() {
        console.log("other_user_id ::: "+other_user_id)
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
                "subscriberId": other_user_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("unsubscribe   ==" + JSON.stringify(responseData.status));
                if (responseData.status ==true) {
                    this.componentDidMount()
                    this.setState({
                        isLoading: false,
                        isSubscribed:false
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
                <View style={{ width: '95%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ alignSelf: 'flex-start', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <Text style={[styles.font_regu, { fontSize: 18, fontWeight: 'bold', color: '#000' }]}>{this.state.messageList.length} Abonnements</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', alignSelf: 'center', padding: 10, marginTop: 0, borderRadius: 10 }}>
                            {this.state.messageList.length == 0 ?
                                <Text style={[styles.font_regu, { width: '100%', fontSize: 16, color: "#000", padding: 20, alignSelf: 'center' }]}>{' Données de la liste non disponibles '}</Text>
                                :
                                <View style={{ width: '98%', alignSelf: 'center', marginTop: 0 }}>
                                    <FlatList
                                        keyExtractor={this.keyExtractor}
                                        data={this.state.messageList}
                                        renderItem={({ item, index }) =>
                                        {
                                            var profiles = '';
                                            if (item.profile_image == '' || item.profile_image == undefined || item.profile_image == 'false') {
                                                profiles = require('../assets/dummy_profile.png')
                                            } else {
                                                profiles = { uri: strings.base_image + item.profile_image }
                                            }
                                            return(
                                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate("SeeUserProfile", { other_user_id: item._id })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image style={{ width: 60, height: 60, resizeMode: 'contain',borderRadius:60/2 }} source={profiles} />
                                                    <Text style={[styles.font_regu, { fontSize: 16, marginLeft: 10, fontWeight: 'bold', color: '#000' }]}>{item.username}</Text>
                                                </TouchableOpacity>
                                                <View>
                                                    <TouchableOpacity onPress={() => this.unclick(item._id)} style={{ width: 130, padding: 8, alignItems: 'center', borderRadius: 50, borderWidth: 1, borderColor: 'rgba(180,180,180,0.5)' }}>
                                                        <Text style={[styles.font_regu, { fontSize: 14, color: '#000' }]}>Se désabonner</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            )
                                        }  
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
                                <TouchableOpacity onPress={() => this.setState({ subscriptionDailog: false })+this.unsubscribe()} style={{ width: '48%', height: 45, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
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