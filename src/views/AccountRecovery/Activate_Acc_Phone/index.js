import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import OTPTextView from '../../SignupConnectView/OTPTextView';
import styles from './styles';
import requestRoutes from './../../../utils/requestRoutes.json'; //'../../utils/requestRoutes';
import MainLogoForSignUp from '../../../components/updated/MainLogoForSignUp';
import { SERVER, server_key } from '../../../constants/server';
import SkyBlueBtn from '../../../components/common/SkyblueBtn';
import { ACCESS_TOKEN, } from '../../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import { Container, Content } from 'native-base';
import ErrorMsg from '../../../components/common/ErrorMsg';
import ErrorModal from '../../../components/common/ErrorModal';
import { petMyPalApiService } from '../../../services/PetMyPalApiService';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import CustomLoader from '../../../components/common/CustomLoader';


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
      cca2: '',
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
      runOnce: true,
      setDefaultValue: false,
      token:'',

      oldContact:'',
      oldCca2:'',
      oldCallingCode:'',
      oldCountryCode:'',
      oldPhoneNumber:'',
      changeNum:null

    }

  }

  componentDidMount() {

    let _props = this.props.navigation.state.params.userData
    
    let tempVal = ''
    tempVal = `${_props.cca2},${_props.callingCode}`

    this.setState({
      callingCode: _props.callingCode,
      // contact: _props.contact,
      cca2:_props.cca2,
      countryCode: tempVal,
      phoneNum: _props.maskedNumber,
      user_id:_props.user_id,
      token: _props.token,

      oldContact: _props.contact,
      oldCca2: _props.cca2,
      oldCallingCode: _props.callingCode,
      oldCountryCode: tempVal,
      changeNum:_props.changeNum

    })

    this.setTimmer()

  }

  componentWillUnmount() {
    clearInterval(interval)
  }

  handleOTPChange = value => {
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
      // setDefaultValue:false,  //important
    })
  }



  handleOverlay = () => {
    let _props = this.props.navigation.state.params.userData
    const { isOverlayVisible } = this.state
    this.setState({
      isOverlayVisible: !isOverlayVisible,
      phoneNum: _props.maskedNumber, // when user Cancel/ don`t want to change ph num
      callingCode: _props.callingCode,// when user Cancel/ don`t want to change ph num
      sending: false,
      setDefaultValue: true,
    })

  }



  /******************************* register New Phone Number ***********************************/

  registerNewPhoneNumber = async () => {
    const { firstName,
      lastName,
      callingCode,
      contact,
      cca2,
      user_id,
      phoneNumError,
      token,
    } = this.state;

    let invalidPhone = false

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('phone_number', callingCode + contact);
    formData.append('user_id' ,user_id)

    if (phoneNumError) {
      this.setState({ isInvalidNum: true })
      invalidPhone = true
    }
    if(!contact){
      this.setState({ isInvalidNum: true })
      invalidPhone = true
    }

    if (!invalidPhone) {
      this.setState({ sending: true })

      const response = await petMyPalApiService.recover_account(token, formData).catch((err)=>{
        console.log('err occure while sending Activation code' , err)
      })
      const { data } = response;
      if (data.status === '400') {} 

      else if (data.status === 200) {

        this.setState({
          otp: '',
          sending: false,
          isOverlayVisible: false,
          // cca2: 'US'
        })
      

      } else {
        this.setState({
          otpError: true,
          otp: '',
          sending: false,
          isOverlayVisible: false,
          // cca2: 'US' 
        })
      }

    }

  }


  handleTwoFactorPressed =async () => {

    this.setState({ fetching: true, error: '', otpError: false });
    const { user_id, otp, token } = this.state;
    if (otp == '0000') {
      this.setState({ otpError: true, fetching: false, showErrorModal: true });
      return;

    }
    const formData = new FormData()
    formData.append('server_key', server_key);
    formData.append('confirm_code', otp)
    formData.append('user_id' , user_id)

    if (otp.length === 4) {
      this.setState({ otpError: false });
      const response = await petMyPalApiService.activateUser(token , formData).catch((err)=>{
        console.log('error while activating User account' , err)
    })
    const {data} = response
    if(data.api_status==200){
      this.setState({ 
        otpError: false , 
        fetching:false 
       },()=>this.props.navigation.navigate('FooterBarView'))

      this.StopCounter()

    }else{
      this.setState({ 
        otpError: true, 
        fetching: false,
        showErrorModal:true
     });
    }

    } else {
      this.setState({
        otpError: true,
        fetching: false,
      });
    }
  }

  
  handleResendOtpPressed = async (val) => {
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
    // const { callingCode, contact , token ,user_id } = this.state;

    const {oldCallingCode , oldContact ,token ,user_id} = this.state

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('phone_number', oldCallingCode + oldContact);
    formData.append('user_id' ,user_id)

    const response = await petMyPalApiService.recover_account(token, formData).catch((err)=>{
      // console.log('err occure while sending Activation code' , err)
    })
    const {data} = response
    if(data.status ==200){

    }else{
      console.log('error occure ' , data)
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


  closeModal = async () => {
    const scope = this
    scope.StopCounter()
    this.setState({ isModal_Visible: false })
    setTimeout(() => {
      scope.props.navigation.pop()
    }, 500)

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
      changeNum

    } = this.state

    return (
      <Container>
        <Content>
          <MainLogoForSignUp
            verifyText={'Enter the 4-digit we sent to'}
            heading={'Verify your phone number'}
            // steps={3}
            changeNum={changeNum}
            cca2={cca2}
            contact={phoneNum} // to show in popUp previous lib
            phoneNum={phoneNum} // to perform masking in previous lib
            callingCode={callingCode}
            error={isInvalidNum}
            // error={phoneNumError}
            sending={sending}
            goBack={()=>this.props.navigation.pop()}
            handleOverlay={this.handleOverlay}
            showOverlay={isOverlayVisible}
            handleContactChange={this.handleContactChange} //parent call
            send_OTP_on_Num_Change={() => this.registerNewPhoneNumber()} ///// parent fun call 
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

export default VerifyPhoneNumber;
