import React, { Component } from 'react';
import { Text, View, TouchableOpacity ,Platform,StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { darkSky, HEADER } from '../../constants/colors';
import OTPTextView from '../../views/SignupConnectView/OTPTextView';
import requestRoutes from './../../utils/requestRoutes.json'; //'../../utils/requestRoutes';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { SERVER, server_key } from '../../constants/server';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { ACCESS_TOKEN,} from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content } from 'native-base';
import ErrorMsg from '../../components/common/ErrorMsg';
import ErrorModal from '../../components/common/ErrorModal';
import {isIphoneX } from 'react-native-iphone-x-helper'
import CustomLoader from '../../components/common/CustomLoader';



var interval = ''

class VerifyAccount extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      otp: '',
      callingCode: '',
      contact: '',
      cca2: '',
      overlay_visible: false,
      fetching: false,
      otpError: false,
      counter: '',
      resendOptions: 0,
      isModal_Visible: false,
      showErrorModal:false,
      phoneNum:'',
      
    }

  }

  componentDidMount() {
   let _props = this.props.navigation.state.params

    this.setState({
      callingCode: _props.callingCode,
      cca2: _props.cca2,
      contact: _props.contact,
      user_id: _props.user_id,
      phoneNum : _props.maskedNumber,

    })

    this.setTimmer()

  }

  componentWillUnmount() {
    clearInterval(interval)
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

  // handleContactChange = (value) => {
  //   this.setState({ contact: value })
  // }

  // handleCountryChange = (country) => {
  //   this.setState({
  //     cca2: country.cca2,
  //     callingCode: country.callingCode
  //   })
  // }


  ///////////// Verify Phone Number API ////////////////

  handleTwoFactorPressed() {
    this.setState({ fetching: true, error: '', otpError: false });
    const { user_id, otp, callingCode, contact } = this.state;
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('confirm_code', parseInt(otp));
    data.append('phone_number', callingCode + contact);
  
    if (otp.length === 4) {
      this.setState({ otpError: false });
      this.requestHandlerTwoFactor('verification-code-sms', data);
    } else {
      this.setState({ otpError: true, fetching: false });
    }
  }

  async requestHandlerTwoFactor(type, data) {
    const scope = this
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
          const obj = {
            access_token: responseJson.access_token,
            user_id: responseJson.user_id,
          };
          try {
            await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({ ...obj }));
          } catch (err) {
            console.log(err);
          }
          // const token = await AsyncStorage.getItem(ACCESS_TOKEN);
          scope.setState({
            fetching: false
          }, () => scope.props.navigation.navigate('Password'))

        } else {
          this.setState({
            fetching: false,
            otpError: true,
            otp:'',
            showErrorModal:true
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }




  ///////////// Resend OTP API /////////////

  handleResendOtpPressed = (val) => {
    const { resendOptions } = this.state
    let sendOTP_on_num_chnage = val
    {
      sendOTP_on_num_chnage ? null :
        this.setState({ resendOptions: resendOptions + 1 })
    }
    /************ Timmer call   ************/

    if (resendOptions >= 2) {
      this.setState({
        isModal_Visible: true,
        infoText: 'You Have Reached Maximum Limits, Please Check Your Phone Number'
      })
      return true

    } else {
      this.setTimmer()
    }


    this.setState({ otp: '', otpError: false });

    const {callingCode, contact } = this.state;

    const data = new FormData();
    data.append('server_key', server_key);
    data.append('phone_number', '+' + callingCode + contact);
    this.requestHandlerResendOtp('send-code-sms', data);
  };

  async requestHandlerResendOtp(type, data) {
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
          });
        } else {
          this.setState({
            fetching: false,
            // otpError: true,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

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
    setTimeout(()=>{
      scope.props.navigation.pop()
    },1000)
    
  }

  closeErrorModal =()=>{
    this.setState({showErrorModal: false})
  }

  stopRemovingOTPValue=(val)=>{
    this.setState({otpError:val})
  }

  render() {

    const {
      callingCode,
      cca2, contact,
      fetching, otpError,
      counter,
      isModal_Visible,
      showErrorModal,
      phoneNum,
      otp,
      email,
      emailCode, 

    } = this.state

    return (
      <Container>
        <Content style={{ flex: 1 }}>

          <MainLogoForSignUp
            heading={'Confirm Your Phone Number'}
            verifyText={'Verification code has been sent to your phone number'}
            steps={3}
            cca2={cca2}
            contact={contact}
            phoneNum={phoneNum}
            callingCode={callingCode}
            pageName={'verifyAccount'}
          />
     <View style={{marginTop:Platform.OS=='android'? 60 :isIphoneX()? -70:0}}>
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

          {
            otpError ?
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <ErrorMsg
                  errorMsg={'Wrong verification code'}
                />
              </View>
              : null
          }

          {fetching ? (
            <CustomLoader/>
          ) : (
              <SkyBlueBtn
                title={'Verify'}
                onPress={() => this.handleTwoFactorPressed()}
                btnContainerStyle={{ alignSelf: 'center' }}
               disabled={otp.length==4 ? false :true}
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

export default VerifyAccount;

const styles = StyleSheet.create({
    
      textInputContainer: {
        marginBottom: 20,
        paddingHorizontal: RFValue(40),
      },
      
      resendText:{
        textAlign: 'center',
        marginTop: 4,
        color:darkSky
     },
     timmerStyle:{
      color:darkSky,
      fontSize:13
     }
})


