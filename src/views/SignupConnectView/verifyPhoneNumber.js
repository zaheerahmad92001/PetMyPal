import React, { Component } from 'react';
import { Text, View, TouchableOpacity ,Keyboard } from 'react-native';

import OTPTextView from './OTPTextView';
import styles from './styles';
import requestRoutes from './../../utils/requestRoutes.json'; //'../../utils/requestRoutes';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { SERVER, server_key } from '../../constants/server';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { ACCESS_TOKEN, } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import { Container, Content } from 'native-base';
import ErrorMsg from '../../components/common/ErrorMsg';
import ErrorModal from '../../components/common/ErrorModal';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import CustomLoader from '../../components/common/CustomLoader';
import { Capitalize } from '../../utils/RandomFuncs';
// import RNOtpVerify from 'react-native-otp-verify';
// import SmsRetriever from 'react-native-sms-retriever';

    
var interval = ''

class VerifyPhoneNumber extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      otp: '',
      otpError: false,
      callingCode: '',
      contact: '',
      phoneNum: '',
      cca2: 'US',
      countryCode: '',
      firstName: '',
      lastName: '',
      overlay_visible: false,
      fetching: false,
      counter: '',
      resendOptions: 0,
      isModal_Visible: false,
      showErrorModal: false,

      phoneNumError: false,
      isInvalidNum: false,
      sending: false,
      isOverlayVisible: false,
      setDefaultValue: false,
      // defaultVlaue:'',

      old_contact:'',
      old_phone:'',
      num_AlreadyUsed:false,
      changeNum:null
    }

  }

  

 async componentDidMount() {

    let _props = this.props.navigation.state.params.userData
    let userId = this.props.navigation.state.params.user_id


    let tempVal = ''
    tempVal = `${_props.cca2},${_props.callingCode}`

    this.setState({
      callingCode: _props.callingCode,
      contact: _props.contact,

      old_contact : _props.contact, 
      old_phone : _props.maskedNumber ,

      countryCode: tempVal,
      phoneNum: _props.maskedNumber,
      firstName: _props.firstName,
      lastName: _props.lastName,
      user_id: userId,
      changeNum:_props.changeNum

    })

    this.setTimmer()

      
  //  RNOtpVerify.getHash()
  // .then('hash read' ,console.log)
  // .catch('hash reading error', console.log);

  //   RNOtpVerify.getOtp()
  //   .then((p) => {
  //     RNOtpVerify.addListener(this.otpHandler)
  //     console.log('P is' , p)
  //   })
  //   .catch((p) => console.log( 'p error is',p)); 


  // const registered = await SmsRetriever.startSmsRetriever();
  // console.log('message receive', registered)
  // if (registered) {
  //   SmsRetriever.addSmsListener(event => {
  //     console.log('msg received',event);
  //     SmsRetriever.removeSmsListener();
  //   });
  // }else{
  //   console.log('err while accessign msg')
  // }

   
  }

//   otpHandler = (message) => {
//     console.log('here is message', message)
//     // const otp = /(\d{4})/g.exec(message)[1];
//     // console.log('here is otp',otp)
//     // this.setState({ otp });
//     RNOtpVerify.removeListener();
//     Keyboard.dismiss();
// }
  
  

  componentWillUnmount() {
    clearInterval(interval)
    // RNOtpVerify.removeListener();
  }

  handleOTPChange = (value,i) => {
    this.setState({ otp: value, otpError: false },()=>{
      if(value.length===4){
        this.handleTwoFactorPressed()
      }
    });
  };


  handleContactChange = (value) => {
    let tempVal = ''
    tempVal = `${value.selectedCountry.code},${value.selectedCountry.dialCode}`

    this.setState({
      contact: value.unmaskedPhoneNumber,
      phoneNum: value.phoneNumber,
      phoneNumError:!value.isVerified ,
      isInvalidNum: false,
      cca2: value.selectedCountry.code,
      callingCode: value.selectedCountry.dialCode,
      countryCode: tempVal,
      setDefaultValue:false,  //important
    })
  }



  handleOverlay = () => {
    let _props = this.props.navigation.state.params.userData
    const { isOverlayVisible } = this.state
    this.setState({
      isOverlayVisible: !isOverlayVisible,
      phoneNum: _props.maskedNumber,   // when user Cancel/ don`t want to change ph num
      callingCode: _props.callingCode,  // when user Cancel/ don`t want to change ph num
      cca2: _props.cca2,        // when user Cancel/ don`t want to change ph num
      contact: _props.contact,     // when user Cancel/ don`t want to change ph num
      sending: false,
      num_AlreadyUsed:false,
      // setDefaultValue:true,
      // defaultVlaue: _props.contact
    })

  }



  /******************************* register New Phone Number ***********************************/

  registerNewPhoneNumber = async () => {
    const { 
      firstName,
      lastName,
      callingCode,
      contact,
      cca2,
      countryCode,
      phoneNumError
    } = this.state;

    let invalidPhone = false

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('phone_number', callingCode + contact);
    // formData.append('phone_number', '+' + callingCode + contact); // when new Phone lib added
    formData.append('mbl_country_code', countryCode)


    if (phoneNumError) {
      this.setState({ isInvalidNum: true })
      invalidPhone = true
    }

    if (!invalidPhone) {
      this.setState({ sending: true })

      const response = await petMyPalApiService.createAccount(formData)
      const { data } = response;
      if (data?.api_status == 400) {
      //  console.log('err while changing PhoneNumber', data?.api_status)
       this.handleOverlay()
       setTimeout(() => {
         this.setState({
           isModal_Visible:true,
           num_AlreadyUsed:true,
           infoText: Capitalize(data?.errors?.error_text)
         })
       },500);

      } else if (data.api_status == 200) {
      } else {
        this.setState({
          otpError: true,
          otp: '',
          sending: false,
          user_id: data.user_id,
          isOverlayVisible: false,
          cca2: 'US' //// add when new Phone lib added 
        })
      }

    }

  }


  handleTwoFactorPressed() {

    this.setState({ fetching: true, error: '', otpError: false });
    const { user_id, otp, callingCode, contact, countryCode } = this.state;


    const data = new FormData();

    data.append('server_key', server_key);
    data.append('user_id', user_id);
    data.append('code', parseInt(otp));
    data.append('phone_num', callingCode + contact);
    data.append('mbl_country_code', countryCode)

    if (parseInt(otp) > 999 && parseInt(otp) < 10000) {
      this.setState({ otpError: false });
      this.requestHandlerTwoFactor('two-factor', data);
    } else {
      this.setState({
        otpError: true,
        fetching: false,
        showErrorModal: true
      });
    }
  }

  async requestHandlerTwoFactor(type, data) {
    const scope = this
    // console.log('request Routes ',data);
    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(async responseJson => {
        console.log('responseJson',responseJson);
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
            fetching: false,
            // contact:'',
            phoneNum: '',
          },
           () => scope.props.navigation.navigate('PetDetails',{
             param: obj 
          })
          
          )

        } else {
          this.setState({
            fetching: false,
            otpError: true,
            otp: '',
            showErrorModal: true
          });
        }
      })
      .catch(error => {
        console.log('verifyPhoneNumber error', error);
      });
  }


  handleResendOtpPressed = (val) => {
    const { resendOptions } = this.state
    let sendOTP_on_num_chnage = val
    {
      sendOTP_on_num_chnage ? null :
        this.setState({ resendOptions: resendOptions + 1 })
    }

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

    const { callingCode, contact } = this.state;
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('phone_number', callingCode + contact);
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


  closeModal = async () => {
    const scope = this
    scope.StopCounter()
    this.setState({ isModal_Visible: false })
    setTimeout(() => {
      scope.props.navigation.pop()
    }, 500)

  }

closeModal_NumInUsed = ()=>{
  this.setState({
    isModal_Visible:false,
    num_AlreadyUsed:false
  })
}


  closeErrorModal = () => {
    this.setState({ showErrorModal: false })
  }

  stopRemovingOTPValue = (val) => {
    this.setState({ otpError: val })
  }


  render() {

    const {
      callingCode,
      cca2,
      contact,
      phoneNum,
      fetching,
      otpError,
      counter,
      sending,
      phoneNumError,
      isInvalidNum,
      isModal_Visible,
      showErrorModal,
      isOverlayVisible,
      otp,
      num_AlreadyUsed,
      changeNum,
      // setDefaultValue,
      // defaultVlaue,

    } = this.state

    return (
      <Container>
        <Content>
          <MainLogoForSignUp
            heading={'Verify your phone number'}
            verifyText={'Enter the 4-digit we sent to'}
            steps={3}
            changeNum={changeNum}
            cca2={cca2}
            contact={phoneNum} // to show in popUp previous lib
            phoneNum={phoneNum} // to perform masking in previous lib
            callingCode={callingCode}
            error={isInvalidNum}
            sending={sending}
            // setDefaultValue={setDefaultValue}
            // defaultVlaue={defaultVlaue}
            handleOverlay={this.handleOverlay}
            showOverlay={isOverlayVisible}
            handleContactChange={this.handleContactChange} //parent call
            send_OTP_on_Num_Change={() => this.registerNewPhoneNumber()} ///// parent fun call 
          />

          <View style={{ marginTop: Platform.OS == 'android' ? 60 : isIphoneX() ? -70 : 0 }}>
            <OTPTextView
              containerStyle={styles.textInputContainer}
              handleTextChange={(text,i) => {
                this.handleOTPChange(text,i);
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
                  disabled={otp.length == 4 ? false : true}
                />
              )}
          </View>
          {/* </View> */}

          <ErrorModal
            isVisible={isModal_Visible}
            onBackButtonPress={
              num_AlreadyUsed ?
              ()=>this.closeModal_NumInUsed() 
               :
              () => this.closeModal()
            }
            info={this.state.infoText}
            heading={'Hoot!'}
            onPress={
              num_AlreadyUsed ?
              ()=>this.closeModal_NumInUsed() 
              :
              () => this.closeModal()
            }
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

export default VerifyPhoneNumber;
