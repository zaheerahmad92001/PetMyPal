import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { BLUE, HEADER } from '../../constants/colors';
import OTPTextView from '../../views/SignupConnectView/OTPTextView';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { SERVER, server_key } from '../../constants/server';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { ACCESS_TOKEN, } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import { Container, Content } from 'native-base';
import ErrorMsg from '../../components/common/ErrorMsg';
import ErrorModal from '../../components/common/ErrorModal';
import { Capitalize } from '../../utils/RandomFuncs';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { connect } from 'react-redux';
import { userEdit } from '../../redux/actions/user';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import CustomLoader from '../../components/common/CustomLoader';



var interval = ''

class VerifyOTP extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {

      user: this?.props?.user?.user_data,

      recv_otp: '',
      userEnterd_opt: '',

      token: '',
      newCallingCode: '',
      newContact: '',
      newCca2: '',
      newCountryCode: '',


      oldCallingCode: '',
      oldContact: '',
      oldCca2: '',
      oldCountryCode: '',

      overlay_visible: false,
      fetching: false,
      otpError: false,
      counter: '',
      resendOptions: 0,
      isModal_Visible: false,
      showErrorModal: false,
      infoText: '',

      phoneNum: "",
      sending: false,
      isOverlayVisible: false,
      isInvalidNum: false,
      PhExist: false,
      setDefaultValue: false,
      num_AlreadyUsed:false,

    }

  }

  componentDidMount() {

    let _props = this.props.navigation.state.params.userData
    let userId = this.props.navigation.state.params.user_id
    let OTP = this.props.navigation.state.params.otp

    let tempVal = ''
    tempVal = `${_props.newCca2},${_props.newCallingCode}`


    this.setState({

      newCallingCode: _props.newCallingCode,
      newCca2: _props.newCca2,
      newCountryCode: _props.newCountryCode,
      newContact:_props.newContact,

      oldContact: _props.oldContact,
      oldCca2: _props.oldCca2,
      oldCallingCode: _props.oldCallingCode,
      oldCountryCode: _props.oldCountryCode,
      oldPhoneNumber: _props.oldPhoneNumber,
      recv_otp: OTP,
      phoneNum: _props.maskedNumber
    })


    this.setTimmer()
    this.getAccessToken().then(TOKEN => {
      this.setState({ token: JSON.parse(TOKEN).access_token });
    });

  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  componentWillUnmount() {
    clearInterval(interval)
  }


  handleOTPChange = value => {
    this.setState({ userEnterd_opt: value },()=>{
      if(value.length===4){
        this.handleTwoFactorPressed()
      }
    });
    
  };

  /**************  Verify Phone Number API ***********************/

  handleTwoFactorPressed() {
    const { userEnterd_opt, recv_otp } = this.state

    this.setState({
      fetching: true,
      error: '',
      otpError: false
    });

    if (parseInt(userEnterd_opt) > 999 && parseInt(userEnterd_opt) < 10000) {
      if (userEnterd_opt === recv_otp) {
        this.setState({ otpError: false });

        this.updatePhoneNumber()
      } else {
        this.setState({
          otpError: true,
          fetching: false,
          userEnterd_opt: '',
          showErrorModal: true,
        });
      }

    } else {
      this.setState({
        otpError: true,
        fetching: false,
        userEnterd_opt: '',
        showErrorModal: true,
      });
    }
  }


  handleOverlay = () => {
    let _props = this.props.navigation.state.params.userData
    const { isOverlayVisible } = this.state
    this.setState({
      isOverlayVisible: !isOverlayVisible,
      phoneNum: _props.maskedNumber, // when user Cancel/ don`t want to change ph num
      callingCode: _props.callingCode,// when user Cancel/ don`t want to change ph num
      newCallingCode: _props.newCallingCode,// when user Cancel/ don`t want to change ph num
      newContact:_props.newContact,// when user Cancel/ don`t want to change ph num
      sending: false,
      setDefaultValue: true,
      num_AlreadyUsed:false,

    })

  }

  handleContactChange = (value) => {
    let tempVal = ''
    tempVal = `${value.selectedCountry.code},${value.selectedCountry.dialCode}`

    this.setState({
      newContact: value.unmaskedPhoneNumber,
      phoneNum: value.phoneNumber,
      phoneNumError: !value.isVerified,
      isInvalidNum: false,
      newCca2: value.selectedCountry.code,
      newCallingCode: value.selectedCountry.dialCode,
      newCountryCode: tempVal,
      PhExist: false,
      setDefaultValue: false,  //important
    })
  }


  registerNewPhoneNumber = async () => {
    const {
      newCallingCode,
      newContact,
      newCca2,
      newCountryCode,

      oldContact,
      oldCallingCode,
      oldCca2,
      oldCountryCode,
      token,
      /***** user registered from website */
      oldPhoneNumber,
      maskedNumber,
      phoneNumError,
      
    } = this.state;

    if (!phoneNumError) {

      let oldPhone = ''
      let newPhone = newCallingCode + newContact

      if (this.state.user.mbl_country_code) {
        oldPhone = oldCallingCode + oldContact
      } else {
        oldPhone = oldPhoneNumber
      }

      let isPhoneExist = oldPhone.localeCompare(newPhone)
      if (isPhoneExist == 0) {
        this.setState({
          PhExist: true
        })
        return true

      } else if (!newContact) {
        this.setState({
          isInvalidNum: true
        })
        return true
      } else {
        this.setState({
          sending: true,
          recv_otp: ''
        })

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('old_phone_num', oldPhone);
        formData.append('phone_num', newCallingCode + newContact);
        formData.append('mbl_country_code', newCountryCode)

        const response = await petMyPalApiService.changePhoneNumber(token, formData).catch((e) => {
          this.setState({
            sending: false,
            isOverlayVisible: false,
            errorMsg: Capitalize(e.errors.error_text)

          })
        })
        const { data } = response;
        // console.log('otp sent ', data)
        if (data.api_status === 220) {
          this.setState({
            sending: false,
            recv_otp: data.otp,
            isOverlayVisible: false,
          })

        }else if(data.api_status ==400){
          this.handleOverlay()
          setTimeout(() => {
            this.setState({
              isModal_Visible:true,
              num_AlreadyUsed:true,
              infoText: Capitalize(data?.errors?.error_text)
            })
          },500);
        }
        
        else {
          this.setState({
            sending: false,
            isOverlayVisible: false,
            errorMsg: Capitalize(data?.errors?.error_text)

          })
        }

      }
    } else {
      this.setState({ isInvalidNum: true })
    }

  }



  updatePhoneNumber = async () => {
    const {
      token,
      newCallingCode,
      newContact,
      newCca2,
      newCountryCode
    } = this.state


    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('phone_number', newCallingCode + newContact)
    formData.append('mbl_country_code', newCountryCode)

    // console.log('sending data to server', formData,)


    const response = await petMyPalApiService.updateUserData(token, formData).catch((e) => {
      this.setState({
        isModal_Visible: true,
        infoText: Capitalize(e.errors.error_text)
      })
    })

    const { data } = response;

    if (data.api_status === 200) {

      this.setState({ fetching: false })
      /*********************** Redux update  ***************************/
      let infoChange = this.props.user
      let userData = this.props.user?.user_data
      userData.phone_number = newCallingCode + newContact
      userData.mbl_country_code = newCountryCode
      infoChange.user_data = userData

      this.props.updateUser(infoChange);
      /***************************************************************/
      this.props.navigation.pop()

    } else {
      this.setState({
        isModal_Visible: true,
        infoText: Capitalize(data.errors.error_text),
      })
    }
  }


  ///////////// Resend OTP API /////////////

  handleResendOtpPressed = async () => {
    const {
      resendOptions,

      newCallingCode,
      newCca2,
      newContact,
      newCountryCode,

      oldCallingCode,
      oldCca2,
      oldContact,
      oldCountryCode,
      token,
    } = this.state

    this.setState({ resendOptions: resendOptions + 1 })


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


    this.setState({ otpError: false });

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('old_phone_num', oldCallingCode + oldContact);
    formData.append('phone_num', newCallingCode + newContact);
    formData.append('mbl_country_code', newCountryCode)



    const response = await petMyPalApiService.changePhoneNumber(token, formData).catch((e) => {

      this.setState({
        isModal_Visible: true,
        infoText: Capitalize(e.errors.error_text)
      })
    })

    const { data } = response;

    if (data.api_status === 220) {
      this.setState({
        recv_otp: data.otp
      })
    } else {
      this.setState({
        isModal_Visible: true,
        infoText: Capitalize(data.errors.error_text)
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
      newCallingCode,
      newCca2,
      newContact,
      setDefaultValue,
      phoneNum,
      fetching,
      otpError,
      counter,
      isModal_Visible,
      showErrorModal,
      userEnterd_opt,
      PhExist,
      sending,
      isOverlayVisible,
      isInvalidNum,
      num_AlreadyUsed,


    } = this.state

    return (
      <Container>
        <Content style={{ flex: 1 }}>

          <MainLogoForSignUp
            heading={'Verify your phone number'}
            verifyText={'Verification code has been sent to your phone number'}
            // steps={2}
            cca2={newCca2}
            phoneNum={phoneNum}
            contact={phoneNum}
            // setDefaultValue={setDefaultValue}
            // defaultVlaue={newContact}
            goBack={() => this.props.navigation.pop()}
            callingCode={newCallingCode}
            exist={PhExist}

            error={isInvalidNum}
            sending={sending}
            handleOverlay={this.handleOverlay}
            showOverlay={isOverlayVisible}
            handleContactChange={this.handleContactChange} //parent call
            send_OTP_on_Num_Change={() => this.registerNewPhoneNumber()} ///// parent fun call

          // pageName={'verifyAccount'}
          />

          <View style={{ marginTop: Platform.OS == 'android' ? 60 : isIphoneX() ? -50 : 30 }}>

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
                    errorMsg={'Wrong varification code'}
                  />
                </View>
                : null
            }

            {fetching ? (
              <CustomLoader />
            ) : (
                <SkyBlueBtn
                  title={'Verify'}
                  onPress={() => this.handleTwoFactorPressed()}
                  btnContainerStyle={{ alignSelf: 'center' }}
                  disabled={userEnterd_opt.length == 4 ? false : true}
                />
              )}
          </View>

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

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(userEdit(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOTP);

const styles = StyleSheet.create({
  textInputContainer: {
    marginBottom: 20,
    paddingHorizontal: RFValue(40),
  },

  resendText: {
    textAlign: 'center',
    marginTop: 4,
    color: BLUE
  },
  timmerStyle: {
    color: BLUE,
    fontSize: 13
  }
})