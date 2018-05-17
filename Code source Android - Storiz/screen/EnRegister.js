import React from 'react';
import {
    StyleSheet, Dimensions, StatusBar, ActivityIndicator, TouchableOpacity, SafeAreaView, View, Text, Image, Modal, FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../color/color'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import country_array from '../countryList/country_array'
import strings from '../strings/strings';
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default class EnRegister extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            messageList: []


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
                        this.getMyProductList(user_id, token)
                    })
            })
    }
    getMyProductList(user_id, token) {
        this.setState({
            isLoading: true
        })
        fetch(strings.base_Url + 'saveProductList', {
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
                console.log("data :::" + JSON.stringify(responseData))
                if (responseData.success === true) {
                    this.setState({
                        isLoading: false,
                        messageList: responseData.products
                    })
                } else {
                    this.setState({
                        isLoading: false
                    })
                    //alert(responseData.message)
                }
            }
            )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: colors.testColorWhite }}>
               
                <TouchableOpacity onPress={() => Actions.push("Profile")} style={{ alignSelf: 'flex-start', marginLeft: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/25.png')} />
                </TouchableOpacity>
                <ScrollView>
                    <View style={{ width: '100%' }}>
                        <Text style={[styles.font_regu, { alignSelf: 'center', fontWeight: 'bold', fontSize: 20, color: colors.textColorBlack, marginTop: 30 }]}>
                            {'Mes enregistrements'}
                        </Text>
                        {this.state.messageList.length == 0 ?
                            <Text style={[styles.font_regu, { fontSize: 18, color: "#000", padding: 20, alignSelf: 'center' }]}>{' Données de la liste non disponibles '}</Text>
                            :
                            <View style={{ width: '95%', marginTop: 20, alignSelf: 'center', backgroundColor: 'red' }}>
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.messageList}
                                    numColumns={2}
                                    style={{ backgroundColor: '#fff' }}
                                    renderItem={({ item, index }) =>
                                        <View style={{ width: width * 45 / 100, alignItems: 'center' }}>
                                            <View style={{ width: width * 40 / 100, alignItems: 'center', marginTop: 20 }}>
                                                <TouchableOpacity
                                                   onPress={() => Actions.push("Swapping", { videoUrl: item.videoslink[0], posterImage: strings.base_video + item.thumbnail, product_id: item._id, item_data:item,item_list_data:this.state.messageList,item_index:index})}
                                                    //onPress={() => Actions.push("WebVideoPlay", { videoUrl: item.videoslink[0], posterImage: strings.base_video + item.thumbnail, product_id: item._id, save: 'true' })}
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
                                                        <Text style={[styles.font_regu, { fontSize: 14, color: '#000', }]}>{item.name}</Text>
                                                        <Text style={[styles.font_regu, { fontWeight: 'bold', fontSize: 16, color: '#000', paddingTop: 5 }]}>{item.price + item.currency}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                    extraData={this.state} />
                            </View>
                        }
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
    input_view: {
        height: width * 50 / 100,
        width: '100%',
        borderRadius: 15,
        borderColor: colors.textGrey,
        backgroundColor: 'rgba(180.180,180,0.1)',
        elevation: 4,
    },
    // input_view: {
    //     borderRadius: 8,
    //     // backgroundColor: '#fff',
    //     // elevation: 5,
    //     margin: 10,
    // },
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