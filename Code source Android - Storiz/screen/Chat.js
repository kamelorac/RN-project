import React from 'react';
import { ActivityIndicator,Alert, StyleSheet, Platform, SafeAreaView, FlatList, Modal, StatusBar, View, ImageBackground, Text, Image, Dimensions, TouchableOpacity, Linking, } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import colors from '../color/color'
import SocketIO from "socket.io-client";
import strings from '../strings/strings';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'
import { Video ,getVideoMetaData} from 'react-native-compressor';
import RNFetchBlob from 'rn-fetch-blob';
import RBSheet from "react-native-raw-bottom-sheet";
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-community/async-storage';
const connectionConfig = {
    secure: true,
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    //rejectUnauthorized: false
}
var chatdata = []
var format;

export default class Chat extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            token: '',
            chat: [],
            isLoading: false,
            list: [],
            text_msg: '',
            user_id: '',
            senderName: '',
            senderProfile: '',
            profileblockModel: false,
            profileblockDailog: false,
            profile_block: false,
            isLoading_2:false
        };
    }

    //     Aller au profil
    // bloquer le profil
    // Vous devez bloquer ce profil

    componentDidMount() {
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state this.props.room_id============" + this.props.room_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });
                        console.log("state token============" + token);
                        console.log("state roomDetails===== %%%%=======" + JSON.stringify(this.props.roomDetails));
                       
                        this.getprofile(user_id, token)
                        this.messages(user_id, token)
                       this.receiverOnline(user_id, token)
                    })
            })
        this.socket = SocketIO(strings.base_sckote, connectionConfig);
        this.socket.on('connect', () => {
            console.log('connected to Storize server');
            //alert('connected to hakwe server')
            this.next_step()
            
        });
        this.socket.on('connect_error', (err) => {
            console.log(err);
        });
    }
    getprofile(user_id, token) {
        this.setState({
            //isLoading: true
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
                        senderName: responseData.user.username,
                        senderProfile: responseData.user.profile_image,
                        //fav_data: response.user.favouriteAudio,
                        profile_block: responseData.user.blockedUsers.includes(this.props.roomDetails.OtherId)
                    })
                    console.log("profile_block  " +this.state.profile_block)

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
                console.log("response::::err::getprofile:       " + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    reportVideo() {
        Alert.alert(
            "Signalé",
            'Vous êtes sûr de vouloir faire un reportage utilisateur?',
            [
                {
                    text: 'Oui',
                    onPress: () => { this.reportUserApi() },
                    style: 'cancel',
                },
                { text: 'Non', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        )
    }
    reportUserApi() {
        console.log("data reportVideoApi "+JSON.stringify({
            "reporterId": this.state.user_id,
            "reason": 'other',
            "id":this.props.roomDetails.OtherId
        }))
        this.setState({
            isLoading_2: true
        })
        fetch(strings.base_Url + 'reportUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "reporterId": this.state.user_id,
                "reason": 'other',
                "id":this.props.roomDetails.OtherId
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" reportUser=  ==" + JSON.stringify(responseData))

                if (responseData.success === true) {
                    this.setState({
                        isLoading_2: false,
                    })
                     alert(responseData.message)
                } else {
                    this.setState({
                        isLoading_2: false
                    })
                    console.log(" reportVideo= newArr ==" + JSON.stringify(responseData.message))
                    alert(responseData.message)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading_2: false
                });
            });
    }
    messages(user_id, token) {
        this.setState({
            //isLoading: true
        })
        console.log("messagesDetails:: user_id::" + JSON.stringify(user_id));
        fetch(strings.base_Url + 'messagesDetails/' + this.props.room_id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-access-token': token
            },
            body: JSON.stringify({ "userid": user_id })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("messagesDetails::::" + JSON.stringify(responseData));
                chatdata = responseData.chat.chats
                this.setState({
                    isLoading: false,
                    list: responseData.chat.chats
                })
                if (responseData.success === true) {

                    this.setState({
                        isLoading: false,
                        list: responseData.chat.chats
                    })
                    console.log("chatdata::::err:::" + chatdata.length);
                } else {
                    this.setState({
                        isLoading: false
                    })
                }
            }
            ).catch((err) => {
                console.log("response::::err::messagesDetails    " + err);
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
                "status": true
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
                console.log("response::::err::receiverOnline:       " + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    next_step() {
        this.socket.on('chatsend', (data) => {
            console.log('chat is ::%%!!!!%%::###' + JSON.stringify(data.chats));
            this.setState({ list: data.chats })
        })
    }
    validation() {
        if (this.state.text_msg == '') {

        } else {
            this.submitChatMessage("text", this.state.text_msg)
        }

    }
    submitChatMessage(type, msg) {
        var msg_sent = {
            message: msg,
            messageType: type,
            format: 'png',
            recieverId: this.props.roomDetails.OtherId,
            receiverName: this.props.receiver_name,
            receiverProfile: this.props.receiver_profile,
            senderId: this.state.user_id,
            senderName: this.state.senderName,
            senderProfile: this.state.senderProfile,
            productID: this.props.roomDetails.productID,
            productName: this.props.roomDetails.productName,
        }
        // this.setState({ textmsgText: 'HEllo' })
        //alert(msg_sent)
        console.log( "emit data && "+ JSON.stringify(msg_sent))
        this.socket.emit('chat', msg_sent);
        this.setState({ text_msg: '' })
        this.socket.on('chatsend', (data) => {
            this.setState({ list: data.chats})
            console.log('chat is :::::' + JSON.stringify(data));

        })

    }
    chooseFromGallary2 = async () => {
        // iPhone/Android
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.video],
                readContent: true
            })
            console.log('file : ' + JSON.stringify(file))
            RNFetchBlob.fs
                .readFile(file[0].uri, 'base64')
                .then((data) => {
                    console.log('data : ' + "JSON.stringify(data)")
                })
                .catch((err) => { });
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
                alert('Canceled')
            } else {
                alert('unknown error: ' + JSON.stringify(err))
                throw err
            }
        }

    }
    chooseFromGallary() {
        var options = {
            title: 'Select Image',
            videoQuality: 'low',
            includeBase64: true,
            // includeExtra:true,
            durationLimit: 30,
            mediaType: 'video',
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
               this.cpmpress(response.assets[0].uri)
                //this.uploadProduct(response.assets[0].uri)

                RNFetchBlob.fs
                    .readFile(response.assets[0].uri, 'base64')
                    .then((data) => {
                        // console.log('data : ' + data)
                        //this.submitChatMessage('video', "data")
                    })
                    .catch((err) => { });
            }
        });
    }
    async cpmpress(videoUrl){
        this.setState({ isLoading: true })
        console.log("result this.props.videoUrl  metaData :$$%%%%%:::" + videoUrl)
            const result = await Video.compress(
               videoUrl,
                {
                  compressionMethod: 'auto',
                },
                (progress) => {
                    console.log('Compression Progress: ', progress);
                }
              );
              console.log("result  1:$$%%%%%:::"+ result)
              data_url = result 
              this.uploadProduct(result)
              console.log("result 2 data_url :$$%%%%%:::"+ data_url)
        }
    chooseFromGallary3() {
        var options = {
            title: 'Select Image',
            includeBase64: true,
            mediaType: 'photo',
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
                ImageResizer.createResizedImage(response.assets[0].uri,  200,200,"JPEG", 100,0,)
                .then(response => {
                    RNFetchBlob.fs
                    .readFile(response.path, 'base64')
                    .then((data) => {
                      console.log('data : ' + data)
                        this.submitChatMessage('image', data)
                    })
                    .catch((err) => { }); 
                  
                })
                .catch(err => {alert(err)});
                //this.submitChatMessage('image', response.assets[0].base64)
                // this.uploadImage(RNFetchBlob.wrap(response.assets[0].uri))
                // ,
            }
        });
    }
    uploadProduct(videoUrl) {
        console.log("Image URL@@@###%% " + videoUrl)
        this.setState({ isLoading: true })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.state.token
        };
        RNFetchBlob.fetch('POST', strings.base_Url + "user-chat-video", headers, [
            { name: 'id', data: this.state.user_id },
            { name: 'chat', filename: 'name.mp4', type: 'video/mp4', data: RNFetchBlob.wrap(videoUrl) },
        ],
        )
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData userupdate ===" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({ isLoading: false })
                    this.submitChatMessage('video', responseData.path)
                } else {
                    alert(responseData.message)
                    this.setState({ isLoading: false })
                }
            })
            .catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({ isLoading: false });
            });
    }
    blockUser() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'blockUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "blockId": this.props.receiver_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("blockUser   ==" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                    })
                    // sub_true_false=true
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

    unBlockUser() {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'unBlockUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.state.user_id,
                "blockId": this.props.receiver_id
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("unBlockUser   ==" + JSON.stringify(responseData));
                if (responseData.status === true) {
                    this.setState({
                        isLoading: false,
                    })
                    // sub_true_false=true
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
    render() {
        // console.log("messagesDetails: length:::" + this.state.list.length);
        // if (this.state.isLoading) {
        //     return (
        //         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        //             <ActivityIndicator size="large" color="#0c9" />
        //         </View>
        //     )
        // }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
                    <View style={{ alignSelf: 'center', width: '90%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => 
                            //Actions.push("Home")
                            Actions.pop()
                          // Actions.push("HomeViewPager")
                            } style={{ alignSelf: 'flex-start', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ profileblockModel: true })}
                                style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', }}>
                                <Image style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: 'black' }} source={require('../assets/menu.png')} />
                            </TouchableOpacity>

                        </View>
                        
                    </View>
                    <View style={{ width: '90%', alignSelf: 'center', backgroundColor: '#fff' }}>
                        {this.state.list.length != 0 && (
                            <View style={{ marginTop: 20, marginBottom: 10 }}>
                                <Text style={[styles.font_regu, { fontSize: 20, color: '#000', marginLeft: 20, fontWeight: 'bold', textTransform: 'capitalize' }]}>{this.props.receiver_name}</Text>
                                <Text style={[styles.font_regu, { fontSize: 16, color: colors.themeColor, marginLeft: 20 }]}>{this.state.list[0].productName}</Text>
                            </View>
                        )
                        }
                    </View>
                    <View style={{
                        flex: 1,
                        padding: 10, backgroundColor: '#fff'

                    }}>
                        <FlatList
                            data={this.state.list}
                            showsVerticalScrollIndicator={false}
                            ref={ref => this.flatList = ref}
                            onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                            onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                            renderItem={({ item }) => {                   
                                return (
                                    <View style={{ flex: 1, marginTop: 10, }}>
                                        {item.senderId != this.state.user_id ?
                                            <View style={{ flexDirection: 'row', padding: 8, borderRadius: 10, }}>
                                                <View style={{ minheight: 30, padding: 5, maxWidth: width * 80 / 100, }}>
                                                    {item.messageType == 'text' && (
                                                        <View style={{ minheight: 30, padding: 5, maxWidth: width * 80 / 100, }}>
                                                            <ImageBackground source={require('../assets/bgtheme.png')} resizeMode='stretch' style={{ padding: 10 }}>
                                                                <Text style={[styles.font_regu, { color: '#fff', fontSize: 16, }]}>
                                                                    {item.message}
                                                                </Text>
                                                            </ImageBackground>
                                                        </View>
                                                    )
                                                    }
                                                    {item.messageType == 'image' && (
                                                        <TouchableOpacity onPress={() => Actions.push("ChatVideoPlay", { video_url: item.message })} style={{ width: 150, height: 150, backgroundColor: 'rgba(180,180,180,0.4)', borderRadius: 4, padding: 4 }}>
                                                            <Image source={{ uri: strings.base_video + item.message }} style={{ width: '100%', height: '100%', }} />
                                                        </TouchableOpacity>
                                                    )
                                                    }
                                                    {item.messageType == 'video' && (
                                                        <TouchableOpacity onPress={() => Actions.push("ChatVideoPlay", { video_url: item.message })} style={{ alignItems: 'center', justifyContent: 'center', width: 150, height: 150, backgroundColor: 'rgba(180,180,180,0.4)', borderRadius: 4, padding: 4 }}>
                                                            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Image source={require('../assets/ui_play.png')} style={{ width: 50, height: 50, tintColor: '#000' }} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                    }
                                                </View>
                                            </View> :
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                                                <View style={{ marginRight: 10, minheight: 40, maxWidth: width * 80 / 100, padding: 5 }}>
                                                    {item.messageType == 'text' && (
                                                        <View style={{ marginRight: 10, minheight: 40, maxWidth: width * 80 / 100, padding: 5 }}>
                                                            <ImageBackground source={require('../assets/bggrey.png')} resizeMode='stretch' style={{ padding: 5 }}>
                                                                <Text style={[styles.font_regu, { color: '#000', paddingLeft: 10, paddingRight: 20, paddingTop: 10, paddingBottom: 10, fontSize: 16, }]}>
                                                                    {item.message}
                                                                </Text>
                                                            </ImageBackground>
                                                            {item.seen === false ? null :
                                                                <Text style={{ alignSelf: 'flex-end', color: 'grey', fontSize: 8 }}>
                                                                    Seen
                                                                </Text>
                                                            }
                                                        </View>
                                                    )
                                                    }
                                                    {item.messageType == 'image' && (
                                                        <TouchableOpacity onPress={() => Actions.push("ChatVideoPlay", { video_url: item.message })} style={{ width: 150, height: 150, backgroundColor: 'rgba(180,180,180,0.4)', borderRadius: 4, padding: 4 }}>
                                                            <Image source={{ uri: strings.base_video + item.message }} style={{ width: '100%', height: '100%', }} />
                                                        </TouchableOpacity>
                                                    )
                                                    }
                                                    {item.messageType == 'video' && (
                                                        <TouchableOpacity onPress={() => Actions.push("ChatVideoPlay", { video_url: item.message })} style={{ alignItems: 'center', justifyContent: 'center', width: 150, height: 150, backgroundColor: 'rgba(180,180,180,0.4)', borderRadius: 4, padding: 4 }}>
                                                            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Image source={require('../assets/ui_play.png')} style={{ width: 50, height: 50, tintColor: '#000' }} />
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                    }
                                                </View>
                                            </View>
                                        }
                                    </View>
                                )
                            }
                            }
                        />
                    </View>
                    {this.state.isLoading === true && (
                        <View style={{ alignSelf: 'flex-end', marginRight: 23, alignItems: 'center', justifyContent: 'center', width: 150, height: 150, backgroundColor: 'rgba(180,180,180,0.4)', borderRadius: 4, padding: 4 }}>
                            <ActivityIndicator size="large" color="#0c9" />
                        </View>
                    )
                    }
                     {this.state.isLoading_2 === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent" }}>
                        <View style={[styles.lodaing_view,{ width: 50, height: 50,}]}>
                            <ActivityIndicator size="large" color={colors.themeColor} />
                        </View>
                    </View>
                )
                }
                    {this.state.profile_block === false ?
                        <View style={{ backgroundColor: '#fff', justifyContent: 'flex-end', }}>
                            <View style={{ backgroundColor: '#fff', marginBottom: 0, height: 60, alignItems: 'center' }}>
                                <View style={{ width: '95%', height: 40, borderRadius: 50, marginLeft: 5, marginRight: 5, marginTop: 5, flexDirection: 'row' }}>
                                    <View style={{ position: 'absolute', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', bottom: 0, width: width * 95 / 100, alignSelf: 'center', borderRadius: 20, height: 45 }}>
                                        <TextInput
                                            value={this.state.text_msg}
                                            placeholder={'Ecrire un message ...'}
                                            placeholderTextColor='grey'
                                            multiline={true}
                                            onChangeText={(text_msg) => this.setState({ text_msg })}
                                            style={[styles.font_regu, { color: '#000', padding: 8, paddingLeft: 20, width: width * 78 / 100 - 30, fontSize: 16, backgroundColor: 'rgba(180,180,180,0.1)', elevation: 0, borderRadius: 50 }]}
                                        />
                                        <TouchableOpacity onPress={() => this.RBSheet.open()} style={{ marginLeft: 5, marginRight: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                            <Image source={require('../assets/14.png')} style={{ width: 20, height: 20, resizeMode: 'contain',tintColor:'#fff' }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.validation()} style={{ marginRight: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor, borderRadius: 40 / 2 }}>
                                            <Image source={require('../assets/send.png')} style={{ width: 20, height: 20, resizeMode: 'contain', }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View> :
                        <View style={{ backgroundColor: '#fff', justifyContent: 'flex-end', }}>
                            <View style={{ backgroundColor: '#fff', marginBottom: 0, height: 60, alignItems: 'center' }}>
                                <Text style={[styles.font_regu, { color: '#000', paddingLeft: 10, paddingRight: 20, paddingTop: 10, paddingBottom: 10, fontSize: 16, }]}>Vous avez bloqué cet utilisateur</Text>
                                <Text onPress={() => this.unBlockUser()} style={[styles.font_regu, { color: colors.themeColor, paddingLeft: 10, paddingRight: 20, paddingTop: 0, paddingBottom: 10, fontSize: 16, textDecorationLine: 'underline', }]}>Débloquer</Text>
                            </View>
                        </View>
                    }

                </View>
                <RBSheet
                    ref={ref => { this.RBSheet = ref; }}
                    height={200}
                    duration={200}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            borderRadius: 10,
                            backgroundColor: '#fff',
                            justifyContent: 'center'
                        }
                    }}>
                    <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'column', borderWidth: 0.5, borderColor: 'white', borderRadius: 4, }}>
                        <View style={{ backgroundColor: '#fff', marginBottom: 0, height: 100, alignItems: 'center' }}>
                            <View style={{ alignSelf: 'center', justifyContent: 'space-around', width: '95%', height: 140, borderRadius: 50, marginLeft: 5, marginRight: 5, marginTop: 5, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.chooseFromGallary3() + this.RBSheet.close()} style={{ width: 100, alignItems: 'center' }}>
                                    <Image source={require('../assets/picture.png')} style={{ width: 50, height: 50, resizeMode: 'contain', }} />
                                    <Text style={[styles.font_regu, { color: '#000', paddingLeft: 10, paddingRight: 20, paddingTop: 10, paddingBottom: 10, fontSize: 16, }]}>
                                        {"l'image"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.chooseFromGallary() + this.RBSheet.close()} style={{ width: 100, alignItems: 'center' }}>
                                    <Image source={require('../assets/gallery.png')} style={{ width: 50, height: 50, resizeMode: 'contain', }} />
                                    <Text style={[styles.font_regu, { color: '#000', paddingLeft: 10, paddingRight: 20, paddingTop: 10, paddingBottom: 10, fontSize: 16, }]}>
                                        {"Vidéo"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </RBSheet>
                {this.state.profileblockModel === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                        <View style={[{ width: '80%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#fff' }]}>
                            <TouchableOpacity onPress={() => Actions.push("SeeUserProfile", { other_user_id: this.props.receiver_id })} style={{ marginTop: 30 }} >
                                <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', }]}>Accès au profil</Text>
                            </TouchableOpacity >
                            <View style={{ width: 80, height: 1.5, backgroundColor: 'grey', marginTop: 20 }} />
                            <TouchableOpacity onPress={() => this.setState({profileblockModel: false})+ this.reportVideo()} style={{ marginTop: 30 }} >
                                <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000', }]}>Signaler le profil</Text>
                            </TouchableOpacity >
                            <View style={{ width: 80, height: 1.5, backgroundColor: 'grey', marginTop: 20 }} />                  
                            {this.state.profile_block === true ?
                                <TouchableOpacity onPress={() => this.setState({ profileblockModel: false }) + this.unBlockUser()} style={{ marginBottom: 20, marginTop: 20 }}>
                                    <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000' }]}>Débloquer le profil</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={() => this.setState({ profileblockModel: false, profileblockDailog: true })} style={{ marginBottom: 20, marginTop: 20 }}>
                                    <Text style={[styles.font_regu, { alignSelf: 'center', fontSize: 16, color: '#000' }]}>Bloquer le profil</Text>
                                </TouchableOpacity>
                            }
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
                                <TouchableOpacity onPress={() => this.setState({ profileblockDailog: false }) + this.blockUser()} style={{ width: '40%', height: 45, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
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
            </View>
        )
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
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 10,
        // borderWidth: 1,
        // borderColor: colors.textGrey,
        backgroundColor: 'grey',
        // justifyContent: 'center',
        //elevation: 5,
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