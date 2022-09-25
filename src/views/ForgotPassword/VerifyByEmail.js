import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { RFValue } from 'react-native-responsive-fontsize';
import { isIphoneX } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-community/async-storage';


import { darkSky, TEXT_INPUT_LABEL } from '../../constants/colors';
import OTPTextView from '../../views/SignupConnectView/OTPTextView';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { SERVER, server_key } from '../../constants/server';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { Container, Content } from 'native-base';
import ErrorModal from '../../components/common/ErrorModal';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import CustomLoader from '../../components/common/CustomLoader';
import { ACCESS_TOKEN } from '../../constants/storageKeys';




var interval = ''

class VerifyAccountByEmail extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      otp: '',
      fetching: false,
      otpError: false,
      counter: '',
      resendOptions: 0,
      isModal_Visible: false,
      showErrorModal: false,
      email: '',
      emailCode: '',
      token:'',
    }

  }

  componentDidMount() {

    let _props = this.props.navigation.state.params

    this.setState({
      user_id: _props.user_id,
      email: _props.email,
      emailCode: _props.emailCode,
      token: _props.response,

    })

    this.setTimmer()

  }

  componentWillUnmount() {
    clearInterval(interval)
    this.otpTimmer
  }


  // goBack = () => {
  //   this.props.navigation.pop()
  // }

  handleOTPChange = value => {
    this.setState({ otp: value },()=>{
      if(value.length===4){
        this.handleTwoFactorPressed()
      }
    });
  };


 async handleTwoFactorPressed() {
    console.log('otp', this.state.otp, 'emailcode', this.state.emailCode)
    this.setState({ fetching: true, error: '', otpError: false });
    const { otp, emailCode,token } = this.state;

    if (otp.length === 4 && emailCode === otp) {
      this.setState({ otpError: false, fetching: false });
      this.StopCounter()
      await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({...token}))
      this.props.navigation.navigate('Password')
    } else {
      this.setState({
        otpError: true,
        fetching: false,
        showErrorModal: true
      });
    }
  }


  ///////////// Resend OTP API /////////////

  handleResendOtpPressed = async (val) => {
    const { resendOptions, email } = this.state

    this.setState({
      resendOptions: resendOptions + 1,
      fetching: true,
      otp: '',
      otpError: false
    })

    /************ Timmer call   ************/

    if (resendOptions >= 2) {
      this.setState({
        isModal_Visible: true,
        infoText: 'You Have Reached Maximum Limits, Please Check Your Phone Number',
        fetching: false
      })
      return true

    } else {
      this.setTimmer()
    }

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('email', email)
    const response = await petMyPalApiService.recoverByEmail(formData).catch((e) => {
      this.setState({
        isModal_Visible: true,
        error: Capitalize(e.errors.error_text),
        fetching: false,
      })
    })

    const { data } = response
    console.log('response in email ', data)
    if (data.api_status === 200) {
      this.setState({
        fetching: false,
        emailCode: data.emailcode
      });
    } else {
      this.setState({
        isModal_Visible: true,
        error: Capitalize(data.errors.error_text),
        fetching: false,
      })
    }
  };


  setTimmer = () => {
    let timmer = 60
    interval = setInterval(() => {
      timmer = timmer - 1
      this.setState({ counter: timmer })
      if (timmer < 1) {
        this.StopCounter()
      }
    }, 1000);
  }

  StopCounter = () => {
    clearInterval(interval)
  }


  closeModal = () => {
    const scope = this
    scope.StopCounter()
    this.setState({ isModal_Visible: false })
    setTimeout(() => {
      scope.props.navigation.pop()
    }, 1000)

  }

  closeErrorModal = () => {
    this.setState({ showErrorModal: false })
  }

  stopRemovingOTPValue = (val) => {
    this.setState({ otpError: val })
  }

  render() {

    const {
      fetching,
      otpError,
      counter,
      isModal_Visible,
      showErrorModal,
      otp,
      email,
      emailCode,
    } = this.state

    return (
      <Container>
        <Content style={{ flex: 1 }}>

          <MainLogoForSignUp
            heading={'Confirm Your Account'}
            verifyText={'Verification code has been sent to your account'}
            steps={3}
            pageName={'verifyAccount'}
            email={email}
          />
          <View style={{ marginTop: Platform.OS == 'android' ? 60 : isIphoneX() ? -70 : 0 }}>
            <OTPTextView
            containerStyle={styles.textInputContainer}
            handleTextChange={text => {
              this.handleOTPChange(text);
            }}
            textInputStyle={[
              styles.roundedTextInput,
              { marginTop: 20 },
            ]}
            removeText={otpError}
            tintColor="#35C71D"
            offTintColor={otpError ? 'red' : '#DCDCDC'}
            inputCount={4}
            keyboardType="numeric"
            StopRemovingOTPValue={this.stopRemovingOTPValue} // parent call 
          />

            
            {counter > 1 ?

              <View style={{ justifyContent: 'center', marginBottom: 13, alignItems: 'center' }}>
                <Text style={{ color: '#8B94A9' }}>I have not received my passcode.</Text>
                <Text style={styles.timmerStyle}>{`Resend in (${counter}) seconds`}</Text>
              </View>
              :

              <TouchableOpacity
                onPress={() => this.handleResendOtpPressed()}>
                <View style={{ justifyContent: 'center', marginBottom: 20, }}>
                  <Text style={styles.resendText}>Resend</Text>
                </View>
              </TouchableOpacity>

            }

            
            {fetching ? (
              <CustomLoader />
            ) : (
              <SkyBlueBtn
                title={'Verify'}
                onPress={() => this.handleTwoFactorPressed()}
                btnContainerStyle={{ alignSelf: 'center' }}
                disabled={otp.length == 4 ? false : true}
              />
            )}
          </View>

          <ErrorModal
            isVisible={isModal_Visible}
            onBackButtonPress={() => this.closeModal()}
            info={this.state.infoText}
            heading={'Hoot!'}
            onPress={() => this.closeModal()}
          />

          <ErrorModal
            isVisible={showErrorModal}
            onBackButtonPress={() => this.closeErrorModal()}
            info={'Wrong Verification Code'}
            heading={'Hoot!'}
            onPress={() => this.closeErrorModal()}
          />

        </Content>
      </Container>
    )
  }
};

export default VerifyAccountByEmail;

const styles = StyleSheet.create({

  textInputContainer: {
    marginBottom: 20,
    paddingHorizontal: RFValue(40),
  },

  resendText: {
    textAlign: 'center',
    marginTop: 4,
    color: darkSky
  },
  timmerStyle: {
    color: darkSky,
    fontSize: 13
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: TEXT_INPUT_LABEL,
  },

  underlineStyleBase: {
    width: 55,
    height: 50,
    borderColor: TEXT_INPUT_LABEL

  },

  underlineStyleHighLighted: {
    borderColor: darkSky,
  },
})


