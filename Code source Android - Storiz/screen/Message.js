import React from 'react';
import {
    StyleSheet, ActivityIndicator, StatusBar, RefreshControl, FlatList, TouchableOpacity, SafeAreaView, View, Text, Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import strings from '../strings/strings';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

const HTML = `
<html> 
<body> 

<video width="400" controls autoplay>
  <source src="https://www.portal.storiz.eu/uploads/product_videos/2022-04-20T10-29-51.189Zname.mp4" type="video/mp4">
  <source src="mov_bbb.ogg" type="video/ogg">
  Your browser does not support HTML video.
</video>

<p>
Video courtesy of 
<a href="https://www.bigbuckbunny.org/" target="_blank">Big Buck Bunny</a>.
</p>

</body> 
</html>

`;
export default class Message extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            email: '', emailErr: '',
            password: '', passwordErr: '',
            showpassword: true,
            messageList: [],
            sub_count: 0,
            isCurrenetComponentRefreshing: false,
            unreadMessages: 0
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
                        this.messages(user_id, token)
                        this.receiverOnline(user_id, token)
                        this.newSubscribedCount(user_id, token);
                    })
            })
    }

    messages(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token': token
            },
            body: JSON.stringify({ "id": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("messages::::err:::" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        isCurrenetComponentRefreshing: false,
                        unreadMessages: responseData.unreadMessages,
                        messageList: responseData.chat
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        isCurrenetComponentRefreshing: false,
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        Actions.push("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false,
                    isCurrenetComponentRefreshing: false
                });
            });
    }
    messages2() {
        this.setState({
            // isLoading: true
        })
        fetch(strings.base_Url + 'messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token': token
            },
            body: JSON.stringify({ "id": this.state.user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("messages::::err:::" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        isCurrenetComponentRefreshing: false,
                        messageList: responseData.chat
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        isCurrenetComponentRefreshing: false,
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        Actions.push("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false,
                    isCurrenetComponentRefreshing: false
                });
            });
    }
    newSubscribedCount(user_id, token) {
        this.setState({
            isLoading: true
        })
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
                    this.setState({
                        isLoading: false,
                        sub_count: responseData.count
                        //  messageList: responseData.chat
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    if (responseData.message == 'Le jeton n\'est pas valable') {
                        Actions.push("Login")
                        AsyncStorage.setItem("token", '');
                    }
                }
            }
            ).catch((err) => {
                console.log("responsenewSubscribedCounterr:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    receiverOnline(user_id, token) {
        this.setState({
            //isLoading: true
        })
        fetch(strings.base_Url + 'receiverOnline', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token': token
            },
            body: JSON.stringify({
                "id": user_id,
                "status": false
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("receiverOnline::::" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        // isLoading: false,
                    })
                } else {
                    this.setState({
                        // isLoading: false
                    })
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
        const htmlContent = `<p> Hello HE <h1>Good Boy</h1></p>`;
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
                {/* <HTMLView
                    value={htmlContent}
                    stylesheet={styles}
                /> */}
                <View style={{ width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.font_regu, { fontSize: 25, fontWeight: 'bold', color: colors.themeColor, marginLeft: 20 }]}>Messages</Text>
                    {/* <TouchableOpacity 
                    onPress={() => Actions.push("Profile")} 
                    style={{ flexDirection: 'row', width: 45, height: 45, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../assets/7.png')} />
                        {this.state.sub_count == 0 ? null:
                          <View style={{ width: 8, height: 8, borderRadius: 50, backgroundColor: 'red', marginTop: -22, marginLeft: -20 }} />
                        }
                    </TouchableOpacity> */}
                </View>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={this.state.isCurrenetComponentRefreshing} onRefresh={() => {
                        this.setState({ isCurrenetComponentRefreshing: true }); setTimeout(() => {
                            this.messages2();
                        }, 1000)
                    }} />}
                    style={{ width: '100%', marginTop: 60 }}>
                    {this.state.messageList.length == 0 ?
                        <Text style={[styles.font_regu, { fontSize: 18, color: "#000", padding: 20, alignSelf: 'center' }]}>{'Liste de chat non disponible'}</Text>
                        :
                        <View style={{ width: '90%', flexDirection: 'column', alignSelf: 'center', marginBottom: 80 }}>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.messageList}

                                style={{ backgroundColor: '#fff' }}
                                renderItem={({ item, index }) => {
                                    var profiles = '';
                                    if (item.profile == '' || item.profile == undefined || item.profile == "false") {
                                        profiles = require('../assets/dummy_profile.png')
                                    } else {
                                        profiles = { uri: strings.base_image + item.profile }
                                    }
                                    return (
                                        <TouchableOpacity onPress={() => Actions.push("Chat", { room_id: item.roomId, receiver_name: item.roomName, receiver_profile: item.profile, receiver_id: item.OtherId, roomDetails: item })} style={[styles.input_view, { justifyContent: 'space-between', flexDirection: 'row', width: '95%', height: 70, alignItems: 'center' }]}>
                                            <View style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ width: 80, height: 70, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 50 }} source={profiles} />
                                                </View>
                                                <View>
                                                    <Text style={[styles.font_regu, { fontSize: 16, color: '#000', textTransform: 'capitalize' }]}>{item.roomName}</Text>
                                                    {item.status === true ?
                                                        <Text style={[styles.font_regu, { fontSize: 13, color: colors.textColorBlack }]}>{item.productName}</Text>
                                                        :
                                                        <Text style={[styles.font_regu, { fontSize: 13, color: colors.textColorBlack }]}>{item.productName}</Text>
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ width: '15%', height: 80, alignItems: 'center', justifyContent: 'center' }}>
                                                {item.statusOneRead == this.state.user_id ?
                                                    <View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center' }}>
                                                        {/* <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{item.count}</Text> */}
                                                    </View> :
                                                    <View>
                                                        {item.statusTwoRead == this.state.user_id ?
                                                            <View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center' }}>
                                                                {/* <Text style={[styles.font_regu, { fontSize: 16, color: '#fff' }]}>{item.count}</Text> */}
                                                            </View> :
                                                            null
                                                        }
                                                    </View>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                                }
                                extraData={this.state} />
                        </View>
                    }
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
    p: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    h1: {
        fontWeight: '300',
        color: colors.themeColor, // make links coloured pink
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
        height: 45,
        borderRadius: 20,
        paddingHorizontal: 10,
        // borderWidth: 1,
        // borderColor: colors.textGrey,
        backgroundColor: '#fff',
        // justifyContent: 'center',
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

});