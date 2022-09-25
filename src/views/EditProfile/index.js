import React, { Fragment } from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Icon } from 'native-base';
import axios from 'axios';
import styles from './styles';
import { connect } from 'react-redux';
import _ from 'lodash';
import ImagePicker from 'react-native-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import moment from 'moment';
import {
  black,
  darkSky,
  grey,
} from '../../constants/colors';
import { Item, Label } from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ScrollViewIndicator from 'react-native-scroll-indicator';
import RadioForm from 'react-native-simple-radio-button';
import WhiteBtn from '../../components/common/WhiteBtn';
import {
  Contact_Person_Icon,
  dobInfo,
  defaultImage,
  pronouns,
  genderInfo,
} from '../../constants/ConstantValues';
import TextField from '../../components/common/TextField';
import DatePickerField from '../../components/common/DatePickeField';
import _DatePicker from '../../components/common/_DatePicker';
import InfoModal from '../../components/common/InfoModal';
import ErrorModal from '../../components/common/ErrorModal';

import ChangePhoneNumber from '../../components/ChangePhoneNum';
import { Capitalize, validateNumber } from '../../utils/RandomFuncs';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
const { petOwnerData, petOwnerNewsFeed } = petMyPalApiService;
import { NavigationEvents } from 'react-navigation';
import { LongAboutParseHtml } from '../../components/helpers';
import _DropDown from '../../components/common/dropDown';
import { Divider } from 'react-native-elements'
import { labelFont, textInputFont } from '../../constants/fontSize';



var radio_btn_props = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

class EditProfile extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: this?.props?.user?.user_data,
      user_id: this?.props?.user?.user_data.user_id,
      first_name: this?.props?.user?.user_data.first_name,
      last_name: this?.props?.user?.user_data.last_name,
      email: this?.props?.user?.user_data.email,
      dob: this?.props?.user?.user_data.birthday,
      gender: this?.props?.user?.user_data.gender,
      about: this?.props?.user?.user_data.about,
      token: '',
      avatarImage: { type: 'image/jpeg' },
      coverImage: { type: 'image/jpeg' },
      show: false,
      first_nameError: false,
      last_nameError: false,
      genderError: false,
      dobError: false,
      emailError: false,
      aboutError: false,
      submit: false,
      loading: false,
      isDatePicker_Visible: false,
      isModal_Visible: false,
      passPolicy: false,
      headerText: 'Age Policy',
      infoText: '',
      date:'',
      User_age: '',
      maxdate: '',
      errorPronoun: false,
      pronounPlaceholder:false,
      showGenderPolicy:false,

      /********  change password *******/
      changePhoneOverlay: false,
      cca2: '',
      callingCode: '',
      contact: '',
      countryCode: '',
      countryList: [],
      country_id: this.props?.user?.user_data?.country_id ?? '',
      CountryName: '',
      oldPhoneNumber: '' /**** if user registerd from website. in this case we dont have country code use this pram ****/,

      sending: false,
      phError: false,
      isInvalidNum: false,

      // newContact: this?.props?.user?.user_data?.phone_number ?? '',
      newContact: '',
      newCca2: 'US',
      newCallingCode: '',
      newCountryCode: '',

      /********  error Modal *******/
      isErrorModalVisible: false,
      errorMsg: '',
      maskedNumber: '',
      setDefaultValue: true,
      PhExist: false,
      customDesign: [
        {
          screenName: 'ChangePassword',
          title: 'Change Password',
          icon: 'lock',
          iconBackground: '#fb3153',
        },
        {
          screenName: undefined,
          title: 'Change Phone Number',
          icon: 'phone',
          iconBackground: '#f1c71f',
        },
        {
          screenName: 'Notification',
          title: 'Notification Settings',
          icon: 'bell',
          iconBackground: '#61dcbf',
        },
        {
          screenName: 'PrivacyPolicy',
          title: 'Privacy Settings',
          icon: 'key',
          iconBackground: '#5954d2',
        },
        {
          screenName: 'BlockUsers',
          title: 'Block Users',
          icon: 'ban',
          iconBackground: '#050505',
        },
        {
          screenName: 'DeactivateUser',
          title: 'Deactivate Account',
          icon: 'ban',
          iconBackground: '#EC293A'
        },
      ],
      showGeneralSettings: false,
      showImages: false,
      user_name: this?.props?.user?.user_data?.username ?? '',
      user_nameError: false,
      Placeholder: true,

    };
  }
  windowWidth = Dimensions.get('window').width;
  windowHeight = Dimensions.get('window').height;

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  componentDidMount() {

    var User_birthday = this.props?.user?.user_data?.birthday
    var maxDate =''
    if(Platform.OS =='ios'){
      // maxDate= moment(User_birthday,'YYYY-MM-DD').format('MM-DD-YYYY')
      maxDate =User_birthday
    }else{
      maxDate =User_birthday
    }

    this.countryNames();
    this.checkDate(User_birthday)

    if (this.state?.user?.mbl_country_code) {

      let [country, code] = this.state.user.mbl_country_code.split(',');
      let _num = this.state?.user?.phone_number ?? '';
      let codeLength = code.length;

      let num = _num.slice(codeLength);

      let tempVal = '';
      tempVal = `${country},${code}`;

      this.setState({
        cca2: country,
        callingCode: code,
        contact: num,
        countryCode: tempVal,
        /************ update phone number */
        newContact: num,
        newCallingCode: code,
        newCca2: country, 
        newCountryCode: tempVal,
        // For date Picker 

        // maxdate : new Date(maxDate) ,
        // date: new Date(maxDate)

        maxdate : moment(maxDate).toDate(),
        date: moment(maxDate).toDate()

      });
    } else {
      /***********if user registered from website device ***********/
      this.setState({
        oldPhoneNumber: this.state?.user?.phone_number ?? '',
        // For date Picker 
        // maxdate : new Date(maxDate) ,
        // date: new Date(maxDate)

        maxdate : moment(maxDate).toDate() ,
        date: moment(maxDate).toDate()
      });
    }

    this.getAccessToken().then(TOKEN => {
      this.setState({ token: JSON.parse(TOKEN).access_token });
    });
  }

checkDate =(date)=>{
  let c_d = new Date().getDate()
  let c_m = new Date().getMonth()
  let c_y = new Date().getFullYear()

  let user_date = moment(date).format("YYYY-MM-DD")
  let [y,m,d] = user_date.split('-')

  var a = moment([c_y, c_m, c_d]);
  var b = moment([y, m-1 , d]);
  var years = a.diff(b,'years')

  b.add(years, 'years');

  var months = a.diff(b, 'months');
  b.add(months, 'months');

  var days = a.diff(b, 'days');

  // console.log(years + ' years ' + months + ' months ' + days + ' days');
  this.setState({
    User_age: years
  })
}



  countryNames = async () => {
    const formData = new FormData();
    formData.append('server_key', server_key);
    await axios
      .post(`${SERVER}/api/get-countries`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        if (response?.status == 200) {
          let array = response.data?.countries ?? [];
          let newArray = [];
          array.forEach(element => {
            element = { ...element, value: element.id, label: element.name };
            newArray.push(element);
          });
          this.setState({ countryList: newArray ?? [] }, () => {
            this.handleCountry()
          });
        }
      });
  };
  goBack = () => {
    this.props.navigation.pop();
  };

  handleFirstName = t => {
    this.setState({
      submit: true,
      first_name: t,
      first_nameError: false,
    });
  };
  handleUserName = t => {
    this.setState({
      submit: true,
      user_name: t,
      user_nameError: false,
    });
  };

  handleLastName = t => {
    this.setState({
      submit: true,
      last_name: t,
      last_nameError: false,
    });
  };

  handleEmail = t => {
    this.setState({
      submit: true,
      email: t,
      emailError: false,
    });
  };


  // showDatePicker = () => { 
  //   this.setState({ 
  //     isDatePicker_Visible: true 
  //   })};

  


  // selectDate = date => {
  //   // ! not working in debug apk
  //   //  let years = Math.round(moment.duration(moment().diff(moment(date))).asYears());


  //   // zaheer ahmad Dump it
  //   // const years = new Date().getFullYear() - new Date(date).getFullYear();
  //   // console.log('years checing' ,years)

  //   let c_d = new Date().getDate()
  //   let c_m = new Date().getMonth()
  //   let c_y = new Date().getFullYear()

  //   let user_date = moment(date).format("YYYY-MM-DD")
  //   let [y,m,d] = user_date.split('-')

  //   var a = moment([c_y, c_m, c_d]);
  //   var b = moment([y, m-1 , d]);
  //   var years = a.diff(b,'years')

  //   b.add(years, 'years');

  //   var months = a.diff(b, 'months');
  //   b.add(months, 'months');

  //   var days = a.diff(b, 'days');

  //   this.setState({
  //     dob: moment(date).format('MM/DD/YYYY'),
  //     date: date,
  //     submit: true,
  //     User_age: years
  //   });
  // };

  // hideDatePicker = () => {
  //   this.setState({ isDatePicker_Visible: false, submit: true });
  // };

  showModal = () => {
    this.setState({
      isModal_Visible: true,
      infoText: dobInfo,
      passPolicy: false,
      headerText: 'Age Policy',

    });
  };

  closeModal = () => {
    this.setState({
      isModal_Visible: false,
    });
  };

  showGenPolicy=()=>{
    this.setState({
      showGenderPolicy:true,
      infoText:genderInfo,
      passPolicy: false,
      headerText: 'Gender Policy',
    })}

    hideGenPolicy=()=>{
      this.setState({
        showGenderPolicy:false,
      })}



  change_Phone_Overlay = () => {
    const {
      changePhoneOverlay,
      callingCode,
      contact,
      cca2,
      countryCode
    } = this.state;
    this.setState({
      changePhoneOverlay: !changePhoneOverlay,
      setDefaultValue: true,
      newCallingCode: callingCode,
      newCca2: cca2,
      newCountryCode: countryCode,
      newContact: contact,
      sending: false,

    });
  };

  handleChangeContact = value => {
    let newTempVal = '';
    newTempVal = `${value.selectedCountry.code},${value.selectedCountry.dialCode}`;

    this.setState({
      newContact: value.unmaskedPhoneNumber,
      phError: !value.isVerified,
      maskedNumber: value.phoneNumber, // masked Value
      newCca2: value.selectedCountry.code,
      newCallingCode: value.selectedCountry.dialCode,
      newCountryCode: newTempVal,
      setDefaultValue: false, // important
      PhExist: false,
      isInvalidNum: false,
    });
  };

  closeErrorModal = () => {
    this.setState({ isErrorModalVisible: false });
  };

  registerNewPhoneNumber = async () => {
    const {
      newCallingCode,
      newContact,
      newCca2,
      newCountryCode,

      callingCode,
      contact,
      cca2,
      countryCode,
      token,
      /***** user registered from website */
      oldPhoneNumber,
      maskedNumber,
      phError,
      showGenderPolicy,
    } = this.state;

    let userData = {
      oldContact: contact,
      oldCca2: cca2,
      oldCallingCode: callingCode,
      oldCountryCode: countryCode,
      oldPhoneNumber: oldPhoneNumber,

      newContact,
      newCca2,
      newCallingCode,
      newCountryCode,
      maskedNumber,
    };

    if (!phError) {

      let oldPhone = ''
      let newPhone = newCallingCode + newContact
      if (this.state.user.mbl_country_code) {
        oldPhone = callingCode + contact

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
        this.setState({ sending: true })

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('old_phone_num', oldPhone);
        formData.append('phone_num', newCallingCode + newContact);
        formData.append('mbl_country_code', newCountryCode)
        const response = await petMyPalApiService.changePhoneNumber(token, formData).catch((e) => {
          this.setState({
            sending: false,
            changePhoneOverlay: false,
            isErrorModalVisible: true,
            errorMsg: Capitalize(e.errors.error_text)

          })
        })
        // console.log('response update phone', response);
        const { data } = response;

        if (data.api_status === 220) {
          this.setState({
            sending: false,
            changePhoneOverlay: false,
          },
            () => this.props.navigation.navigate('VerifyOTP', {
              userData,
              user_id: this.state.user_id,
              otp: data.otp
            })
          )
        } else if (data.api_status == 400) {
          this.change_Phone_Overlay()
          setTimeout(() => {
            this.setState({
              isErrorModalVisible: true,
              errorMsg: Capitalize(data?.errors?.error_text)
            })
          }, 500);
        } else {
          this.setState({
            sending: false,
            changePhoneOverlay: false,
            isErrorModalVisible: true,
            errorMsg: Capitalize(data?.errors?.error_text)
          })
        }

      }
    } else {
      this.setState({ isInvalidNum: true })
    }

  };

  handleGender = gender => {
    this.setState({
      gender,
      submit: true,
    });
  };

  handleAboubMe = t => {
    this.setState({
      submit: true,
      about: t,
    });
  };

  handleImageChange = i => {
    const options = {
      title: 'Select ' + i,
      storageOptions: {
        skipBackup: true,
        path: 'image',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const image = {
          name: response.fileName,
          type: 'image/jpeg',// ! Here is type null that we recieve from imagepicker so i hard code that type.
          uri: response.uri,
        };
        switch (i) {
          case 'Avatar':
            this.setState({
              avatarImage: image,
              submit: true,
            });
            break;
          case 'Cover':
            this.setState({
              coverImage: image,
              submit: true,
            });
            break;
          default:
            break;
        }
      }
    });
  };

  validateForm = () => {
    let first_nameError,
      last_nameError,
      genderError,
      dobError,
      emailError,
      user_nameError,
      aboutError = false;
    const {
      first_name,
      last_name,
      gender,
      dob,
      email,
      user_name,
      about,
      User_age
    } = this.state;


    if (user_name === '') {
      user_nameError = true;
    } else {
      user_nameError = false;
    }
    if (first_name === '') {
      first_nameError = true;
    } else {
      first_nameError = false;
    }

    // if (last_name === '') {

    //   this.setState({
    //     loading: false,
    //     isErrorModalVisible: true,
    //     errorMsg: 'Last Name Must Be Between 5 And 32 Characters'
        
    //   })
    //   last_nameError = true;
    // } else {
      
    //   last_nameError = false;
    // }

    if (gender === '') {
      genderError = true;
    } else {
      genderError = false;
    }

    if (email === '') {
      emailError = true;
    } else {
      emailError = false;
    }

    // if (dob === '') {
    //   dobError = true;
    // } else if (User_age && User_age < 14 || User_age==0) {
    //   dobError = true;
    //   this.setState({
    //     isErrorModalVisible: true,
    //     errorMsg: 'You Must Be 14 Years Old To Sign Up.'
    //   })
    // }
    // else {
    //   dobError = false;
    // }
    
    this.setState({
      first_nameError,
      last_nameError,
      genderError,
      dobError,
      emailError,
      aboutError,
      user_nameError,
    });
    if (
      first_nameError ||
      last_nameError ||
      genderError ||
      dobError ||
      emailError ||
      aboutError ||
      user_nameError
    ) {
      return false;
    } else {
      return true;
    }
  };

  nameCharacters() {
    const { first_name, last_name, user_name } = this.state;
    if (first_name != '' && first_name.length < 5) {
      this.setState({
        loading: false,
        isErrorModalVisible: true,
        errorMsg: 'First Name Must Be Between 5 And 32 Characters'
      });
      return false;
    }
    // else if (last_name != '' && last_name.length < 5) {
    //   this.setState({
    //     loading: false,
    //     isErrorModalVisible: true,
    //     errorMsg: 'Last Name Must Be Between 5 And 32 Characters'
    //   });
    //   return false;
    // }
    else if (user_name != '' && user_name.length < 5) {
      this.setState({
        loading: false,
        isErrorModalVisible: true,
        errorMsg: 'Username Must Be Between 5 And 32 Characters'
      });
      return false;
    }

    return true;


  }

  handleSubmit = async type => {
    const {
      first_name,
      last_name,
      gender,
      dob,
      email,
      about,
      avatarImage,
      coverImage,
      token,
      submit,
      user_name,
      country_id,
    } = this.state;
    if (submit) {
      if (this.validateForm() && this.nameCharacters()) {
        this.setState({
          loading: true,
        });
        try {

          let userUpdate = {};
          const formData = new FormData();
          formData.append('server_key', server_key);
          if (first_name !== '') {
            formData.append('first_name', first_name);
            userUpdate.first_name = first_name;
          }
          if (country_id != '') {
            formData.append('country_id', country_id);
            userUpdate.country_id = country_id;
          }
          if (last_name !== '') {
            formData.append('last_name', last_name);
            userUpdate.last_name = last_name;
          }
          if (user_name != '') {
            formData.append('username', user_name);
            userUpdate.username = user_name;
          }

          if (about) {
            formData.append('about', about);
            userUpdate.about = about;
          } else {
            formData.append('about', about);
            userUpdate.about = '';
          }

          if (gender !== '') {
            formData.append('gender', gender);
            userUpdate.gender = gender;
          }
          if (dob !== '') {
            formData.append('birthday', dob);
            userUpdate.birthday = dob;
          }
          if (email !== '') {
            formData.append('email', email);
            userUpdate.email = email;
          }
          if (!_.isEmpty(avatarImage.uri)) {
            formData.append('avatar', avatarImage);
            userUpdate.avatar = avatarImage;
          }
          if (!_.isEmpty(coverImage.uri)) {
            formData.append('cover', coverImage);
            userUpdate.cover = coverImage;
          }

          const response = await petMyPalApiService
            .updateUserData(token, formData)
            .catch(e => {
              this.setState({
                isErrorModalVisible: true,
                errorMsg: e.errors.error_text,
              });
            });
          const { data } = response;
          if (data?.api_status === 200) {
            this.setState({ loading: false });
            this.props.petOwnerData(this.state.token, this.state.user_id);
            this.props.petOwnerNewsFeed(
              this.state.token,
              'get_news_feed',
              false,
              'firstTimeLoadData',
            );
            this.props.navigation.pop();
          } else {
            console.warn('error while updating user Profile', data);

            this.setState({
              loading: false,
              isErrorModalVisible: true,
              errorMsg: 'Username Must Be Between 5 And 32 Characters'
              // errorMsg: data.errors.error_text,
            });
          }
        } catch (e) {
          this.setState({
            loading: false,
          });
          Alert.alert('', 'Request Failed');
          console.log(e);
        }
        // }
      }
    }
  };

  UserDataFromStore = () => {
    this.setState({
      user: this?.props?.user?.user_data,
      user_id: this?.props?.user?.user_data.user_id,
      username: this?.props?.user?.user_data.username,
      first_name: this?.props?.user?.user_data.first_name,
      last_name: this?.props?.user?.user_data.last_name,
      email: this?.props?.user?.user_data.email,
      dob: this?.props?.user?.user_data.birthday,
      gender: this?.props?.user?.user_data.gender,
      about: this?.props?.user?.user_data.about,
    });
  };

  selectedCountry = data => {
    this.setState({
      country_id: data,
      submit: true,
      Placeholder: false
    });
  };
  handleCountry = () => {
    var find = this.state.countryList.find(
      item =>
        item.id == this.state.country_id,
    );
    if (find?.label) {
      this.setState({
        CountryName: find?.label,
        Placeholder: false,
      })
    }
    // return find?.label ?? '';
  };
  render() {
    const {
      user,
      dob,
      avatarImage,
      coverImage,
      first_nameError,
      last_nameError,
      emailError,
      dobError,
      first_name,
      last_name,
      email,
      date,
      isDatePicker_Visible,
      isModal_Visible,
      passPolicy,
      headerText,
      infoText,
      about,
      /***********  change Phone  *******/
      changePhoneOverlay,
      newCallingCode,
      newCca2,
      newContact,
      phError,
      sending,
      /***********  error Modal  *******/
      isErrorModalVisible,
      errorMsg,
      setDefaultValue,
      PhExist,
      isInvalidNum,
      user_name,
      user_nameError,
      Placeholder,
      maxdate,
      errorPronoun,
      CountryName,
      gender,
      pronounPlaceholder,
      showGenderPolicy,
    } = this.state;

  //   console.log('render maxdate', moment(date.toString()).toDate());
  //  console.log('moment("2022-02-24").toDate()' ,moment("2022-02-24").toDate()); 

    let year = '';
    let month = '';
    if (user?.registered) {
      [month, year] = user?.registered.split('/');
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollViewIndicator
          shouldIndicatorHide={false}
          flexibleIndicator={false}
          scrollIndicatorStyle={{ backgroundColor: darkSky }}
          scrollIndicatorContainerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}>
          {this.state.loading && <View style={{ position: 'absolute', top: wp(15), width: '100%', justifyContent: 'center', zIndex: 1 }}><PlaceholderLoader /></View>}

          <NavigationEvents onDidFocus={() => this.UserDataFromStore()} />

          <Image
            source={{ uri: user?.cover ? user?.cover : Contact_Person_Icon }}
            style={styles.coverImg}
          />
          <View style={styles.header}>
            <Icon
              onPress={() => this.goBack()}
              name={'chevron-back'}
              type="Ionicons"
              style={{ color: darkSky, fontSize: 24 }}
            />
            <Text
              style={
                defaultImage === user?.cover
                  ? [styles.headerText, { color: black }]
                  : [styles.headerText]
              }>
              Edit Profile
            </Text>
          </View>

          <View style={styles.cardView}>
            <View style={styles.cardStyle}>
              <View style={styles.cardView}>
                <View style={styles.imgView}>
                  <Image
                    style={styles.imgStyle}
                    source={{
                      uri: user?.avatar ? user.avatar : Contact_Person_Icon,
                    }}
                  />
                </View>
              </View>

              <View style={{ marginVertical: wp(3) }}>
                <Text style={styles.nameStyle}> {user?.name}</Text>
                <Text style={styles.joiningDate}>
                  Member Since: {user?.registered?.split('/')[1]}
                </Text>
              </View>

              <WhiteBtn
                title={'SAVE'}
                onPress={() => this.handleSubmit('update-user-data')}
                btnContainerStyle={styles.btnContainerStyle}
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                ...styles.viewForInput,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,

                elevation: 11,
                borderRadius: 10,
              }}>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showGeneralSettings: !this.state.showGeneralSettings,
                  })
                }
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.heading}>General Setting</Text>
                <View
                  // onPress={() =>
                  //   this.setState({
                  //     showGeneralSettings: !this.state.showGeneralSettings,
                  //   })
                  // }
                  style={{ flexGrow: 1, alignItems: 'flex-end' }}>
                  <Icon
                    name={this.state.showGeneralSettings ? 'down' : 'right'}
                    type="AntDesign"
                    style={{ color: '#aeaeae', fontSize: wp(4) }}
                  />
                </View>
              </TouchableOpacity>

              {this.state.showGeneralSettings && (
                <View style={{ marginTop: 15 }}>
                  <TextField
                    label={'First Name'}
                    placeholder={'Enter First Name'}
                    onChangeText={t => this.handleFirstName(t)}
                    value={first_name}
                    error={first_nameError}
                  />
                  <TextField
                    label={'Last Name'}
                    placeholder={'Enter Last Name'}
                    onChangeText={t => this.handleLastName(t)}
                    value={last_name}
                    error={last_nameError}
                  />
                  <TextField
                    label={'User Name'}
                    placeholder={'Enter User Name'}
                    onChangeText={t => this.handleUserName(t)}
                    value={user_name}
                    error={user_nameError}
                  />
                  <TextField
                    label={'Email'}
                    placeholder={'john@Doe.com'}
                    onChangeText={t => this.handleEmail(t)}
                    value={email}
                    editable={false}
                    error={emailError}
                    emailStyle={{ color: 'black' }}
                  />
                  {/* <DatePickerField
                    label={'Date of birth'}
                    defaultVallue="Date of birth"
                    dob={dob}
                    onPress={this.showDatePicker}
                    openModal={this.showModal}
                    errorDOB={dobError}
                    dobStyle={{ borderBottomWidth: 1, paddingBottom: Platform.OS == 'android' ? 14 : 8 }}
                  />
                  <Text style={styles.bdyText}> {'Your birthday date will not be shown publicly.'}</Text> */}
  
             <Label style={styles.pronounStyle}>Your Pronoun</Label>
    
              <View style={styles.dropdownOuterView}>
              <_DropDown
                data={pronouns}
                selectedValue={gender}
                renderAccessory={null}
                staticValue={'Pronoun'}
                inputStyle={{borderWidth:0}}
                dropdownPosition={-4.5}
                placeholder={pronounPlaceholder}
                style={{flex: 1, borderBottomWidth: 0,backgroundColor:'null' }}
                pickerStyle={{width:wp(90),marginLeft:15,borderBottomWidth: 0}}
                onChangeText={(value, index, data) => {this.handleGender(value)}}
              />
              <Icon
                onPress={() => this.showGenPolicy()}
                name={'questioncircle'}
                type={'AntDesign'}
                style={styles.iconColor}
              />
              </View>
              
          <Label style={{marginTop:10, color:grey,fontSize:textInputFont,}}>Country</Label>
          <_DropDown
                    data={this.state.countryList}
                    selectedValue={CountryName}
                    renderAccessory={null}
                    staticValue={'Country'}
                    dropdownPosition={-4.5}
                    placeholder={Placeholder}
                    onChangeText={this.selectedCountry}
                    itemTextStyle={{marginLeft:17,}}
                    style={{borderBottomWidth:0,left:-2 ,width:wp(90) }}
                    pickerStyle={{ width: wp(90), alignSelf: 'center', marginLeft: 15 }}
                    />
                    <Divider
                    style={{borderBottomWidth:1,borderBottomColor:grey,marginBottom:wp(1.3)}}
                    />
            <TextField
              label={'About me'}
              placeholder={'Type here'}
              onChangeText={t => this.handleAboubMe(t)}
              // value={about ? about.split("<br>").join("\n") : ''}
              value={LongAboutParseHtml(about)}
              multiline={true}
              maxLength={500}
            />
          </View>
        )}
            </View>
            <View style={styles.tileContainer}>
              {this.state.customDesign.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity onPress={() => { if (!item.screenName) { this.change_Phone_Overlay() } else { this.props.navigation.navigate(item.screenName) } }} style={{ ...styles.tile, marginTop: 0, paddingHorizontal: 0 }}>
                      <View style={{ backgroundColor: item.iconBackground, width: wp(8), height: wp(8), borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type="FontAwesome" name={item.icon} style={{ color: 'white', fontSize: 20 }} /></View>
                      <Text style={styles.NameText}>{item.title}</Text>
                      <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
                        <Icon name="right" type="AntDesign" style={{ color: '#aeaeae', fontSize: wp(4) }} />
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: '100%', borderWidth: 0.5, borderColor: '#bebebe', marginVertical: wp(3) }} />
                  </View>

                )
              })}
            </View>


            <View
              style={{
                ...styles.viewForInput,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,

                elevation: 11,
                borderRadius: 10,
              }}>

              <TouchableOpacity
                onPress={() =>
                  this.setState({ showImages: !this.state.showImages })
                }
                style={{ ...styles.tile, marginTop: 0, paddingHorizontal: 0 }}>
                <View style={{ backgroundColor: darkSky, width: wp(8), height: wp(8), borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Icon type="FontAwesome" name={'camera'} style={{ color: 'white', fontSize: 18 }} /></View>
                <Text style={styles.NameText}>{'Avatar & Cover Photo'}</Text>
                <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
                  <Icon name="right" type="AntDesign" style={{ color: '#aeaeae', fontSize: wp(4) }} />
                </View>
              </TouchableOpacity>


              {this.state.showImages && (
                <View style={{ justifyContent: 'space-around' }}>
                  <View>
                    <Text style={styles.bottomText}>Cover Photo</Text>
                    {coverImage?.uri ? (
                      <View>
                        <Image
                          style={styles.coverAvatar}
                          source={{
                            uri: coverImage?.uri
                              ? coverImage.uri
                              : 'https://www.clipartkey.com/mpngs/m/96-966685_contact-person-icon-png.png',
                          }}
                        />
                        <FontAwesome5
                          name="window-close"
                          onPress={() => this.setState({ coverImage: {} })}
                          color="white"
                          style={{ position: 'absolute', right: 2 }}
                          size={25}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.handleImageChange('Cover')}
                        style={styles.coverAvatar}>
                        <Image
                          style={styles.imageIcon}
                          source={{
                            uri: user?.cover
                              ? user?.cover
                              : 'https://www.clipartkey.com/mpngs/m/96-966685_contact-person-icon-png.png',
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View>
                    <Text style={styles.bottomText}>Avatar</Text>
                    {avatarImage?.uri ? (
                      <View>
                        <Image
                          style={styles.profileAvatar}
                          source={{
                            uri: avatarImage?.uri
                              ? avatarImage.uri
                              : 'https://www.clipartkey.com/mpngs/m/96-966685_contact-person-icon-png.png',
                          }}
                        />
                        <FontAwesome5
                          name="window-close"
                          onPress={() => this.setState({ avatarImage: {} })}
                          color="white"
                          style={{
                            position: 'absolute',
                            left: Dimensions.get('window').width * 0.23,
                          }}
                          size={25}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.handleImageChange('Avatar')}
                        style={[styles.profileAvatar, { overflow: 'hidden' }]}>
                        <Image
                          style={styles.imageIcon}
                          source={{
                            uri: user?.avatar
                              ? user.avatar
                              : 'https://www.clipartkey.com/mpngs/m/96-966685_contact-person-icon-png.png',
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollViewIndicator>

        {/* <_DatePicker
          date={date}
          // date={moment("2022-02-24").toDate()}
          isVisible={isDatePicker_Visible}
          header={'Select Date of Birth'}
          onDateChange={this.selectDate}
          onSelect={this.hideDatePicker}
          onClose={this.hideDatePicker}
          maxDate={new Date()}
          // maxDate={maxdate}
        // minimumDate={new Date(this?.props?.user?.user_data.birthday)}
        /> */}

        <InfoModal
          isVisible={isModal_Visible}
          onBackButtonPress={() => this.closeModal()}
          info={infoText}
          headerText={headerText}
          policy={passPolicy}
          onPress={() => this.closeModal()}
        />

        <ChangePhoneNumber
          visible={changePhoneOverlay}
          toggleOverlay={() => this.change_Phone_Overlay()}
          changeContact={value => this.handleChangeContact(value)}
          setDefaultValue={setDefaultValue}
          defaultVlaue={newContact}
          cca2={newCca2}
          callingCode={newCallingCode}
          contact={newContact}
          registerPhoneNumber={() => this.registerNewPhoneNumber()}
          // error={phError}
          error={isInvalidNum}
          sending={sending}
          exist={PhExist}
          animationOut={'slideOutDown'}
          animationOutTiming={300}
        />

        <ErrorModal
          isVisible={isErrorModalVisible}
          onPress={() => this.closeErrorModal()}
          onBackButtonPress={() => this.closeErrorModal()}
          info={errorMsg}
          heading={'Hoot!'}
        />
        <InfoModal
            isVisible={showGenderPolicy}
            onBackButtonPress={() => this.hideGenPolicy()}
            info={infoText}
            headerText={headerText}
            policy={passPolicy}
            onPress={() => this.hideGenPolicy()}
          />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(
  mapStateToProps,
  { petOwnerData, petOwnerNewsFeed },
)(EditProfile);
