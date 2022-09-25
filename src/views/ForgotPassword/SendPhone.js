import React from 'react';
import {StyleSheet,View,} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userEdit } from '../../redux/actions/user';
import { SERVER, server_key } from '../../constants/server';
import requestRoutes from '../../utils/requestRoutes';
import {black, White, darkSky, grey, DANGER } from '../../constants/colors';
import ContactInput from '../../components/common/ContactInput';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import MainLogoForLogin from '../../components/common/MainLogoForLogin';
import Label from '../../components/common/Label';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import WhiteBtn from '../../components/common/WhiteBtn';
import { textInputFont } from '../../constants/fontSize';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import ErrorMsg from '../../components/common/ErrorMsg';

import { Capitalize, validate, validateNumber } from '../../utils/RandomFuncs';
import ErrorModal from '../../components/common/ErrorModal';
import { Content } from 'native-base';
import TextField from '../../components/common/TextField';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import IntlPhoneInput from 'react-native-intl-phone-input';
import { Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-community/async-storage';
import CustomLoader from '../../components/common/CustomLoader'





class SendPhone extends React.Component {
    static navigationOptions = {
        header: null,
    };
    static propTypes = {
        user: PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {

            error: '',
            fetching: false,
            cca2: 'US',
            callingCode: '1',
            contact: '',
            isModal_Visible: false,
            infoText: '',
            smsBtnSelected: false,
            emailBtnSelected: false,
            email: '',
            errorEmail: '',
            pageLink: null,
            maskedNumber: '',

        };
        this._webView = React.createRef();
    }

    goBack = () => { this.props.navigation.pop()}
    
    handleContactChange = (value) => {
        this.setState({
            contact: value.unmaskedPhoneNumber,
            maskedNumber: value.phoneNumber,
            phError: !value.isVerified,
            error: "",
            setDefaultValue: false,  //importan 
            cca2: value.selectedCountry.code,
            callingCode: value.selectedCountry.dialCode,
            email: "",
        })

    }

    /**************************** Send OTP API **************************/

    handleSendOTPPressed = async (source) => {
        const { callingCode, contact, cca2, email, phError } = this.state;

        /*************** sms logic  **************/

        if (source === 'sms') {
            if (contact.trim().length > 0) {
                // if (!validateNumber(contact, cca2)) {
                //     this.setState({
                //         error: 'Invalid Phone number'
                //     })
                // } 
                if (phError) {
                    this.setState({
                        error: 'Invalid Phone Number'
                    })
                }
                else {
                    this.setState({ fetching: true, error: '', });
                    const data = new FormData();
                    data.append('server_key', server_key);
                    data.append('phone_number', callingCode + contact);
                    this.requestHandlerResendOtp('send-code-sms', data);

                }
            } else {
                this.setState({ error: 'Please Enter Phone Number.' });
            }
        }
        /*************** Email logic  **************/

        else if (source === 'email') {
            let vlidateEmail = validate(email)
            if (!vlidateEmail) {
                this.setState({ errorEmail: 'Please Enter Email' })
            } else {
                this.setState({ fetching: true })
                const formData = new FormData()
                formData.append('server_key', server_key);
                formData.append('email', email.toLocaleLowerCase())
                const response = await petMyPalApiService.recoverByEmail(formData).catch((e) => {
                    this.setState({
                        isModal_Visible: true,
                        error: Capitalize(e.errors.error_text),
                        fetching: false,
                    })
                })
                const { data } = response
                console.log('here is response' , data);
                if (data.api_status === 200) {
                    // await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({...data}))
                    this.setState({
                        fetching: false,
                    }, () => this.props.navigation.navigate('VerifyAccountByEmail', {
                        email,
                        emailCode: data.emailcode,
                        response:data
                    })
                    );

                } else {
                    this.setState({
                        isModal_Visible: true,
                        error: Capitalize(data.errors.error_text),
                        fetching: false,
                    })
                }
            }

        }

    }

    async requestHandlerResendOtp(type, data) {
        const { callingCode, cca2, contact, maskedNumber } = this.state

        return fetch(SERVER + requestRoutes[type].route, {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
        })
            .then(response => {
                return response.json();
            })
            .then(async responseJson => {
                if (responseJson.api_status === 200) {
                    this.setState({
                        fetching: false,
                    }, () => this.props.navigation.navigate('VerifyAccount', {
                        callingCode,
                        contact,
                        cca2,
                        maskedNumber,
                    })
                    );
                } else {
                    this.setState({
                        error: Capitalize(responseJson.errors.error_text),
                        fetching: false,
                        isModal_Visible: true

                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    closeModal = () => {
        const scope = this
        this.setState({ isModal_Visible: false })
    }

    verifyBySMS = () => {
        this.setState({
            smsBtnSelected: true,
            emailBtnSelected: false,
            error: '',
            errorEmail:'',
        })
    }
    verifyByEmail = () => {
        this.setState({
            smsBtnSelected: false,
            emailBtnSelected: true,
            error: '',
        })
    }

    render() {

        const {
            cca2,
            callingCode,
            contact,
            phError,
            error,
            isModal_Visible,
            fetching,
            smsBtnSelected,
            emailBtnSelected,
            email,
            errorEmail,
        } = this.state

        return (
            <View style={styles.container}>
                <Content>
                    <MainLogoForLogin
                        goBack={this.goBack}
                        heading={'Forgot Password?'}
                        text="Not a problem, we will get you back to your pets and pals in a jiffy."
                    />
                    <View style={styles.btnWraper}>
                        <WhiteBtn
                            title={"Recover by SMS"}
                            onPress={() => this.verifyBySMS()}
                            btnContainerStyle={smsBtnSelected ? [styles.verifyBySMSBtnSelected] : [styles.verifyBySMSBtn]}
                            titleStyle={smsBtnSelected ? [styles.titleStyle] : null}
                        />
                        <WhiteBtn
                            title={"Recover by Email"}
                            onPress={() => this.verifyByEmail()}
                            btnContainerStyle={emailBtnSelected ? [styles.verifyBySMSBtnSelected] : [styles.verifyBySMSBtn]}
                            titleStyle={emailBtnSelected ? [styles.titleStyle] : null}
                        />
                    </View>

                    {smsBtnSelected &&
                        <View style={styles.content}>
                            <Label text={"Phone Number"} error ={error} />

                            {/* <ContactInput
                                    error={phError}
                                    cca2={cca2}
                                    callingCode={callingCode}
                                    onChangeText={(value) => {
                                        this.handleContactChange(value);
                                    }}
                                    marginLeft={{ marginLeft: wp(-3) }}
                                    placeholderTextColor={PLACE_HOLDER}
                                    contact={contact}
                                    placeholder={'Enter Phone number'}
                                    select={(country) => {
                                        this.handleCountryChange(country)
                                    }}
                                /> */}

                            <IntlPhoneInput
                                defaultCountry={cca2}
                                ref={this.inputRef}
                                flagStyle={{ 
                                    fontSize:Platform.OS=='android'? 15:25}}
                                onChangeText={(c) => this.handleContactChange(c)}
                                containerStyle={error ? {...styles.intlPhoneInputStyle , borderBottomColor:DANGER} : styles.intlPhoneInputStyle}
                            />
                            <View style={{ marginTop: 10, }}><ErrorMsg errorMsg={error}/></View>
                            {fetching ?
                                <View style={{ marginTop: hp(5) }}>
                                    <CustomLoader/>
                                </View>
                                :
                                <SkyBlueBtn
                                    title={'Recover'}
                                    onPress={() => this.handleSendOTPPressed('sms')}
                                    btnContainerStyle={styles.buttonContainer}
                                />
                            }
                        </View>
                    }

                    {emailBtnSelected &&
                        <View style={styles.content}>
                            <TextField
                                label={"Your Email"}
                                placeholder={'Enter Your Email'}
                                value={email}
                                error={errorEmail}
                                onChangeText={(text) => this.setState({
                                    email: text,
                                    errorEmail: false,
                                    error: '',
                                })}
                            />


                            <View style={{ marginTop: 10, }}>
                                <ErrorMsg errorMsg={errorEmail}/>
                            </View>
                            {fetching ?
                                <View style={{ marginTop: hp(5) }}>
                                    <CustomLoader/>
                                </View>
                                :
                                <SkyBlueBtn
                                    title={'Recover'}
                                    onPress={() => this.handleSendOTPPressed('email')}
                                    btnContainerStyle={styles.buttonContainer}
                                />
                            }

                        </View>
                    }

                    <ErrorModal
                        isVisible={isModal_Visible}
                        onBackButtonPress={() => this.closeModal()}
                        info={error}
                        heading="Hoot!"
                        onPress={() => this.closeModal()}
                    />
                </Content>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: White
    },
    content: {
        marginTop: hp(6),
        marginHorizontal: 25,
    },
    buttonContainer: {
        marginTop: hp(4),
        alignSelf: 'center'
    },
    loginView: {
        marginTop: 20,
        alignSelf: 'center'
    },
    loginText: {
        fontSize: textInputFont,
        color: black,
    },
    verifyBySMSBtn: {
        width: wp(41),
        borderRadius: 10,
        paddingVertical: Platform.OS == 'android' ? 5 : 10,

    },
    verifyBySMSBtnSelected: {
        width: wp(41),
        backgroundColor: darkSky,
        borderColor: darkSky,
        borderRadius: 10,
        paddingVertical: Platform.OS == 'android' ? 5 : 10,
    },
    titleStyle: {
        color: White,
    },

    btnWraper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 25,
        marginTop: Platform.OS == 'android' ? 30 : isIphoneX() ? 0 : 10,
    },
    intlPhoneInputStyle: {
        paddingLeft: 2,
        paddingVertical: 0,
        borderBottomColor: grey,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: Platform.OS == 'android' ? 0 : 10,
        marginTop: Platform.OS == 'android' ? 0 : 10,
    }

});

const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
    loginEdit: user => dispatch(userEdit(user)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SendPhone);
