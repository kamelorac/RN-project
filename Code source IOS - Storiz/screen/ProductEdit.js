import React from 'react';
import {
    StyleSheet, StatusBar, ActivityIndicator, FlatList, TextInput, ImageBackground, Dimensions, TouchableOpacity, SafeAreaView, View, Text, Image, KeyboardAvoidingView
} from 'react-native';
import colors from '../color/color'
import Video from 'react-native-video';
import { Actions } from 'react-native-router-flux';
import strings from '../strings/strings';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNGooglePlaces from 'react-native-google-places';
var posterImage = '';
var vidoeUrl = '';
const html = `<script 

 src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
import { WebView } from 'react-native-webview';
export default class ProductEdit extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isLoading: false,
            paused: false,
            //playerState: PLAYER_STATES.PLAYING,
            playvideo: false,
            videoUrl: 'https://cfcdn.streamlike.com/c/1695d77efaa21d05/medias/42aefccd81460d6d/files/mp4/42aefccd81460d6d_1920_1080_4312_192_high.mp4',
            imagePath: '',
            conditionList: [{ name: 'Etat neuf' }, { name: 'Très bon état' }, { name: 'Bon état' }, { name: 'Etat moyen' }],
            selectcondition_Name: '',
            selectcondition: null,
            conditionView: false,
            priceView: false,
            condition: '',
            sellingprice: '',
            titleView: false,
            titel: '',
            titelErr: '',
            currency: '',
            user_image: '',
            country: '',
            address: '',
            city: '',
            lat: null,
            long: null,
            vidoeLodating:false,

        };
    }
    componentDidMount() {
        console.log("videoUrl %%%%  " + this.props.route.params.videoUrl)
        console.log("posterImage %%%%  " + this.props.route.params.posterImage)
        vidoeUrl = this.props.route.params.videoUrl.replace('/uploads/product_videos/', '');
        console.log("product_id  %%%%  " + this.props.route.params.product_id)
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });
                        console.log("state token============" + token);
                        this.viewProduct(this.props.route.params.product_id, token)
                    })
            })
        // "Image passs ": "file:///data/user/0/com.storiz.app/cache/thumbnails/thumb-75d8d481-5bda-4602-8492-4ccf4277750b"

    }
    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log("place :: location:::" + JSON.stringify(place))
                for (let index = 0; index < place.addressComponents.length; index++) {
                    if (place.addressComponents[index].types[0] == "locality") {
                        this.setState({ city: place.addressComponents[index].name })
                    } else {

                    }

                }
                this.setState({
                    address: place.address,
                    // city: place.addressComponents[1].shortName,
                    lat: place.location.latitude,
                    long: place.location.longitude,
                })
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    viewProduct(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'viewProduct', {
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

                if (responseData.success === true) {
                    console.log(" responseDatagetMyProductList= newArr ==" + JSON.stringify(responseData))
                    var profiles = ''
                    if (responseData.user.profile_image == "false") {
                        profiles = require('../assets/4.png')
                    } else {
                        profiles = { uri: strings.base_image + responseData.user.profile_image }
                    }
                    this.setState({
                        isLoading: false,
                        user_name: responseData.user.username,
                        user_image: profiles,
                        sellingprice: JSON.stringify(responseData.product.price),
                        currency: responseData.product.currency,
                        condition: responseData.product.condition,
                        //address: responseData.product.address,
                        date: moment(responseData.product.createdAt).format("DD MMM YYYY"),
                        titel: responseData.product.name,
                        country: responseData.product.country,
                        address: responseData.product.address,
                        city: responseData.product.city,
                        lat: responseData.product.location.coordinates[0],
                        long: responseData.product.location.coordinates[1],
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    deleteProduct() {
        this.setState({
            isLoading: true,
            paused:true,
        })
        fetch(strings.base_Url + 'deleteProduct', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({ "id": this.props.route.params.product_id })
        })
            .then((response) => response.json())
            .then((responseData) => {

                if (responseData.success === true) {
                    console.log(" responseDatagetMyProductList= newArr ==" + JSON.stringify(responseData))
                    this.setState({
                        isLoading: false,
                    })
                    alert(responseData.message)
                    this.props.navigation.navigate("Profile")
                } else {
                    this.setState({
                        isLoading: false
                    })
                    //alert(responseData)
                }
            }
            ).catch((err) => {
                console.log("response::::err:::" + err);
                this.setState({
                    isLoading: false
                });
            });
    }
    validation() {
        var isValidation = 0;
        if (this.state.titel == '') {
            alert('Ne devrait pas être vide')
        } else if (this.state.sellingprice == '') {
            alert('Ne devrait pas être vide')
        } else {
            console.log("Data :: " + JSON.stringify({
                "id": this.props.route.params.product_id,
                'name': this.state.titel,
                'type': "Mobile",
                'condition': this.state.condition,
                'price': this.state.sellingprice,
                "country": this.state.country,
                "city": this.state.city,
                "address": this.state.address,
                "long": this.state.lat,
                "lat": this.state.long
            }))
            this.editProduct();
        }
    }
    editProduct = () => {
        this.setState({
            isLoading: true,
            paused:true,
        })
        fetch(strings.base_Url + 'editProduct', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.token
            },
            body: JSON.stringify({
                "id": this.props.route.params.product_id,
                'name': this.state.titel,
                'type': "Mobile",
                'condition': this.state.condition,
                'price': this.state.sellingprice,
                "country": this.state.country,
                "city": this.state.city,
                "address": this.state.address,
                "long": this.state.lat,
                "lat": this.state.long
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData userupdate ===" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false
                    })
                    alert(responseData.message)
                    this.props.navigation.navigate("Profile")
                } else {
                    alert(responseData.message)
                    this.setState({
                        isLoading: false
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
    // editProduct = () => {
    //     console.log("Image URL@@@###%% " + this.props.videoUrl)
    //     this.setState({
    //         isLoading: true
    //     })
    //     let headers = {
    //         'Accept': 'application/json',
    //         'Content-Type': 'multipart/form-data',
    //         'x-access-token': this.state.token
    //     };
    //     RNFetchBlob.fetch('POST', strings.base_Url + "editProduct", headers, [
    //         { name: 'id', data: this.props.product_id },
    //         { name: 'name', data: this.state.titel },
    //         { name: 'type', data: "Mobile" },
    //         { name: 'condition', data: this.state.condition },
    //         { name: 'price', data: this.state.sellingprice },
    //         { name: 'country', data: this.state.country },
    //         { name: 'city', data: this.state.city },
    //         { name: 'address', data: this.state.address },
    //         { name: 'long', data: JSON.stringify(this.state.lat) },
    //         { name: 'lat', data: JSON.stringify(this.state.long) }
    //     ],
    //     )
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             console.log(" responseData userupdate ===" + JSON.stringify(responseData));
    //             if (responseData.success === true) {
    //                 this.setState({
    //                     isLoading: false
    //                 })
    //                 alert(responseData.message)
    //                 this.props.navigation.navigate("EnRegister")
    //             } else {
    //                 alert(responseData.message)
    //                 this.setState({
    //                     isLoading: false
    //                 })
    //             }
    //         }
    //         )
    //         .catch((err) => {
    //             console.log("response::::err:::" + err);
    //             this.setState({
    //                 isLoading: false
    //             });
    //         });

    // }
    onSeek = seek => {
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState
        });
    };

    onReplay = () => {
        //  this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    // onProgress = data => {
    //     const { isLoading, playerState } = this.state;
    //     // Video Player will continue progress even if the video already ended
    //     if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
    //         this.setState({ currentTime: data.currentTime });
    //     }
    // };

    onLoad = data => {
        console.log("data " + JSON.stringify(data))
        this.setState({ duration: data.duration, isLoading: false })
    }


    onLoadStart = data => this.setState({ isLoading: true });

    // onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });

    onError = () => alert("Oh! ", error);

    exitFullScreen = () => { };

    enterFullScreen = () => { };

    onFullScreen = () => { };
    useFileDownload(uri) {
        console.log("uri &&& " + uri)

        const { path } = this.state;
        RNFetchBlob.config({
            fileCache: true,
            appendExt: 'mp4',
        })
            .fetch('GET', uri)
            .then(res => {
                this.setState({ path: res.path() });
            });
        if (path) {
            return path;
        }
    }
    handleMessage(event) {
        console.log("handleMessage", event)
        console.log("UrlhandleMessageevent ::" + event.url)
    }
    handleNavigation(event) {
        console.log("handleNavigation ", event)
        console.log("Url::: handleNavigation:" + event.loading)
        this.setState({ vidoeLodating: event.loading })
    }
    render() {
        // var newUrl = this.useFileDownload(strings.base_video + this.props.videoUrl)
        // console.log("newUrl &&& " + newUrl)
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: "#000" }}>
                <ImageBackground style={{ width: width, height:height }}
                    source={{ uri: this.props.route.params.posterImage }}>
                    {/* {newUrl == undefined ? null : null} */}
                    {/* <WebView
                        style={{ marginLeft: -10, marginTop: -10, bottom: 0, width: 500, height: 600, backgroundColor: "transparent" }}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        onMessage={(event) => this.handleMessage(event)}
                        onNavigationStateChange={(event) => this.handleNavigation(event)}
                        javaScriptEnabled={true}
                        source={{
                            baseUrl: RNFetchBlob.fs.dirs.DocumentDir, html,
                            html: `<html>
                            <body>
                               <video
                               width: ${width}
                               height: ${height}    autoplay   >
                               <source src="${strings.base_video + '/playVideo?filename=' + vidoeUrl}" type="video/mp4"
                                          Your browser does not support the video 
                                </video>
                             </body>
                          </html>`
                        }}
                    >
                    </WebView> */}
                    <Video source={{ uri: strings.base_video + '/playVideo?filename=' + vidoeUrl }}   // Can be a URL or a local file.
                        ref={(ref) => { this.player = ref }}
                        playInBackground={true}
                        minLoadRetryCount={5}  
                        repeat={true}  
                        paused ={this.state.paused}
                        resizeMode='cover'                                 // Store reference
                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onError={this.videoError}
                        fullscreen={true}
                        onLoad={()=>this.setState({vidoeLodating:false})}
                        onLoadStart={()=>this.setState({vidoeLodating:true})}               // Callback when video cannot be loaded
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0, 
                        }}
                         />
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent", bottom: 0, alignSelf:'center'}}>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()+this.setState({paused:true})} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff' }} source={require('../assets/25.png')} />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'space-between', flex: 1,alignItems:'center' }}>
                            <View>
                                <View style={{ alignSelf: 'center',width:'90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                                    <View style={{width:'50%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                        <Image style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 50 }} source={this.state.user_image} />
                                        <View>
                                            <Text style={[styles.font_regu, { fontSize: 17, color: '#fff', paddingLeft: 5, }]}> {this.state.user_name} </Text>
                                            <Text style={[styles.font_regu, { fontSize: 14, color: colors.textGrey, paddingLeft: 5, }]}>Le {this.state.date} </Text>

                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end',width:'50%'  }}>
                                        <View style={{  height: 40, alignItems: 'center', justifyContent: 'center', paddingLeft: 10, borderRadius: 50, backgroundColor: 'rgba(255,255,255,1)' }}>
                                            <TextInput
                                                placeholder='Titre de ta storiz '
                                                placeholderTextColor={'#000'}
                                                value={this.state.titel}
                                                onChangeText={(titel) => this.setState({ titel })}
                                                style={[styles.font_regu, { fontSize: 16, color: colors.textColorBlack, }]}></TextInput>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <KeyboardAvoidingView behavior='padding'>
                            <View>
                                {this.state.conditionView === false ?
                                    <View style={{ alignSelf: 'center', width: '90%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60 }}>
                                        <View style={{ justifyContent: 'center', width: '80%', padding: 10 }}>
                                            <TouchableOpacity onPress={() => this.validation()} style={{ height: 45, marginTop: 20, backgroundColor: colors.themeColor, justifyContent: 'center', borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 14, color: '#fff', }]}> {"Sauvegarder les modifications"} </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.openSearchModal()} style={{ width: 150, marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', height: 45, borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {this.state.city} </Text>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, width: 150, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, alignItems: 'center' }}>
                                                <TextInput
                                                    // placeholder='Prix de vente'
                                                    placeholderTextColor={'#fff'}
                                                    value={this.state.sellingprice}
                                                    keyboardType="number-pad"
                                                    onChangeText={(sellingprice) => this.setState({ sellingprice })}
                                                    style={[styles.font_regu, { fontSize: 16, color: colors.testColorWhite, alignSelf: 'center' }]}>
                                                </TextInput>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: colors.testColorWhite, alignSelf: 'center',padding:10 }]}>{this.state.currency}</Text>
                                            </View>

                                            <TouchableOpacity onPress={() => this.setState({ conditionView: true })} style={{ width: 150, marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', height: 45, borderRadius: 50, alignItems: 'center' }}>
                                                <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {this.state.condition} </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '20%', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.setState({ titleView: true })} style={{ width: 60, height: 45, borderRadius: 50, backgroundColor: colors.testColorWhite, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', }} source={require('../assets/3.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View> :
                                    <View style={{ width: '100%', flexDirection: 'row', marginBottom: 60, alignItems: 'flex-end' }}>
                                        <View style={{ width: '70%' }}>
                                            <FlatList
                                                keyExtractor={this.keyExtractor}
                                                data={this.state.conditionList}
                                                //numColumns={10}
                                                //style={{ backgroundColor: '#fff' }}
                                                renderItem={({ item, index }) =>
                                                    <TouchableOpacity onPress={() => this.setState({ selectcondition: index, selectcondition_Name: item.name, condition: item.name })}>
                                                        <View style={{ width: '100%', marginTop: 15, marginLeft: 20 }}>
                                                            {index == 0 && (
                                                                <View>
                                                                    {this.state.selectcondition == 0 ?
                                                                        <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View> :
                                                                        <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            )
                                                            }
                                                            {index == 1 && (
                                                                <View>
                                                                    {this.state.selectcondition == 1 ?
                                                                        <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View> :
                                                                        <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            )
                                                            }
                                                            {index == 2 && (
                                                                <View>
                                                                    {this.state.selectcondition == 2 ?
                                                                        <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View> :
                                                                        <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            )
                                                            }
                                                            {index == 3 && (
                                                                <View>
                                                                    {this.state.selectcondition == 3 ?
                                                                        <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View> :
                                                                        <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50, alignItems: 'center' }}>
                                                                            <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                        </View>
                                                                    }
                                                                </View>
                                                            )
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                                extraData={this.state} />
                                        </View>
                                        <View style={{ width: '30%', alignItems: 'center' }}>
                                            {this.state.selectcondition == null ?
                                                <View style={{ width: 60, height: 45, borderRadius: 50, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/23.png')} />
                                                </View> :
                                                <TouchableOpacity onPress={() => this.setState({ conditionView: false })} style={{ width: 60, height: 45, borderRadius: 50, backgroundColor: colors.themeColor, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/23.png')} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </ImageBackground>
                {this.state.titleView === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <View style={[styles.lodaing_view, { width: '90%', alignItems: 'center' }]}>
                            <Text style={[styles.font_regu, { fontSize: 16, fontWeight: 'bold', color: '#000', padding: 10, marginTop: 30 }]}>{'Tu es sur de vouloir supprimer ta Storiz?'} </Text>
                            <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ titleView: false }) + this.deleteProduct()} style={{ width: '49%', height: 45, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginTop: 25, marginBottom: 25 }}>
                                    <Text style={[styles.font_regu, { fontSize: 14, color: '#fff' }]}>Supprimer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ titleView: false })} style={{ width: '49%', height: 45, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginTop: 25, marginBottom: 25 }}>
                                    <Text style={[styles.font_regu, { fontSize: 14, color: '#fff' }]}>Annuler</Text>
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
                 {this.state.vidoeLodating === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent" }}>
                            <ActivityIndicator size="large" color={colors.themeColor} />
                    </View>
                )
                }
            </SafeAreaView >


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
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.textGrey,
        justifyContent: 'center'
    },
    lodaing_view: {
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 20, marginBottom: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center'
    },

});

{/* <CameraScreen
                    // Barcode props
                    scanBarcode={false}
                    onReadCode={(event) => Alert.alert('QR code found')} // optional
                    showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
                    laserColor='red' // (default red) optional, color of laser in scanner frame
                    frameColor='white' // (default white) optional, color of border of scanner frame
                /> */}