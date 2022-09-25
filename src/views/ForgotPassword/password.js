import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { TEXT_INPUT_LABEL, PLACE_HOLDER, darkSky } from '../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { Container, Content } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MainLogoForLogin from '../../components/common/MainLogoForLogin';
import TextField from '../../components/common/TextField';
import InfoModal from '../../components/common/InfoModal';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { Capitalize, passwordValidate } from '../../utils/RandomFuncs';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorMsg from '../../components/common/ErrorMsg';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { SERVER, server_key } from '../../constants/server';
import requestRoutes from '../../utils/requestRoutes';
import { connect } from 'react-redux';
import { passwordPolicy } from '../../constants/ConstantValues';
import ErrorModal from '../../components/common/ErrorModal';
import CustomLoader from '../../components/common/CustomLoader';



const window = Dimensions.get('window');

class Password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: '',
            password: '',
            confirm_password: '',
            passwordError: false,
            errorRePassword: false,
            isPass_Visible: false,
            isConfirmPass_Visible: false,
            fetching: false,
            infoText: '',
            showErrorModal: false,
            errorInfo: '',

            // isConfirmModalVisible: false

        }
    }

    // componentDidMount(){}

    goBack = () => {
        this.props.navigation.pop()
    }

    showPasswordPolicy = () => {
        this.setState({
            isModal_Visible: true,
            passPolicy: true,
            infoText: passwordPolicy,
            headerText: 'Password Policy'
        })
    }


    handlePassword = (pass) => {
        this.setState({ password: pass })
        // if (!passwordValidate(pass)) {
        if (pass) {
            if (pass.trim().length < 8) {
                this.setState({ passwordError: true, error: '' })
            } else {
                this.setState({ passwordError: false, error: '' })
            }
        } else {
            this.setState({ passwordError: true, error: '' })
        }


    }

    showPassword = (value) => {
        this.setState({ isPass_Visible: !value })
    }

    handleConfirmPassword = (value) => {
        const { password } = this.state
        if (value != password) {
            this.setState({ errorRePassword: true, confirm_password: value, error: '' })
        } else {
            this.setState({ errorRePassword: false, confirm_password: value })
        }
    }

    show_confirm_Password = (value) => {
        this.setState({ isConfirmPass_Visible: !value })
    }

    closeModal = () => {
        this.setState({
            isModal_Visible: false
        })
    }




    /////////// Passwords Entered ////////////////////
    ResetPassword = () => {
        const { passwordError, confirm_password, errorRePassword, password } = this.state;
        if (password) {
            if (!passwordError && !errorRePassword) {

                this.handleUpdateAccountPressed();

            } else if (passwordError) {

                this.setState({ error: 'Your password does not match with our policy' });

            } else if (errorRePassword) {
                this.setState({ error: 'Your password does not match' });
            }
        } else {
            this.setState({
                error: 'Please enter your password',
                passwordError: true
            });

        }

        if (!confirm_password) {
            this.setState({ errorRePassword: true })
        }
    };


    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        console.log('response toke', access_token)
        return access_token;
    }
    //////////// Reset Password API ////////////////////

    handleUpdateAccountPressed() {
        this.setState({ fetching: true, error: '' });
        const { password, confirm_password, code } = this.state;
        const data = new FormData();
        data.append('server_key', server_key);
        data.append('password', password);
        data.append('confirm_password', confirm_password);
        data.append('code', code);

        this.requestHandlerUpdate('reset-password', data);
    }

    async requestHandlerUpdate(type, data) {
        let TOKEN = null;
        this.getAccessToken()
            .then(token => {
                TOKEN = JSON.parse(token).access_token;
            })
            .then(() => {
                return fetch(
                    SERVER + requestRoutes[type].route + '?access_token=' + TOKEN,
                    {
                        method: requestRoutes[type].method,
                        body: data,
                        headers: {},
                    },
                )
                    .then(response => {
                        return response.json();
                    })
                    .then(responseJson => {
                        if (responseJson.api_status === 200) {
                            this.setState({
                                fetching: false,
                                // isConfirmModalVisible: true 
                            });
                            setTimeout(() => {
                                this.props.navigation.navigate('LoginMethod')
                            }, 400)

                        } else {
                            this.setState({
                                error: responseJson.errors.error_text,
                                fetching: false,
                                showErrorModal: true,
                                errorInfo: Capitalize(responseJson.errors.error_text)
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
    }


    closeErrorModal = () => {
        this.setState({ showErrorModal: false })
    }


    render() {
        const {
            error,
            password,
            confirm_password,
            passwordError,
            isPass_Visible,
            isConfirmPass_Visible,
            errorRePassword,
            fetching,
            isModal_Visible,
            infoText,
            headerText,
            passPolicy,
            showErrorModal,
            errorInfo,
            // isConfirmModalVisible,
        } = this.state


        return (
            <Container style={styles.wraper}>
                <Content style={styles.wraper}>
                    <MainLogoForLogin
                        goBack={this.goBack}
                        heading={'Generate New Password'}
                        backButton={false}
                    />
                    <View style={styles.ContentView}>
                        {/* <View style={{marginTop:Platform.OS=='android'? 50 :isIphoneX()? 0:0}}> */}

                        <TextField
                            label={"New Password"}
                            // policy={true}
                            placeholder={'Enter new password'}
                            value={password}
                            error={passwordError}
                            // keyboardType={'default'}
                            showPolicy={() => this.showPasswordPolicy()}
                            onChangeText={(text) => this.handlePassword(text)}
                            onIconPress={() => this.showPassword(isPass_Visible)}
                            iconName={isPass_Visible ? 'eye' : 'eye-with-line'}
                            secureTextEntry={!isPass_Visible}
                            style={{ color: isPass_Visible ? darkSky : TEXT_INPUT_LABEL }}
                            iconType={'Entypo'}
                        />

                        <TextField
                            label={"Confirm New Password"}
                            placeholder={'Re-enter your new password'}
                            value={confirm_password}
                            error={errorRePassword}
                            onChangeText={(text) => this.handleConfirmPassword(text)}
                            // onChangeText={(text) => this.setState({ confirm_password: text })}
                            onIconPress={() => this.show_confirm_Password(isConfirmPass_Visible)}
                            iconName={isConfirmPass_Visible ? 'eye' : 'eye-with-line'}
                            secureTextEntry={!isConfirmPass_Visible}
                            containerStyle={{ marginTop: 10, }}
                            style={{ color: isConfirmPass_Visible ? darkSky : TEXT_INPUT_LABEL, }}
                            iconType={'Entypo'}
                        />

                        <ErrorMsg
                            errorMsg={error}
                        />
                        {fetching ?
                            <CustomLoader />
                            :
                            <SkyBlueBtn
                                title={'Finish'}
                                onPress={() => this.ResetPassword()}
                                btnContainerStyle={styles.buttonContainer}
                            />
                        }
                    </View>

                    <InfoModal
                        isVisible={isModal_Visible}
                        onBackButtonPress={() => this.closeModal()}
                        info={infoText}
                        headerText={headerText}
                        policy={passPolicy}
                        onPress={() => this.closeModal()}
                    />
                    {/* <ConfirmModal
                        isVisible={isConfirmModalVisible}
                        onBackButtonPress={() => this.closeConfirmModal()}
                        info={'Profile Successfully Updated'}
                        CancelTitle={'Cancel'}
                        DoneTitle={'Login'}
                        onPress={() => this.closeConfirmModal()}
                        onCancelBtnPress={() => this.closeConfirmModal()}
                        onDoneBtnPress={() => this.handleDoneBtnPress()}
                    /> */}
                    {/* <DialogBox
                        ref={dialogbox => {
                            this.dialogbox = dialogbox;
                        }}
                    /> */}
                </Content>
                <ErrorModal
                    isVisible={showErrorModal}
                    onBackButtonPress={() => this.closeErrorModal()}
                    info={errorInfo}
                    heading={'Hoot!'}
                    onPress={() => this.closeErrorModal()}
                />
            </Container>
        );
    }
};


const styles = StyleSheet.create({
    wraper: {
        flex: 1
    },
    ContentView: {
        marginHorizontal: 15,
        marginTop: RFValue(30),
    },
    buttonContainer: {
        marginTop: hp(3),
        alignSelf: 'center'
    },


});

const mapStateToProps = state => ({
    user: state.user.user,
});

export default connect(mapStateToProps)(Password);

