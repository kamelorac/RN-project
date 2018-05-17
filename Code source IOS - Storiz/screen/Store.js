import React from 'react';
import {
    StyleSheet, StatusBar, RefreshControl, Dimensions, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import strings from '../strings/strings';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
var cat1 = false
var cat2 = false
var cat3 = false
var cat4 = false
const options = {
    width: 720,
    height: 1280,
    bitrateMultiplier: 3,
    saveToCameraRoll: true, // default is false, iOS only
    saveWithCurrentDate: true, // default is false, iOS only
    minimumBitrate: 300000,
    //removeAudio: true, // default is false
};
export default class Store extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '', emailErr: '',
            password: '', passwordErr: '',
            showpassword: true,
            messageList: [],
            messageList2: [],
            fitlerList: [{ name: 'Prix' }, { name: 'Etat' }, { name: 'Date de publication' }, { name: 'Distance' }],
            selectfilter: 0,
            clickFilterbutton: false,
            serachButton: false,
            videoImage: '',
            priceLess: false,
            priceMost: false,
            conditionList: [{ name: 'Etat neuf' }, { name: 'Très bon état' }, { name: 'Bon état' }, { name: 'Etat moyen' }],
            selectcondition: null,
            selectcondition_Name: '',
            datelatest: false,
            daterecent: false,
            distanceNear: false,
            distanceCloseNot: false,
            user_id: '',
            token: '',
            currentlatitude: 37.78825,
            currentlongitude: -122.4324,
            sub_count: 0,
            price_reclick: false,
            price_reclick2: false,
            cate_reclick: false,
            dis_reclcik: false,
            dis_reclcik2: false,
            date_reclick: false,
            date_reclick2: false,
            isCurrenetComponentRefreshing: false,
        };
    }
    componentDidMount() {
        this.will_fouce()
        this.focusListener = this.props.navigation.addListener('focus',
            () => this.will_fouce())
    }
    will_fouce() {

        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });
                        console.log("state token============" + token);
                        this.getMyProductList(user_id, token)
                        this.newSubscribedCount(user_id, token)
                    })
            })
    }
    newSubscribedCount(user_id, token) {
        this.setState({ isLoading: true })
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
                    this.setState({ isLoading: false, sub_count: responseData.count })
                } else {
                    this.setState({ isLoading: false })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("responsenewSubscribedCounterr:::" + err);
                this.setState({ isLoading: false });
            });
    }
    searchFilterFunction = text => {
        console.log("data print:::" + text)
        const newData = this.state.messageList2.filter(item => {
            const itemData = `${item.name.toUpperCase()} || ${item.price}`
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        console.log("data print:::" + JSON.stringify(newData))
        if (text == '') {
            this.setState({ messageList: this.state.messageList2 })
        } else {
            this.setState({ messageList: newData });
        }
    };

    getUserCurrentLocation() {
        let latitude, longitude

        Geolocation.getCurrentPosition(
            info => {
                const { coords } = info
                latitude = coords.latitude
                longitude = coords.longitude
                console.log("Info ", coords)
                this.setState({
                    currentlatitude: latitude,
                    currentlongitude: longitude,
                });
            },
            error => console.log(error),
            {
                enableHighAccuracy: false,
                timeout: 2000,
                maximumAge: 3600000
            }
        )
    }
    getMyProductList(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'getOtherProductList', {
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
                console.log("data print:::" + JSON.stringify(responseData))
                if (responseData.success === true) {

                    this.setState({
                        isLoading: false,
                        messageList: responseData.products,
                        messageList2: responseData.products,
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login")
                        AsyncStorage.setItem("token", '');
                    }
                    //alert(responseData.message)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    getMyProductList2() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'getOtherProductList', {
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

                if (responseData.success === true) {

                    this.setState({
                        isLoading: false,
                        isCurrenetComponentRefreshing: false,
                        messageList: responseData.products,
                        messageList2: responseData.products,
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        isCurrenetComponentRefreshing: false,
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login")
                        AsyncStorage.setItem("token", '');
                    }
                    //alert(responseData.message)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false,
                    isCurrenetComponentRefreshing: false,
                });
            });
    }
    clickFilter() {
        this.setState({
            priceLess: false,
            priceMost: false,
            selectcondition: null,
            selectcondition_Name: '',
            datelatest: false,
            daterecent: false,
            distanceNear: false,
            distanceCloseNot: false
        })
    }
    getOtherProductListByLocation2(value, dis_reclcik) {
        console.log("response::::dis_reclcik:::" + JSON.stringify(value), dis_reclcik);
        if (value == 1) {
            if (dis_reclcik === true) {
                this.setState({ dis_reclcik2: false })
                this.getOtherProductListByLocation(value)
            } else {
                this.setState({
                    distanceCloseNot: false, distanceNear: false, dis_reclcik2: false
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (value == -1) {
            if (dis_reclcik === true) {
                this.setState({ dis_reclcik: false })
                this.getOtherProductListByLocation(value)
            } else {
                this.setState({
                    distanceCloseNot: false, distanceNear: false, dis_reclcik: false
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }
    }
    getOtherProductListByLocation(value) {
        console.log("near data " + JSON.stringify({
            "id": this.state.user_id,
            "lat": this.state.currentlatitude,
            "long": this.state.currentlongitude
        }))
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'getOtherProductListByLocation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "lat": this.state.currentlatitude,
                "long": this.state.currentlongitude,
                "up": value
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                //  console.log("response::::getOtherProductSortByDate:::" + JSON.stringify(responseData));

                if (responseData.success === true) {

                    this.setState({
                        isLoading: false,
                        messageList: responseData.products,
                        messageList2: responseData.products,
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    getOtherProductSortByDate2(value, dis_reclcik) {
        console.log("response::::date_reclick2:::" + JSON.stringify(value), dis_reclcik);
        if (value == 1) {
            if (dis_reclcik === true) {
                this.setState({ date_reclick2: false })
                this.getOtherProductSortByDate(value)
            } else {
                this.setState({
                    datelatest: false, daterecent: false, date_reclick2: false
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (value == -1) {
            if (dis_reclcik === true) {
                this.setState({ date_reclick: false })
                this.getOtherProductSortByDate(value)
            } else {
                this.setState({
                    datelatest: false, daterecent: false, date_reclick: false
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }
    }

    getOtherProductSortByDate(value) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'getOtherProductSortByDate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "date": value
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                //  console.log("response::::getOtherProductSortByDate:::" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        messageList: responseData.products,
                        messageList2: responseData.products,
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    getreclick(value, index) {
        console.log("value::::cate_reclick:::" + value, cat1);
        if (index == 0) {
            if (cat1 == false) {
                cat1 = true
                this.getOtherProductListByFilter(value)
            } else {
                cat1 = false
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (index == 1) {
            if (cat2 == false) {
                cat2 = true
                this.getOtherProductListByFilter(value)
            } else {
                cat2 = false
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }
        else if (index == 2) {
            if (cat3 == false) {
                cat3 = true
                this.getOtherProductListByFilter(value)
            } else {
                cat3 = false
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }
        else if (index == 3) {
            if (cat4 == false) {
                cat4 = true
                this.getOtherProductListByFilter(value)
            } else {
                cat4 = false
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }

    }
    getOtherProductListByFilter2(value, cate_reclick) {
        console.log("value::::cate_reclick:::" + JSON.stringify(value), cate_reclick);

        if (value == 'Neuf') {
            if (cate_reclick == true) {
                this.getOtherProductListByFilter(value)
            } else {
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (value == 'Très bon état') {
            if (cate_reclick == true) {
                this.getOtherProductListByFilter(value)
            } else {
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (value == 'Normal') {
            if (cate_reclick == true) {
                this.getOtherProductListByFilter(value)
            } else {
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (value == 'Pas fameux mais ça va') {
            if (cate_reclick == true) {
                this.getOtherProductListByFilter(value)
            } else {
                this.setState({
                    selectcondition: null,
                    selectcondition_Name: '',
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }

    }

    getOtherProductListByFilter(value) {
        console.log("value::::getOtherProductSortByDate:::" + JSON.stringify(value));

        this.setState({
            isLoading: true,
            messageList: [],
            messageList2: []
        })
        fetch(strings.base_Url + 'getOtherProductListByFilter', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "status": value
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("response::::getOtherProductListByFilter:::" + JSON.stringify(responseData));

                if (responseData.success === true) {

                    this.setState({
                        isLoading: false,
                        messageList: responseData.products,
                        messageList2: responseData.products,
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        messageList: [],
                        messageList2: []
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    getOtherProductSortByPrice2(value, price_reclick12) {
        console.log("response:price_reclick :::value:::" + value, price_reclick12);
        if (value == 1) {
            if (price_reclick12 === true) {
                this.setState({
                    price_reclick2: false
                })
                this.getOtherProductSortByPrice(value)
            } else {
                this.setState({
                    priceLess: false, priceMost: false, price_reclick2: false
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        } else if (value == -1) {
            if (price_reclick12 === true) {
                this.setState({
                    price_reclick: false
                })
                this.getOtherProductSortByPrice(value)
            } else {
                this.setState({
                    priceLess: false, priceMost: false, price_reclick: false
                })
                this.getMyProductList(this.state.user_id, this.state.token)
            }
        }
    }
    getOtherProductSortByPrice(value) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'getOtherProductSortByPrice', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "price": value
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("response::::getOtherProductSortByDate:::" + JSON.stringify(responseData));

                if (responseData.success === true) {

                    this.setState({
                        isLoading: false,
                        messageList: responseData.products,
                        messageList2: responseData.products,
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        this.props.navigation.navigate("Login") + AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
                {this.state.serachButton === false && (
                    <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.font_regu, { fontSize: 25, fontWeight: 'bold', color: colors.themeColor, marginLeft: 20 }]}>Storiz</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ clickFilterbutton: !this.state.clickFilterbutton, serachButton: false })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/16.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ clickFilterbutton: false, serachButton: !this.state.serachButton })} style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'flex-end', }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'black' }} source={require('../assets/search.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")} style={{ flexDirection: 'row', width: 45, height: 45, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../assets/7.png')} />
                                {this.state.sub_count == 0 ? null :
                                    <View style={{ width: 8, height: 8, borderRadius: 50, backgroundColor: 'red', marginTop: -22, marginLeft: -20 }} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                }
                {this.state.serachButton === true && (
                    <View style={{ width: '80%', alignSelf: 'center', marginTop: 20, marginBottom: 10 }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', height: 45, borderRadius: 50, alignSelf: 'center', marginBottom: 0, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: 'black' }} source={require('../assets/search.png')} />
                                <TextInput
                                    placeholder='Recherche '
                                    placeholderTextColor={'#000'}
                                    value={this.state.titel}
                                    onChangeText={(titel) => this.searchFilterFunction(titel)}
                                    style={[styles.font_regu, { width: '70%', marginLeft: 10, fontSize: 16, color: colors.textColorBlack, }]}></TextInput>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ serachButton: false })}>
                                <Text style={[styles.font_regu, { fontSize: 14, color: '#000', fontWeight: 'bold', marginRight: 8 }]}>{'Annuler'}</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ width: '100%', height: 1.5, backgroundColor: '#b2b2b2' }} />
                    </View>
                )
                }
                {this.state.clickFilterbutton == true && (
                    <View style={{ width: '85%', padding: 10, borderRadius: 8, alignSelf: 'center', marginBottom: 20, paddingBottom: 20, backgroundColor: 'rgba(180,180,180,0.1)' }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 20 }}>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.fitlerList}
                                numColumns={10}
                                //style={{ backgroundColor: '#fff' }}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity onPress={() => this.setState({ selectfilter: index }) + this.clickFilter()} style={[{ alignItems: 'center' }]}>
                                        {this.state.selectfilter == index ?
                                            <View>
                                                <Text style={[styles.font_regu, { fontSize: 13, color: '#000', paddingLeft: 10 }]}> {item.name} </Text>
                                                <View style={{ height: 3, backgroundColor: '#000', marginLeft: 10, marginTop: 10 }}></View>
                                            </View>
                                            :
                                            <Text style={[styles.font_regu, { fontSize: 13, color: '#000', paddingLeft: 10 }]}> {item.name} </Text>

                                        }
                                    </TouchableOpacity>
                                }
                                extraData={this.state} />
                        </ScrollView>
                        <View style={{ width: '95%', height: 0.5, backgroundColor: 'rgba(0,0,0,0.9)', marginTop: 0, marginBottom: 20, marginLeft: 11 }} />
                        {this.state.selectfilter == 0 && (
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ priceLess: false, priceMost: true, price_reclick: !this.state.price_reclick })
                                    + this.getOtherProductSortByPrice2(1, !this.state.price_reclick)}>
                                    <Text style={[styles.font_regu, { fontSize: 13, color: this.state.priceMost === true ? colors.themeColor : '#b2b2b2', paddingLeft: 15, marginTop: 10 }]}> {"Les mois chers d'abord"} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ priceLess: true, priceMost: false, price_reclick2: !this.state.price_reclick2 }) + +this.getOtherProductSortByPrice2(-1, !this.state.price_reclick2)}>
                                    <Text style={[styles.font_regu, { fontSize: 13, color: this.state.priceLess === true ? colors.themeColor : '#b2b2b2', paddingLeft: 15, marginTop: 15, marginBottom: 20 }]}> {"Les plus chers d'abord"} </Text>
                                </TouchableOpacity>
                            </View>
                        )
                        }
                        {this.state.selectfilter == 1 && (
                            <View>
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.conditionList}
                                    //numColumns={10}
                                    //style={{ backgroundColor: '#fff' }}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity onPress={() => this.setState({ selectcondition: index, selectcondition_Name: item.name, cate_reclick: !this.state.cate_reclick }) +
                                            this.getreclick(item.name, index)}>
                                            <View style={{ width: '100%', marginTop: 15, marginLeft: 10 }}>
                                                <View>
                                                    {this.state.selectcondition == index ?
                                                        <Text style={[styles.font_regu, { fontSize: 13, color: colors.themeColor, paddingLeft: 5, marginTop: 0 }]}> {item.name} </Text> :
                                                        <Text style={[styles.font_regu, { fontSize: 13, color: '#b2b2b2', paddingLeft: 5, marginTop: 0 }]}> {item.name} </Text>
                                                    }
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    extraData={this.state} />
                            </View>
                        )
                        }
                        {this.state.selectfilter == 2 && (
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ datelatest: false, daterecent: true, date_reclick2: !this.state.date_reclick2 }) + this.getOtherProductSortByDate2(-1, !this.state.date_reclick2)}>
                                    <Text style={[styles.font_regu, { fontSize: 13, color: this.state.daterecent === true ? colors.themeColor : '#b2b2b2', paddingLeft: 15 }]}> {"Les plus récente storiz d'abord"} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ datelatest: true, daterecent: false, date_reclick: !this.state.date_reclick }) + this.getOtherProductSortByDate2(1, !this.state.date_reclick)}>
                                    <Text style={[styles.font_regu, { fontSize: 13, color: this.state.datelatest === true ? colors.themeColor : '#b2b2b2', paddingLeft: 15, marginTop: 15 }]}> {"Les storiz moins récente storiz d'abord"} </Text>
                                </TouchableOpacity>
                            </View>

                        )
                        }
                        {this.state.selectfilter == 3 && (
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ distanceCloseNot: false, distanceNear: true, dis_reclcik: !this.state.dis_reclcik }) + this.getOtherProductListByLocation2(1, !this.state.dis_reclcik)}>
                                    <Text style={[styles.font_regu, { fontSize: 13, color: this.state.distanceNear === true ? colors.themeColor : '#b2b2b2', paddingLeft: 15 }]}> {"Les plus proche de moi"} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ distanceCloseNot: true, distanceNear: false, dis_reclcik2: !this.state.dis_reclcik2 }) + this.getOtherProductListByLocation2(-1, !this.state.dis_reclcik2)}>
                                    <Text style={[styles.font_regu, { fontSize: 13, color: this.state.distanceCloseNot === true ? colors.themeColor : '#b2b2b2', paddingLeft: 15, marginTop: 15 }]}> {"Les moins proche de moi"} </Text>
                                </TouchableOpacity>
                            </View>

                        )
                        }


                    </View>
                )
                }
                {this.state.messageList.length == 0 ?
                    <Text style={[styles.font_regu, { fontSize: 18, color: "#000", padding: 20, alignSelf: 'center' }]}>{' Données de la liste non disponibles '}</Text>
                    :
                    <ScrollView style={{ width: '100%' }}
                        refreshControl={<RefreshControl refreshing={this.state.isCurrenetComponentRefreshing} onRefresh={() => {
                            this.setState({ isCurrenetComponentRefreshing: true }); setTimeout(() => {
                                // this.fetchsearch_teacher_booking_later();
                                this.getMyProductList2();
                            }, 1000)
                        }} />}
                    >
                        <View style={{ width: '95%', flexDirection: 'column', alignSelf: 'center', marginBottom: 80 }}>

                            <View style={{ width: '95%', alignSelf: 'center', backgroundColor: 'red' }}>
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.messageList}
                                    numColumns={2}
                                    style={{ backgroundColor: '#fff' }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ width: '50%', alignItems: 'center' }}>
                                                <View style={{ width: width * 40 / 100, alignItems: 'center', marginTop: 20 }}>
                                                    <TouchableOpacity
                                                        //  onPress={() => this.props.navigation.navigate("WebVideoPlay", { videoUrl: item.videoslink[0], posterImage: strings.base_video + item.thumbnail, product_id: item._id })} 
                                                        onPress={() => this.props.navigation.navigate("Swapping", { videoUrl: item.videoslink[0], posterImage: strings.base_video + item.thumbnail, product_id: item._id, item_data: item, item_list_data: this.state.messageList, item_index: index })}
                                                        style={[{ width: '90%', alignItems: 'center' }]}>
                                                        <View style={[{ width: '100%', alignSelf: 'flex-start' }]}>
                                                            {item.thumbnail == undefined ?
                                                                <View style={{ height: width * 50 / 100 }}>
                                                                </View> :
                                                                <View style={styles.input_view}>
                                                                    <Image style={{
                                                                        width: '100%', height: width * 48 / 100, borderRadius: 15, shadowColor: '#000',
                                                                        shadowOffset: { width: 0, height: 1 },
                                                                        shadowOpacity: 0.8,
                                                                        shadowRadius: 1,
                                                                        backgroundColor: 'white'
                                                                    }}
                                                                        source={{ uri: strings.base_video + item.thumbnail }} />
                                                                </View>
                                                            }
                                                        </View>
                                                        <View style={{ width: '100%', marginTop: 10, marginBottom: 20, marginLeft: 10 }}>
                                                            <Text style={[styles.font_regu, { fontSize: 14, color: '#000', }]}>{item.name}</Text>
                                                            <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 16, color: '#000', paddingTop: 5 }]}>{item.price + item.currency}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>)
                                    }
                                    }
                                    extraData={this.state} />
                            </View>
                        </View>
                    </ScrollView>
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
        fontWeight: '500'
    },
    font_regu: {
        fontWeight: '500'
    },
    font_bold: {
        fontWeight: '800'
    },
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        //padding:10
        // backgroundColor:'white'
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

});