import React from 'react';
import {
    StyleSheet, Linking, Dimensions, Platform, ActivityIndicator, StatusBar, TouchableOpacity, SafeAreaView, View, Text, Image, Modal, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import strings from '../strings/strings';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';
const LeftSwipeActions = () => {
    return (
      <View
        style={{width:30,height:30}}
      >
        <Text
          style={{
            color: '#40394a',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          Bookmark
        </Text>
      </View>
    );
  };
 
export default class Contactus extends React.Component {
    constructor(props, context) {
        super(props);
        let screenWidth = Dimensions.get('window').width,
            screenHeight = Dimensions.get('window').height;

        this.state = {
            isLoading: false,
            email: '',
            number: '',
            time: 0
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
                        this.setting(token)
                    })
            })
    }
    setting(token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'setting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(" responseData show-user===" + JSON.stringify(responseData));
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        email: responseData.settings[0].contactUsEmail,
                        number: responseData.settings[0].admin_phone
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
    callNumber = () => {

        Linking.openURL(this.state.number);
        let phoneNumber = '';


        if (Platform.OS === 'android') {
            phoneNumber = 'tel:${' + this.state.number + '}';
        }
        else {
            phoneNumber = 'telprompt:${' + this.state.number + '}';
        }

        Linking.openURL(phoneNumber);
    }
    sendMail = () => {

        Linking.openURL('mailto:' + this.state.email);
    }

    inPress() {
        console.log("inPress")
        this.startTimer()
    }
   
    outPress() {
        console.log("outPress")
        this.stopTimer()
    }
    convertTimeString = (time) => {
        return moment().startOf('day').seconds(time).format('mm:ss');
    }
    startTimer = () => {
        this.timer = setInterval(() => {
            const time = this.state.time + 1;
            this.setState({ time });

        }, 1000);
    }

    stopTimer = () => {
        if (this.timer) clearInterval(this.timer);
    }
    SlidePane = (direction) => {
        let screenHeight = Dimensions.get('window').height,
            screenWidth = Dimensions.get('window').width,
            theTopMargin,
            theLeftMargin;
        if (direction === 'right') {
            theLeftMargin = parseInt('-' + screenWidth)
        }
        this.setState({
            MainPosition: [styles.main, { width: screenWidth * 2 }, { height: screenHeight }, { marginTop: 0 }, { marginLeft: theLeftMargin }]
        })
    }
    render() {
        const { time } = this.state;
        const  LeftSwipeAction = () => {
           // this.inPress();
        }
        return (

            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
               
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                </TouchableOpacity>
                <ScrollView style={{ width: '100%' }}>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 25, color: colors.textColorBlack }]}>
                            {'Nous contacter'}
                        </Text>

                        {/* <TouchableOpacity onPress={() => this.callNumber()} style={{ marginTop: 60, flexDirection: 'row', alignItems: 'center', width: '85%', height: 45, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 50 }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: 20, tintColor: '#000' }} source={require('../assets/call.png')} />
                            <Text style={[styles.font_regu, { fontSize: 18, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {this.state.number}
                            </Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => this.sendMail()} style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center', width: '85%', height: 45, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 50 }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: 20 }} source={require('../assets/8.png')} />
                            <Text style={[styles.font_regu, { fontSize: 18, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {this.state.email}
                            </Text>
                        </TouchableOpacity>
                        {/* <View>
                            <Text style={styles.dotText}>● {this.convertTimeString(time)} </Text>
                        </View> */}
                        {/* <Swipeable
                            renderLeftActions={LeftSwipeActions}
                            // renderRightActions={rightSwipeActions}
                            // onSwipeableRightOpen={swipeFromRightOpen}
                            // onSwipeableLeftOpen={swipeFromLeftOpen}
                        >
                            <TouchableOpacity onPressIn={() => this.inPress()} onPressOut={() => this.outPress()} style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center', width: '85%', height: 45, backgroundColor: 'rgba(180,180,180,0.1)', borderRadius: 50 }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: 20 }} source={require('../assets/8.png')} />
                            <Text style={[styles.font_regu, { fontSize: 18, color: colors.textColorBlack, marginLeft: 20 }]}>
                                {this.state.email}
                            </Text>
                        </TouchableOpacity> 
                        </Swipeable> */}
                      

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
        fontWeight:'800'
    },
    font_regu: {
       fontWeight:'800'
    },
    font_bold: {
        fontFamily: 'CamSemiItalic'
    },
    input_view: {
        borderRadius: 8,
        backgroundColor: '#fff',
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
    modal_view: {
        flex: 1,
        width: "100%",
        backgroundColor: 'rgba(52, 52, 52, 0.9)',
        alignItems: 'center',
        justifyContent: "center"
    },

});