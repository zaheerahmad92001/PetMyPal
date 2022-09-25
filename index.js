import React, { Component, createRef, useEffect, useState } from 'react';
import { AppRegistry, StatusBar, View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import 'react-native-get-random-values';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import RaygunClient from 'raygun4reactnative';
import { store, persistor } from './src/lib/createStore';
import CreateAppNavigator from './src/views/screens';
import NavigationService from './src/presentation/ControlPanel/NavigationService.js'
import { PersistGate } from 'redux-persist/integration/react'
import NetInfo from "@react-native-community/netinfo";
import { popUpImg } from './src/constants/ConstantValues'
import { black, darkSky, grey, White } from './src/constants/colors';
import { labelFont, mediumText } from './src/constants/fontSize';
import {useScreens} from 'react-native-screens';
// TODO: Remove condition after react-navigation this issue is fixed
if (Platform.OS === 'ios') {
  useScreens();
}

export const drawer = createRef();
import ErrorBoundary from 'react-native-error-boundary'

const CustomFallback = (props) => (
    <View style={styles.modalStyling}>

        <View style={styles.imgContainer}>
            <View style={styles.imgStyle}>
                <Image
                    source={popUpImg}
                    style={styles.avatarStyle}
                />
            </View>

        </View>

        <View style={styles.contentStyling}>

            <Text style={styles.iconStyle}>{props.error.toString()}</Text>

        </View>
        <TouchableOpacity
            style={styles.btnView}
            onPress={props.resetError}
        >
            <View style={styles.btnWithIcon}>
                <Text style={styles.okBtnStyle}>Try again</Text>
            </View>
        </TouchableOpacity>
    </View>

)

class ConnectedApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            raygunConnection: true
        }
        this.netinfoUnsubscribe = false;
    }
    componentDidMount() {
        this.InternetTest();

    }

    InternetTest = () => {
        this.netinfoUnsubscribe = NetInfo.addEventListener(state => {

            if (state.isConnected && !this.state.isConnected) {
                this.setState({ raygunConnection: true, isConnected: true })
                const options = {
                    apiKey: 'XO6dpOU5VO0x4URatSjKQ',
                    version: '2.0.0',
                    enableCrashReporting: true,
                    disableNativeCrashReporting: false,
                    disableUnhandledPromiseRejectionReporting: false,
                    enableRealUserMonitoring: true,
                    disableNetworkMonitoring: true,
                }
                const res = RaygunClient.init(options);

                console.log('Raygun connection', res)

            }

            else if (this.state.raygunConnection && this.state.isConnected && !state.isConnected) {
                this.setState({ raygunConnection: false, isConnected: false })
            }

        })
    }
    componentWillUnmount() {
        if (this.netinfoUnsubscribe) {
            this.netinfoUnsubscribe = false;
        }

    }
    render() {
        if (this.state.isConnected) {


            return (
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor} >
                        <ErrorBoundary FallbackComponent={CustomFallback}>
                            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
                            {/* <SignupView /> */}
                            <CreateAppNavigator
                                ref={navigatorRef => {
                                    NavigationService.setTopLevelNavigator(navigatorRef);
                                }}
                            />
                        </ErrorBoundary>
                    </PersistGate>
                </Provider>
            )
        } else {
            return (
                <View style={styles.modalStyling}>

                    <View style={styles.imgContainer}>
                        <View style={styles.imgStyle}>
                            <Image
                                source={popUpImg}
                                style={styles.avatarStyle}
                            />
                        </View>

                    </View>

                    <View style={styles.contentStyling}>

                        <Text style={styles.iconStyle}>No Internet</Text>

                    </View>
                    <TouchableOpacity
                        style={styles.btnView}
                        onPress={this.InternetTest()}
                    >
                        <View style={styles.btnWithIcon}>
                            <Text style={styles.okBtnStyle}>Try again</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}
console.disableYellowBox = true;



AppRegistry.registerComponent(appName, () => ConnectedApp);

const imgMarginBottom = 45
const imgHeight = 90
const imgWidth = 90
const topMargin = 15
const horizontalPadding = 25

const styles = StyleSheet.create({
    modalStyling: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: White,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginHorizontal: 25,
    },

    contentStyling: {
        marginTop: -imgMarginBottom,
        paddingVertical: topMargin,
    },
    iconStyle: {
        color: black,
        // color: White,
        fontSize: 20,
        alignSelf: 'center',
    },
    textStyle: {
        color: grey,
        fontSize: mediumText,
        // flex: 1,
    },

    imgStyle: {
        width: 100,
        height: 100
    },
    headerText: {
        color: White,
        fontSize: labelFont,
        fontWeight: '600'
    },
    policyStyle: {
        flexDirection: 'row',
        marginBottom: 5
        // alignItems: 'center',
    },
    circle: {
        height: 8,
        width: 8,
        borderRadius: 8 / 2,
        backgroundColor: grey,
        marginRight: 10,
        alignSelf: 'flex-start',
        marginTop: 7,
    },
    btnView: {
        // width: wp(35),
        // alignSelf: 'center',
        paddingVertical: 3,
        backgroundColor: darkSky,
        // marginTop:topMargin,
        backgroundColor: darkSky,
        borderBottomEndRadius: 20,
        borderBottomLeftRadius: 20,
        borderRadius: 20,
    },
    btnWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        // paddingLeft:5,
    },
    okBtnStyle: {
        fontSize: mediumText,
        marginLeft: 5,
        fontWeight: '600',
        color: White
    },
    imgContainer: {
        width: imgWidth,
        height: imgHeight,
        borderRadius: imgHeight / 2,
        alignItems: 'center',
        alignSelf: 'center',
        bottom: imgMarginBottom
    },
    imgStyle: {
        width: imgWidth,
        height: imgHeight
    },
    avatarStyle: {
        width: null,
        height: null,
        flex: 1,
    },
    textContainer: {
        paddingHorizontal: horizontalPadding,
    }
})

