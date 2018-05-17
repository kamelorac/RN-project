
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import React, { Component } from 'react';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'react-native-best-viewpager';
import Message from './Message';
import Store from './Store';
//import RecordingCamera from '../screen/RecordingVideo/RecordingCamera'
import RecordingCamera from '../screen/ZoomVideoCamera'
import colors from '../color/color'
import { Actions } from 'react-native-router-flux';
var pagenum = 0
export default class HomeViewPager extends Component {
    state = {
        pagenum: 0
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <IndicatorViewPager
                    style={{ flex: 1, paddingTop: 0, backgroundColor: colors.themeColor }}
                    indicator={this._renderTabIndicator()}
                    onPageSelected={this.onPageSelected.bind(this)}
                    onPageScrollStateChanged={this.onPageScrollStateChanged}
                    ref={viewPager => { this.viewPager = viewPager; }}>
                   
                    <View onPress={this.onPageSelected.bind(this, this.pagenum)} style={{ backgroundColor: 'cadetblue' }}>
                        <Message onPress={this.onPageSelected.bind(this, this.pagenum)} />
                    </View>
                    <View onPress={this.onPageSelected.bind(this, this.pagenum)} style={{ backgroundColor: 'cornflowerblue' }}>
                        <Store onPress={this.onPageSelected.bind(this, this.pagenum)} />
                    </View>
                    <View style={{ backgroundColor: '#000' }}>
                        <RecordingCamera onPress={this.onPageSelected.bind(this, this.pagenum)} />
                    </View>
                </IndicatorViewPager>
            </View>
        );
    }
    onPageSelected(e) {
        if (e.position == 2) {
           this.props.navigation.navigate("RecordingCamera")
        }
    }
    _renderTabIndicator() {
        let tabs = [
            
            {
                iconSource: require('../assets/018.png'),
                selectedIconSource: require('../assets/18.png')
            },
            {
                iconSource: require('../assets/021.png'),
                selectedIconSource: require('../assets/21.png')
            },
           
             {
                iconSource: require('../assets/22.png'),
                selectedIconSource: require('../assets/22.png')
            },
        ];
        return <PagerTabIndicator style={{ backgroundColor: colors.themeColor, alignItems: 'center', height: 70, width: '70%', alignSelf: 'center' }} iconStyle={{ marginTop: 20, width: 22, height: 22, tintColor: 'rgba(255,255,255,0.5)' }} selectedIconStyle={{ width: 22, height: 22, marginTop: 20 }} tabs={tabs} />;
    }

}