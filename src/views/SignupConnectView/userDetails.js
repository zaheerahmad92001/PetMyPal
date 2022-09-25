import React, { Component, createRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { TEXT_INPUT_LABEL, grey, DANGER, black, HEADER, darkSky, placeholderColor, PINK, } from '../../constants/colors';
import { Icon, Container, Content, } from 'native-base';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import TextField from '../../components/common/TextField';
import _DropDown from '../../components/common/dropDown';
import { genderInfo, dobInfo, pronouns, ageText, passwordText } from '../../constants/ConstantValues';
import _DatePicker from '../../components/common/_DatePicker';
import InfoModal from '../../components/common/InfoModal';
import ErrorModal from '../../components/common/ErrorModal';
import Label from '../../components/common/Label'
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import requestRoutes from './../../utils/requestRoutes.json'; //'../../utils/requestRoutes';
import { OwnerName } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { SERVER, server_key } from '../../constants/server';
import { passwordValidate, validate } from '../../utils/RandomFuncs'
import { labelFont, textInputFont } from '../../constants/fontSize';
import { Capitalize } from '../../utils/RandomFuncs'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { passwordPolicy } from '../../constants/ConstantValues';
import { Platform } from 'react-native';
import CustomLoader from '../../components/common/CustomLoader';
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { LOGIN_USER, USER_DETAIL } from '../../constants/storageKeys';
import { THEME_BOLD_FONT } from '../../constants/fontFamily';

const window = Dimensions.get('window');

class UserDetails extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {

      date: new Date(),
      errorEmail: false,
      errorPronoun: false,
      errorDOB: false,
      over13Year:false,
      errorPassword: false,
      errorRePassword: false,
      errorAccept: false,
      password: false,
      confirm_password: false,
      isModal_Visible: false,
      isDatePicker_Visible: false,
      infoText: '',
      isPass_Visible: false,
      isConfirmPass_Visible: false,
      accept: false,
      gender: '',
      birthday: '',
      userDoB: '',
      pronounPlaceholder: true,
      ownerFirstName: '',
      ownerLastName: '',
      passPolicy: false,
      headerText: '',
      isErrorModal_Visible: false,
      errorMessage: '',
      fetching: false,
      User_age: '',
      isTermsCondVisible: false,
      maxDate: '',

      petBirthday: this.props?.navigation?.state?.params?.petBirthday,
      petGender: this.props?.navigation?.state?.params?.petGender,
      selectedPetSize: this.props?.navigation?.state?.params?.selectedPetSize,
      selectedSubPet: this.props?.navigation?.state?.params?.selectedSubPet,

    }
    this.webviewRef = createRef()

  }

  async componentDidMount() {

    var __date = new Date();
    var firstDay = new Date(__date.getFullYear(), __date.getMonth(), 1);
    var lastDay = new Date(__date.getFullYear(), __date.getMonth() + 1, 0);

    const ownerName = await AsyncStorage.getItem(OwnerName);
    let pet = JSON.parse(ownerName)
    this.setState({
      ownerFirstName: pet.fname,
      ownerLastName: pet.lname,
      maxDate: lastDay
    })

  }


  closeModal = () => {
    this.setState({
      isModal_Visible: false
    })
  }

  showDatePicker = () => {
    this.setState({ isDatePicker_Visible: true })
  }

  // hideDatePicker = () => {
  //   this.setState({ isDatePicker_Visible: false })
  // }

  // selectDate = (date) => {

  //   // let years = Math.round(moment.duration(moment().diff(moment(date))).asYears());

  //   // zaheer ahmad Dump it
  //   // const years = new Date().getFullYear() - new Date(date).getFullYear();

  //   // let dt = date.getDate()
  //   // let m = date.getMonth() + 1
  //   // let y = date.getFullYear()

  //   let c_d = new Date().getDate()
  //   let c_m = new Date().getMonth()
  //   let c_y = new Date().getFullYear()

  //   let user_date = moment(date).format("YYYY-MM-DD")
  //   let [y, m, d] = user_date.split('-')

  //   var a = moment([c_y, c_m, c_d]);
  //   var b = moment([y, m - 1, d]);
  //   var years = a.diff(b, 'years')

  //   b.add(years, 'years');

  //   var months = a.diff(b, 'months');
  //   b.add(months, 'months');

  //   var days = a.diff(b, 'days');

  //   this.setState({ User_age: years, date: date })

  //   // console.log(years + ' years ' + months + ' months ' + days + ' days');

  // }


  // handleDate = () => {
  //   this.setState({ isDatePicker_Visible: false })
  //   const { date } = this.state

  //   let dt = date.getDate()
  //   if (dt < 10) {
  //     dt = '0' + dt
  //   }

  //   let month = date.getMonth() + 1
  //   if (month < 10) {
  //     month = '0' + month
  //   }

  //   let year = date.getFullYear()

  //   let bd = `${month}/${dt}/${year}`
  //   let uDB = `${dt}-${month}-${year}`

  //   this.setState({
  //     birthday: bd,
  //     userDoB: uDB,
  //     errorDOB: false,
  //   })
  // }



  showModal = (value) => {

    value === 'dob' ?
      this.setState({
        isModal_Visible: true,
        infoText: dobInfo,
        passPolicy: false,
        headerText: 'Age Policy'
      })

      :

      value === 'gender' ?
        this.setState({
          isModal_Visible: true,
          infoText: genderInfo,
          passPolicy: false,
          headerText: 'Gender Policy'

        }) : null
  }

  showPassword = (value) => {
    this.setState({ isPass_Visible: !value })
  }

  show_confirm_Password = (value) => {
    this.setState({ isConfirmPass_Visible: !value })
  }

  handleTermsChange = (value) => {
    this.setState({ accept: !value, errorAccept: false })
  }
  handleAge =(value)=>{
    this.setState({over13Year:!value , errorDOB:false})
  }

  goBack = () => { this.props.navigation.pop()}

  handlePassword = (pass) => {

    this.setState({ password: pass })

    // if (!passwordValidate(pass)) {
    //   this.setState({ errorPassword: true })
    // }else{
    //   this.setState({ errorPassword: false })
    // }

    if(pass){
      if(pass.trim().length<8){
      this.setState({ errorPassword: true, })
      }else{
      this.setState({ errorPassword:false })
      }
    }else {
      this.setState({ errorPassword:true })
    }
  }


  handleConfirmPassword = (value) => {
    const { password } = this.state
    if (value != password) {
      this.setState({ errorRePassword: true, confirm_password: value })
    } else {
      this.setState({ errorRePassword: false, confirm_password: value })
    }
  }

  showPasswordPolicy = () => {
    this.setState({
      isModal_Visible: true,
      passPolicy: true,
      infoText: passwordPolicy,
      headerText: 'Password Policy'
    })

  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  closeErrorModal = () => {
    this.setState({ isErrorModal_Visible: false })
  }

  showTermsCondition = () => {
    const { isTermsCondVisible } = this.state
    this.setState({ isTermsCondVisible: !isTermsCondVisible })
  }

  handleUserDetailsPressed = () => {
    const {
      email,
      date, gender,
      birthday,
      password,
      confirm_password,
      errorRePassword,
      accept,
      User_age,
      over13Year,
    } = this.state

    let error = false

    let vlidateEmail = validate(email.trim())
    if (!vlidateEmail) {
      error = true
      this.setState({ errorEmail: true })
    }
    if (!(gender.trim().length > 0)) {

      error = true
      this.setState({ errorPronoun: true, })
    }
if(!over13Year){
  error = true
  this.setState({errorDOB:true})
}

    // if (!birthday) {
    //   error = true
    //   this.setState({ errorDOB: true, })
    // }

    // if (birthday) {
    //   // if (new Date().getFullYear() - new Date(date).getFullYear() < 14) {
    //   if (User_age && User_age < 14 || User_age == 0) {
    //     error = true
    //     this.setState({
    //       errorDOB: true,
    //       isErrorModal_Visible: true,
    //       errorMessage: 'You Must Be 14 Years Old To Sign Up'
    //     })
    //   }
    // }

    if(password){
      if(password.trim().length<8){
      this.setState({ errorPassword: true, })
      }else{
      this.setState({ errorPassword:false })
      }
    }else {
      this.setState({ errorPassword:true })
    }

    // if (!passwordValidate(password)) {
    //   error = true
    //   this.setState({ errorPassword: true, })
    // }

    if (!confirm_password) {
      this.setState({ errorRePassword: true, })
    }

    if (password != confirm_password) {
      this.setState({ errorRePassword: true, })
      error = true
    }

    if (!accept) {
      error = true
      this.setState({ errorAccept: true, })
    }

    if (!error) {
      if (password === confirm_password) {
        this.handleUpdateAccount()
      }
    }

  }

  //////////// Update Account API ////////////////////

  async handleUpdateAccount() {
    let user = {}
    this.setState({ fetching: true, });
    const {
      password,
      confirm_password,
      email,
      gender,
      birthday,
      selectedSubPet,
      selectedPetSize,
      petBirthday,
      petGender,
      userDoB,
      over13Year,

    } = this.state;

    user = {
      password,
      confirm_password,
      email,
      gender,
      userDoB
    }
    await AsyncStorage.setItem(USER_DETAIL, JSON.stringify(user))

    const data = new FormData();
    data.append('server_key', server_key);
    data.append('password', password);
    data.append('confirm_password', confirm_password);
    data.append('email', email.trim().toLocaleLowerCase());
    data.append('gender', gender);
    // data.append('dob', userDoB);
    data.append('dob','0000-00-00');
    data.append('dob_check',over13Year);
    data.append('sub_type', selectedSubPet);
    data.append('pet_size', selectedPetSize.index);
    data.append('pet_dob', petBirthday);
    data.append('pet_gender', petGender);
    this.requestHandlerUpdate('update-account', data);


  }

  async requestHandlerUpdate(type, data) {
    let TOKEN = null;
    this.getAccessToken()
      .then(token => {
        TOKEN = JSON.parse(token).access_token;
        // console.log('token update account', TOKEN)
      })
      .then(() => {
        return fetch(
          SERVER + requestRoutes[type].route + '?access_token=' + TOKEN,
          {
            method: requestRoutes[type].method,
            body: data,
            headers: {},
          },
        ).then((response) => response.json())
          .then(responseJson => {
            // console.log('Responese Json update account  ', responseJson);
            // console.log('response userDetails', responseJson);
            if (responseJson.api_status == 200) {

              this.setState({ fetching: false });
              this.props.navigation.navigate('AppNavigator');
            } else if (responseJson.api_status == 400) {
              this.setState({
                fetching: false,
                isErrorModal_Visible: true,
                // errorMessage:'Something went wrong'
                errorMessage: Capitalize(responseJson?.errors?.error_text)
              });
            }
            else {
              this.setState({
                fetching: false,
                isErrorModal_Visible: true,
                errorMessage: Capitalize(responseJson?.errors?.error_text)
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  render() {

    const {
      date,
      errorEmail,
      errorPronoun,
      errorDOB,
      errorPassword,
      errorRePassword,
      errorAccept,
      password,
      isModal_Visible,
      confirm_password,
      infoText,
      isDatePicker_Visible,
      birthday,
      isPass_Visible,
      accept,
      email,
      gender,
      isConfirmPass_Visible,
      pronounPlaceholder,
      ownerFirstName,
      ownerLastName,
      passPolicy,
      headerText,
      isErrorModal_Visible,
      errorMessage,
      fetching,
      isTermsCondVisible,
      maxDate,
      over13Year,

    } = this.state
    return (
      <Container style={styles.wraper}>
        <Content>
          <MainLogoForSignUp
            text={`A little more about yourself`}
            petName={`${ownerFirstName} ${ownerLastName}`}
            steps={5}
            heading={'Create Account'}
            headingContainer={{ marginTop: 5 }}
          />

          <View style={styles.petDetailsForm}>

            <TextField
              label={"Your Email"}
              placeholder={'Email'}
              value={email}
              error={errorEmail}
              onChangeText={(text) => this.setState({ email: text, errorEmail: false })}
              containerStyle={{ marginBottom: 2 }}
            />
            <Label
              text={'You will use this to login.'}
              style={{ ...styles.bdyText }}
            />

            <Label text={'Your Pronoun'} style={errorPronoun ? [styles.errorLabel] : styles.label} />
            <View style={errorPronoun ? [styles.pronounView, { borderBottomColor: DANGER }]
              : [styles.pronounView]
            }>
              <_DropDown
                data={pronouns}
                selectedValue={gender}
                renderAccessory={null}
                staticValue={'Pronoun'}
                inputStyle={{ borderWidth: 0 }}
                dropdownPosition={-4.5}
                placeholder={pronounPlaceholder}
                style={{ flex: 1, borderBottomWidth: 0, backgroundColor: null }}
                pickerStyle={{ width: wp(95), marginLeft: 5, borderBottomWidth: 0 }}
                onChangeText={(value, index, data) => {
                  this.setState({
                    gender: value,
                    errorPronoun: false,
                    pronounPlaceholder: false
                  })
                }}

              />
              <Icon
                onPress={() => this.showModal('gender')}
                name={'questioncircle'}
                type={'AntDesign'}
                style={styles.iconColor}
              />
            </View>

            <View style={styles.ageView}>
              {/* <Text style={errorDOB? [[styles.ageStatement,{color:DANGER}]]: [styles.ageStatement] }>{'Are you over 13 years of age'}</Text> */}
              <CheckBox
                title="Are you over 13 years of age"
                containerStyle={{
                  backgroundColor: 'null',
                  borderWidth: 0,
                  left: -20,
                  marginTop: 10
                }}
                checkedColor={darkSky}
                textStyle={{ color: errorDOB ? 'red' : 'grey', fontSize: labelFont, fontWeight: '500' }}
                onPress={() => this.handleAge(over13Year)}
                checked={over13Year}
              />
            </View>
            <Label
              text={ageText}
              style={{ ...styles.bdyText }}
            />

            {/* <Label text={'Date of Birth'}
              style={errorDOB ? [styles.errorLabel, { marginTop: 20 }] : [styles.label, { marginTop: 20 }]}
            />
            <View style={
              errorDOB ?
                [styles.dateView, { borderBottomColor: DANGER }] :
                styles.dateView
            }>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.showDatePicker()}
              >
                <Text style={
                  birthday ?
                    [styles.dateStyle] :
                    [styles.placeholderStyle]
                }>{birthday ? birthday : 'Date of birth'}</Text>
              </TouchableOpacity>
              <Icon
                onPress={() => this.showModal('dob')}
                name={'questioncircle'}
                type={'AntDesign'}
                style={styles.iconColor}
              />
            </View>
            
            <Label 
              text={'Your birthday date will not be shown publicly.'}
              style={{...styles.bdyText}}
            /> */}

            <TextField
              label={"Password"}
              // policy={true}
              placeholder={'Password'}
              value={password}
              error={errorPassword}
              // showPolicy={() => this.showPasswordPolicy()}
              onChangeText={(text) => this.handlePassword(text)}
              onIconPress={() => this.showPassword(isPass_Visible)}
              iconName={isPass_Visible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!isPass_Visible}
              style={{ color: isPass_Visible ? darkSky : TEXT_INPUT_LABEL }}
              iconType={'Entypo'}
              containerStyle={{ marginBottom: 2 }}
            />
            <Label
              text={passwordText}
              style={{ ...styles.bdyText }}
            />


            <TextField
              label={"Re-Password"}
              placeholder={'Re-type Password'}
              value={confirm_password}
              error={errorRePassword}
              onChangeText={(text) => this.handleConfirmPassword(text)}
              onIconPress={() => this.show_confirm_Password(isConfirmPass_Visible)}
              iconName={isConfirmPass_Visible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!isConfirmPass_Visible}
              style={{ color: isConfirmPass_Visible ? darkSky : TEXT_INPUT_LABEL }}
              iconType={'Entypo'}
              containerStyle={{ marginBottom: 0 }}
            />

            <View style={styles.termsView}>
              <CheckBox
                title="Accept terms and conditions"
                containerStyle={{
                  backgroundColor: 'null',
                  borderWidth: 0,
                  left: -20,
                  marginTop: 10
                }}
                checkedColor={darkSky}
                textStyle={{ color: errorAccept ? 'red' : 'grey', fontSize: labelFont, fontWeight: '500' }}
                onPress={() => this.handleTermsChange(accept)}
                checked={accept}
              />
              <Icon
                name={'info-with-circle'}
                type={'Entypo'}
                style={styles.InfoiconStyle}
                onPress={() => this.showTermsCondition()}
              />
            </View>

          </View>

          {fetching ?
            <CustomLoader />
            :
            <View style={styles.btnView}>
              <SkyBlueBtn
                title={'Next'}
                onPress={() => this.handleUserDetailsPressed()}
              />

            </View>
          }

          <InfoModal
            isVisible={isModal_Visible}
            onBackButtonPress={() => this.closeModal()}
            info={infoText}
            headerText={headerText}
            policy={passPolicy}
            onPress={() => this.closeModal()}
          />

          {/* <_DatePicker
            date={date}
            isVisible={isDatePicker_Visible}
            header={'Select Date of Birth'}
            onDateChange={this.selectDate}
            onSelect={this.handleDate}
            onClose={this.hideDatePicker}
            maxDate={maxDate}
          /> */}

          <ErrorModal
            isVisible={isErrorModal_Visible}
            onBackButtonPress={() => this.closeErrorModal()}
            info={errorMessage}
            heading={'Hoot!'}
            onPress={() => this.closeErrorModal()}
          />

          <Overlay
            isVisible={isTermsCondVisible}
            useNativeDriver={true}
            animationIn={5000}
            animationInTiming={5000}
            animationOut={5000}
            overlayStyle={styles.overlayStyle}
          >
            <View style={styles._webView}>
              <View style={styles.closeView}>
                <Icon
                  onPress={() => this.showTermsCondition()}
                  name={'closecircleo'}
                  type={'AntDesign'}
                  style={styles.closeIcon}
                />
              </View>
              <WebView
                useWebKit={true}
                source={{ uri: `${SERVER}/terms/terms` }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                sharedCookiesEnabled={true}
                originWhitelist={['http://*', 'https://*', 'intent://*']}
                scalesPageToFit={true}
                startInLoadingState={true}
                mixedContentMode={"always"}
                allowsInlineMediaPlayback={true}
                allowsFullscreenVideo={true}
                allowsBackForwardNavigationGestures={true}
                allowsLinkPreview={false}
                renderLoading={() => (
                  <CustomLoader />
                )
                }
                ref={this.webviewRef}
                onNavigationStateChange={(navState) => {
                  // this.setState({canGoBack:navState.canGoBack})
                  // console.log('navigation state change ' ,navState.canGoBack)
                }}
              />
            </View>

          </Overlay>


        </Content>
      </Container>
    );
  }
};

export default UserDetails;

const styles = StyleSheet.create({
  wraper: {
    flex: 1
  },
  petDetailsForm: {
    marginHorizontal: 15,
    marginTop: Platform.OS == 'android' ? 15 : 0,
    marginBottom: 15,
  },
  pronounView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: grey,
    borderBottomWidth: 1,
    marginTop: 3
  },
  iconColor: {
    fontSize: 20,
    color: TEXT_INPUT_LABEL,
    width: wp(10),
    textAlign: 'center'
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: grey

  },
  errorLabel: {
    color: DANGER
  },
  label: {
    color: grey,
    fontSize: 14,
  },
  btnView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  placeholderStyle: {
    color: placeholderColor,
    fontSize: textInputFont,
  },
  dateStyle: {
    color: black,
    fontSize: textInputFont,
  },
  termsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  InfoiconStyle: {
    color: TEXT_INPUT_LABEL,
    fontSize: 22,
    textAlign: 'center',
    marginTop: 10,
  },
  overlayStyle: {
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    // marginLeft: 25, 
    // marginRight: 25,
    width: wp(100),
    height: '100%',
    paddingLeft: 0,
    paddingBottom: 0,
    paddingTop: 0,
    paddingRight: 0
  },
  _webView: {
    width: wp(99),
    height: '99%',
  },
  closeIcon: {
    fontSize: 25,
    color: darkSky,
  },
  closeView: {
    marginTop: 50,
    alignSelf: 'flex-end',
    marginRight: 30,
    paddingVertical: 20,
    backgroundColor: 'transparent'
  },
  bdyText: {
    marginTop: 2,
    fontSize: 12,
    color: darkSky,
    marginBottom: 20,
  },
  ageView:{
    flexDirection:'row',
    alignItems:'center',
    // justifyContent:'center',
  },
  ageStatement:{
    color:grey,
    fontSize:14,
    fontWeight:'500',
    marginRight:15,
  }

});