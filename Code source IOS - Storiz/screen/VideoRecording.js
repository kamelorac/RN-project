import React from 'react';
import {Platform,
    StyleSheet, StatusBar, ActivityIndicator, FlatList, TextInput, ImageBackground, Dimensions, TouchableOpacity, SafeAreaView, View, Text, Image, KeyboardAvoidingView, ScrollView
} from 'react-native';
import colors from '../color/color'
const videoRecorder = null
const width = Dimensions.get('window').width;
const height = Dimensions.get("window").height;
import Videos from 'react-native-video';
import { createThumbnail } from "react-native-create-thumbnail";
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import strings from '../strings/strings';
import RNFetchBlob from 'rn-fetch-blob';
import RNGooglePlaces from 'react-native-google-places';
import { WebView } from 'react-native-webview';
import { Video, getVideoMetaData } from 'react-native-compressor';
const html = `<script src="${RNFetchBlob.fs.dirs.MainBundleDir}/bundle.js"></script> `;
var data_url = ''
export default class VideoRecording extends React.Component {
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
            selectcondition: null,
            selectcondition_Name: '',
            priceView: false,
            sellingprice: '',
            titleView: false,
            titel: '',
            titelErr: '',
            token: '',
            user_id: '',
            country: '',
            address: '',
            city: '',
            lat: null,
            long: null,
        };
    }

    componentDidMount() {
        //this.setState({isLoading: true})
        this.cpmpress()
        AsyncStorage.getItem("user_id")
            .then(user_id => {
                this.setState({ user_id: user_id });
                console.log("state userId============" + user_id);
                AsyncStorage.getItem("token")
                    .then(token => {
                        //var tokens = JSON.parse(token)
                        this.setState({ token: token });

                        this.getprofile(user_id, token)
                    })
            })
        createThumbnail({
            url: this.props.route.params.videoUrl,
            timeStamp: 1000,
        })
            .then(response => {
                console.log({
                    "Image passs ": response.path
                })
                this.setState({ imagePath: response.path })
            }
            )
            .catch(err => console.log({ err }));

    }

    async cpmpress() {
        console.log("result this.props.route.params.videoUrl  metaData :$$%%%%%:::" + this.props.route.params.videoUrl)
        const metaData = await getVideoMetaData(this.props.route.params.videoUrl);
        console.log("result metaData url :$$%%%%%:::" + JSON.stringify(metaData))
        const result = await Video.compress(
            this.props.route.params.videoUrl,
            {
                compressionMethod: 'auto',
            },
            (progress) => {
                console.log('Compression Progress: ', progress);
                //  backgroundUpload(progress);
                //   if (backgroundMode) {
                //     console.log('Compression Progress: ', progress);
                //   } else {
                //     setCompressingProgress(progress);
                //   }
            }
        );
        console.log("result  1:$$%%%%%:::" + result)
        data_url = Platform.OS === 'ios' ? result.replace('file://', '') : result; 

        if (data_url == '') {
            this.setState({ isLoading: true })
        } else {
            this.setState({ isLoading: false })
        }
        // const metaData3 = await getVideoMetaData(result);

        console.log("result 2 data_url :$$%%%%%:::" + data_url)
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
    start = () => {
        // 30 seconds
        this.videoRecorder.open({ maxLength: 30 }, (data) => {
            console.log('captured data', data);
            this.setState({ videoUrl: data.uri })
        });
        console.log('captured data', 'null');
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
                        //isLoading: false,
                        country: responseData.user.country,
                        address: responseData.user.address,
                        city: responseData.user.city,
                        lat: responseData.user.location.coordinates[0],
                        long: responseData.user.location.coordinates[1],
                    })
                } else {
                    this.setState({
                        //  isLoading: false
                    })
                    alert(responseData.message)
                }
            }
            )
    }
    validation() {
        var isValidation = 0;
        if (this.state.titel != '') {
            isValidation += 1;
        } else {
            isValidation -= 1;
            this.setState({
                titelErr: 'Ne devrait pas être vide'
            })
        }
        console.log("isValidation   " + isValidation)
        if (isValidation == 1) {

            console.log("Data :: " + JSON.stringify(
                [
                    { name: 'id', data: this.state.user_id },
                    { name: 'name', data: this.state.titel },
                    { name: 'type', data: "Mobile" },
                    { name: 'condition', data: this.state.selectcondition_Name },
                    { name: 'price', data: this.state.sellingprice },
                    { name: 'product', filename: 'name.mp4', type: 'video/mp4', data: RNFetchBlob.wrap(data_url) },
                    { name: 'country', data: this.state.country },
                    { name: 'city', data: this.state.city },
                    { name: 'address', data: this.state.address },
                    { name: 'long', data: JSON.stringify(this.state.lat) },
                    { name: 'lat', data: JSON.stringify(this.state.long) },
                    { name: 'thumbnail', filename: 'photo.jpg', type: 'image/png', data: RNFetchBlob.wrap(this.state.imagePath) }

                ]
            ))
            this.uploadProduct();

        }
    }
    uploadProduct = () => {
        console.log("Image URL@@@###%% " + this.props.route.params.videoUrl)
        this.setState({
            isLoading: true,
            paused:true,
        })
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.state.token
        };
        RNFetchBlob.fetch('POST', strings.base_Url + "uploadProduct", headers, [
            { name: 'id', data: this.state.user_id },
            { name: 'name', data: this.state.titel },
            { name: 'type', data: "Mobile" },
            { name: 'condition', data: this.state.selectcondition_Name },
            { name: 'price', data: this.state.sellingprice },
            { name: 'product', filename: 'name.mp4', type: 'video/mp4', data: RNFetchBlob.wrap(data_url) },
            { name: 'country', data: this.state.country },
            { name: 'city', data: this.state.city },
            { name: 'address', data: this.state.address },
            { name: 'long', data: JSON.stringify(this.state.lat) },
            { name: 'lat', data: JSON.stringify(this.state.long) },
            { name: 'thumbnail', filename: 'photo.jpg', type: 'image/png', data: RNFetchBlob.wrap(this.state.imagePath) }
        ],
        )
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData userupdate ===" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        paused:true,
                    })
                    alert(responseData.message)
                    this.props.navigation.navigate("Tabs",{screen:'Store'})
                    //  this.props.navigation.navigate("HomeViewPager")
                } else {
                    alert(responseData.message)
                    this.setState({
                        isLoading: false,
                        paused:true,
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
        console.log("this.props.route.params.videoUrl  " + this.props.route.params.videoUrl)
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
                <ImageBackground style={{ width: '100%', height: '100%', }}
                    source={{ uri: this.state.imagePath }}>
                    {/* //source={{ uri: 'file:///sdcard/Movies/sintel.mp4' }} */}
                    <Videos source={{ uri: data_url == '' ? '' : this.props.route.params.videoUrl }}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}
                        //  maxBitRate={2000000}
                        // fullscreenOrientation='all'
                        playInBackground={true}
                        paused={this.state.paused}
                        minLoadRetryCount={5}
                        repeat={true}
                        resizeMode='cover'                                 // Store reference
                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onError={this.videoError}
                        fullscreen={true}             // Callback when video cannot be loaded
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                    />
                    {/* <WebView
                        style={{ marginLeft: -10, marginTop: -10, bottom: 0, width: 500, height: 600, backgroundColor: "transparent" }}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        //onMessage={(event) => this.handleMessage(event)}
                       // onNavigationStateChange={(event) => this.handleNavigation(event)}
                        javaScriptEnabled={true}

                        source={{
                            baseUrl: RNFetchBlob.fs.dirs.DocumentDir, html,
                            html: `<html>
                            <body>
                               <video 
                               width: ${width}
                               height: ${height}    autoplay loop  >
                               <source src="${this.props.route.params.videoUrl}" type="video/mp4"
                                          Your browser does not support the video 
                                </video>
                             </body>
                          </html>`
                        }}
                    >

                    </WebView> */}
                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() =>
                                 this.props.navigation.navigate("Tabs",{screen:'Store'})+
                                this.setState({
                                    paused:true
                                })
                                // this.props.navigation.navigate("HomeViewPager")
                            } style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                                <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../assets/15.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.openSearchModal()} style={{ height: 40, justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 50, marginRight: 20, backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                <Text style={[styles.font_regu, { fontSize: 18, color: colors.testColorWhite, }]}>{this.state.city}</Text>
                            </TouchableOpacity>
                        </View>
                        <KeyboardAvoidingView behavior='padding'>
                        <View>
                            {this.state.priceView === false ?
                                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' }}>
                                    <View style={{ width: '70%' }}>
                                        <FlatList
                                            keyExtractor={this.keyExtractor}
                                            data={this.state.conditionList}
                                            //numColumns={10}
                                            //style={{ backgroundColor: '#fff' }}
                                            renderItem={({ item, index }) =>
                                                <TouchableOpacity onPress={() => this.setState({ selectcondition: index, selectcondition_Name: item.name })}>
                                                    <View style={{ width: '100%', marginTop: 15, marginLeft: 20 }}>
                                                        {index == 0 && (
                                                            <View>
                                                                {this.state.selectcondition == 0 ?
                                                                    <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View> :
                                                                    <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 50, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View>
                                                                }
                                                            </View>
                                                        )
                                                        }
                                                        {index == 1 && (
                                                            <View>
                                                                {this.state.selectcondition == 1 ?
                                                                    <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View> :
                                                                    <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 50, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View>
                                                                }
                                                            </View>
                                                        )
                                                        }
                                                        {index == 2 && (
                                                            <View>
                                                                {this.state.selectcondition == 2 ?
                                                                    <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 50, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View> :
                                                                    <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 50, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View>
                                                                }
                                                            </View>
                                                        )
                                                        }
                                                        {index == 3 && (
                                                            <View>
                                                                {this.state.selectcondition == 3 ?
                                                                    <View style={{ width: 150, backgroundColor: colors.themeColor, padding: 10, borderRadius: 100, }}>
                                                                        <Text style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 5, }]}> {item.name} </Text>
                                                                    </View> :
                                                                    <View style={{ width: 150, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 100, }}>
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
                                            <View style={{ width: 60, height: 40, borderRadius: 50, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/23.png')} />
                                            </View> :
                                            <TouchableOpacity onPress={() => this.setState({ priceView: true })} style={{ width: 60, height: 40, borderRadius: 50, backgroundColor: colors.themeColor, alignItems: 'center', justifyContent: 'center' }}>
                                                <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/23.png')} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View> :
                               
                                
                                        <View style={{ alignSelf: 'center', width: '90%', bottom: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                            <View style={{ justifyContent: 'center', height: 40, width: '50%', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, }}>
                                                <TextInput
                                                    placeholder='Prix de vente'
                                                    placeholderTextColor={'#fff'}
                                                    keyboardType='number-pad'
                                                    onChangeText={(sellingprice) => this.setState({ sellingprice })}
                                                    style={[styles.font_regu, { fontSize: 16, color: '#fff', paddingLeft: 15, }]}>

                                                </TextInput>
                                            </View>
                                            {this.state.sellingprice == '' ?
                                                <View style={{ width: 60, height: 45, borderRadius: 50, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/23.png')} />
                                                </View> :
                                                <TouchableOpacity onPress={() => this.setState({ titleView: true })} style={{ width: 60, height: 45, borderRadius: 50, backgroundColor: colors.themeColor, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/23.png')} />
                                                </TouchableOpacity>
                                            }

                                        </View>
                                    
                               
                            }
                        </View>
                        </KeyboardAvoidingView>
                    </View>
                </ImageBackground>
                {this.state.titleView === true && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: '100%', backgroundColor: "transparent",marginTop:40 }}>
                        <View style={[{ backgroundColor: '#fff', width: '100%', height: '100%', alignItems: 'center' }]}>
                            <TouchableOpacity onPress={() => this.setState({ titleView: false })} style={{ marginTop: 15, marginLeft: 15, width: 50, height: 50, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 5 }} source={require('../assets/25.png')} />
                            </TouchableOpacity>
                            <Text style={[styles.font_regu, { fontSize: 18, fontWeight: 'bold', color: '#000', padding: 0, marginTop: 0 }]}> {'Ajoute un titre'} </Text>
                            <View style={{ width: '85%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50 }}>
                                <View style={[styles.input_view, { width: '68%' }]}>
                                    <TextInput style={[ { fontSize: 16, color: colors.textColorBlack }]}
                                        //keyboardType='titel-address'
                                        onChangeText={(titel) => { this.setState({ titel, titelErr: '' }) }}
                                        placeholder={'Titre de ta storiz'}
                                        placeholderTextColor="grey"
                                        >
                                    </TextInput>
                                </View>
                                <TouchableOpacity onPress={() => this.validation()} style={{ width: '30%', height: 45, backgroundColor: colors.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 50, }}>
                                    <Text style={[styles.font_regu, { fontSize: 18, color: '#fff' }]}>Valider</Text>
                                </TouchableOpacity>
                            </View>

                            {!!this.state.titelErr && (
                                <Text style={[styles.font_regu, { width: '80%', fontSize: 14, color: '#F15D26', marginTop: 10 }]}>{this.state.titelErr}</Text>
                            )}


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
        fontWeight: '800'
    },
    font_regu: {
        fontWeight: '800'
    },
    font_bold: {
        fontFamily: 'CamSemiItalic'
    },
    input_view: {
        height: 45,
        borderRadius: 50,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(180,180,180,0.1)',
        borderColor: colors.textGrey,
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,

    },
    lodaing_view: {
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 8, marginBottom: 5,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center', alignItems: 'center'
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