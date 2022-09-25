import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import posed, { Transition } from 'react-native-pose';
import { Container, Content, } from 'native-base';
import { Divider } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DialogBox from 'react-native-dialogbox';
import AsyncStorage from '@react-native-community/async-storage';
import IntlPhoneInput from 'react-native-intl-phone-input';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';

import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { SERVER, server_key } from '../../constants/server';
import requestRoutes from './../../utils/requestRoutes.json'; //'../../utils/requestRoutes';
import TextField from '../../components/common/TextField';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { Capitalize, validateNumber } from '../../utils/RandomFuncs';
import { ACCESS_TOKEN, SELECTED_PET, OwnerName, PetName } from '../../constants/storageKeys';
import ErrorModal from '../../components/common/ErrorModal'
import Label from '../../components/common/Label';
import CustomLoader from '../../components/common/CustomLoader';
import { BG_DARK, HEADER, TEXT_LIGHT, PLACE_HOLDER, DANGER, grey, TEXT_INPUT_LABEL, black, darkSky, White } from '../../constants/colors';
import { petMyPalGroupApiService } from '../../services/PetMyPalGroupApiService';
const { getPetCategory } = petMyPalGroupApiService;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { phoneText } from '../../constants/ConstantValues';



const window = Dimensions.get('window');

const StepOne = posed.View({
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
});

const StepTwo = posed.View({
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
});

var petOwner = {
  fname: '',
  lname: '',
}


class ChoosePet extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()

    this.state = {
      petId: 0,
      selectedPet: {},
      currentPet: '',
      petSubTypes: [],
      step: 1,
      petType: [],
      petName: '',
      firstName: '',
      lastName: '',
      contact: '',
      mskedNumber: '',
      cca2: 'US',
      callingCode: '1',

      fetching: false,
      petNameError: false,
      firstNameError: false,
      lastNameError: false,
      perNmaError: false,
      phError: false,
      infoText: '',
      // heading:'Hoot!',
      countryCode: '',
      changeNum: null

    }
  }

  goBack = () => {
    const { step } = this.state
    if (step == 1) {
      this.setState({ fetching: false })
      this.props.navigation.pop()
    } else {
      this.setState({ step: 1, petId: 0, selectedPet: {} })
    }

  }

  componentDidMount() {
    this.getPetCategoryList();
    let tempVal = ''
    tempVal = `${this.state.cca2},${this.state.callingCode}`
    this.setState({
      countryCode: tempVal
    })
  }
  async getPetCategoryList() {
    const response = await this.props.getPetCategory();
    this.setState({ petType: response.data.pet_types })
  }
  handlePetSelection = async (pet) => {
    const { selectedPet } = this.state
    this.setState({
      currentPet: selectedPet,
      step: 2
    });

    try {
      await AsyncStorage.setItem(SELECTED_PET, JSON.stringify(selectedPet));
    } catch (err) {
      console.log('async error', err);
    }

  };
  componentDidUpdate = () => {
  }

  handleFirstName = async (text) => {
    this.setState({
      firstName: text,
      firstNameError: false,
      error: false
    })
    petOwner.fname = text
    try {
      await AsyncStorage.setItem(OwnerName, JSON.stringify(petOwner));
    } catch (error) {
      console.log('error in Asyn First Name', error);
    }
  }

  handleCreateAccountPressed = async () => {
    const {
      firstName,
      lastName,
      callingCode,
      contact,
      cca2,
      petName,
      countryCode,
      phError,
      changeNum
    } = this.state;

    const [fname, lname] = firstName.split(' ')
    let L_name = ''
    if (lname) {
      L_name = lname
    }
    let error = false
    let invalidPhone = false

    if (!(petName.trim().length > 0)) {
      this.setState({
        petNameError: true
      })
      error = true
    } else {
      await AsyncStorage.setItem(PetName, petName)
    }

    if (!(firstName.trim().length > 0)) {
      this.setState({
        firstNameError: true
      })
      error = true
    }


    if (phError) {
      invalidPhone = true
    } else if (!contact) {
      invalidPhone = true
      this.setState({ phError: true })
    }

    if (invalidPhone === false && error) {
    } else if (invalidPhone && error) {
      return
    }else if (invalidPhone) {
    }else {
      this.setState({ fetching: true })
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('first_name', fname);
      data.append('last_name', L_name);
      data.append('phone_number', callingCode + contact);
      data.append('mbl_country_code', countryCode)
      this.requestHandlerCreate('create-account', data);

    }

  }

  async requestHandlerCreate(type, data) {

    const {
      callingCode,
      contact,
      cca2,
      firstName,
      lastName,
      countryCode,
      maskedNumber,
      changeNum
    } = this.state

    let userData = {
      firstName,
      lastName,
      contact,
      cca2,
      callingCode,
      countryCode,
      maskedNumber,
      changeNum: true
    }

    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log('here is response' , responseJson);
        if (responseJson.api_status === '400') {

          this.setState({
            isModal_Visible: true,
            infoText: Capitalize(responseJson.errors.error_text)
          })

          if (responseJson.errors.error_text === "Username is already taken" || responseJson.errors.error_text === "E-mail is already taken") {
            this.LoginBox()
          }

          this.setState({
            error: responseJson.errors.error_text,
            fetching: false,
            // step: 2,
          });
        } else if (responseJson.api_status === 200) {
          this.setState({ error: false, fetching: false, });

        } else {
          this.setState({
            error: false,
            user_id: responseJson.user_id,
            fetching: false,
          }, () => this.props.navigation.navigate('VerifyPhoneNumber', {
            userData,
            user_id: this.state.user_id,

          })
          );

        }
      })
      .catch(error => {
        this.setState({ fetching: false })
        console.log('error in catch', error);
      });
  }


  LoginBox = () => {
    const scope = this;
    this.dialogbox.confirm({
      title: 'Message !',
      content: ['Username or Email already exists. Login instead'],
      ok: {
        text: 'OK',
        style: {
          color: 'green',
        },
        callback: () => {
          this.props.navigation.navigate('LoginView');
        },
      },
    });
  };


  changePet = () => {
    this.setState({ step: 1, petId: 0, selectedPet: {}, fetching: false })
  }


  // handleContactChange = (value) => {
  //   //  let text = value.replace(/[()" "]/g, "") 
  //    let text = value.replace(/[()" "-]/g, "") 

  //     this.setState({
  //       // contact: value,
  //       contact: text,
  //       phError: false,
  //       error: false

  //     })
  //   }

  handlePhoneNumber = (value) => {

    let tempVal = ''
    tempVal = `${value.selectedCountry.code},${value.selectedCountry.dialCode}`

    this.setState({
      contact: value.unmaskedPhoneNumber,
      maskedNumber: value.phoneNumber,
      phError: !value.isVerified,
      error: false,
      setDefaultValue: false,  //importan 
      cca2: value.selectedCountry.code,
      callingCode: value.selectedCountry.dialCode,
      countryCode: tempVal

    })
  }

  // handleCountryChange = (country) => {
  //   let tempVal = ''
  //   tempVal = `${country.cca2},${country.callingCode}`

  //   this.setState({
  //     cca2: country.cca2,
  //     callingCode: country.callingCode,
  //     countryCode: tempVal
  //   })
  // }

  closeModal = () => {
    this.setState({ isModal_Visible: false })
  }


  render() {

    const {
      petId,
      currentPet,
      step,
      fetching,
      cca2,
      petNameError,
      firstNameError,
      phError,
      isModal_Visible,
      petType
    } = this.state


    return (
      // <Container style={{ flex: 1 }}>
      //   <Content>
      <KeyboardAwareScrollView style={{flex:1, backgroundColor:White}}>
          <MainLogoForSignUp
            goBack={() => this.goBack()}
            text={
              step === 1 ?
                "Let's begin your pet journey together!"
                : "Let's begin your pet journey together!"
            }
            steps={step}
            heading={'Create Account'}
            headingContainer={{ marginTop: 5 }}
          // testImage={require('./../../assets/images/updated/CreateAccount.png')}
          />


          <View style={{
            width: window.width * 0.9,
            alignSelf: 'center',
            // marginTop: Platform.OS === 'android' ? hp(1) : hp(3),
            // backgroundColor:'red',
            marginTop: Platform.OS == 'android' ? 5 : isIphoneX() ? hp(-5) : hp(-2),
          }}>
            <Transition>
              {step === 1 ? (
                <StepOne key="a">
                  <View style={styles.optionContainer}>
                    {petType.length <= 0 ? (
                      <View
                        style={styles.petView}>
                        <CustomLoader />
                      </View>
                    ) : (
                      petType.map((pet, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              this.setState({ petId: pet.id, selectedPet: pet })
                            }} style={styles.option} key={pet.id}>
                            <View
                              style={
                                petId === pet.id
                                  ? [styles.selectedPetStyle]
                                  : [styles.unSelectedPets]
                              }>
                              <Image
                                style={styles.imgStyle}
                                resizeMode={'contain'}
                                source={{ uri: pet.image_thumb }}
                              />
                            </View>
                            <Text style={{ color: '#424c63' }}>{pet.name}</Text>
                          </TouchableOpacity>
                        );
                      })
                    )}

                  </View>

                </StepOne>
              ) : step === 2 ? (
                <StepTwo key="b">

                  <View style={[styles.chosenPet, { marginTop: 0, }]}>
                    <View>
                      <View style={styles.petimgView}>
                        <Image
                          style={styles.imgStyle}
                          source={{ uri: currentPet.image_thumb }}
                          resizeMode={'contain'}
                        />
                      </View>
                      <Text
                        style={{ ...styles.petName, ...styles.petName2 }}>
                        {currentPet.name}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => this.changePet()}>
                      <Text
                        style={[styles.changePetText, { color: '#20ace2' }]}>
                        Change Pet
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginHorizontal: 10 }}>

                    <TextField
                      label={"Pet Name"}
                      placeholder={'Enter Pet Name'}
                      value={this.state.petName}
                      onChangeText={(text) => this.setState({
                        petName: text,
                        petNameError: false,
                        error: false
                      })}
                      error={petNameError}
                    />

                    <TextField
                      label={"Pet Owner Name"}
                      placeholder={'Enter Pet Owner Name'}
                      value={this.state.firstName}
                      onChangeText={(text) => { this.handleFirstName(text) }}
                      error={firstNameError}

                    />

                    {/* <TextField
                      label={"Pet Owner Last Name"}
                      placeholder={'Enter Pet Owner Last Name'}
                      value={this.state.lastName}
                      onChangeText={(text) => this.handleLastName(text)}
                      error={lastNameError}
                    /> */}

                    <Label
                      style={phError ? [styles.label, { color: DANGER }] : [styles.label]}
                      text={'Phone Number'}
                    />

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
                      placeholder={'Phone number'}
                      select={(country) => {
                        this.handleCountryChange(country)
                      }}
                    /> */}

                    <IntlPhoneInput
                      defaultCountry={cca2}
                      ref={this.inputRef}
                      flagStyle={{ fontSize: 15 }}
                      onChangeText={(c) => this.handlePhoneNumber(c)}
                      phoneInputStyle={{color:black}}
                      //  onChangeText={(c)=>this.setState({v:c,setDefaultValue:false})}
                      //  setDefaultValue={this.state.setDefaultValue}
                      //  defaultVlaue={'03327476323'}
                      containerStyle={styles.intlPhoneInputStyle}
                    />
                    <Divider style={{borderColor: phError ? DANGER : grey, borderWidth: 1}}/>
                    <Label
                    text={phoneText}
                     style={{ ...styles.bdyText }}
                    />
                  </View>

                </StepTwo>
              ) : null}

            </Transition>

            <View style={{ justifyContent: 'center', marginTop: wp(2), }}>
              <View style={[styles.btnView,]}>

                {step === 1 ?
                  <SkyBlueBtn
                    btnContainerStyle={{ alignSelf: 'center', }}
                    title={'Next'}
                    onPress={() => {
                      petId === 0 ?
                        this.setState({ isModal_Visible: true, infoText: 'Select Your Pet Type' })
                        :
                        this.handlePetSelection(petId)
                    }} />
                  : step === 2 && fetching ?
                    <View style={{ marginTop: 10 }}>
                      <CustomLoader />
                    </View>
                    :
                    <SkyBlueBtn
                      btnContainerStyle={{ alignSelf: 'center', marginTop: 10 }}
                      title={'Next'}
                      onPress={() =>
                        this.handleCreateAccountPressed()

                      }
                    />
                }

              </View>

              {step === 1 && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 20
                }}>

                <TouchableOpacity
                  onPress={() => { this.props.navigation.navigate('LoginMethod') }}>
                  <Text style={{ color: '#8B94A9' }}>Do you have an account?
                    <Text style={{ fontWeight: 'bold', color: '#f598a2' }}> Sign In</Text></Text>
                </TouchableOpacity>
              </View>}
            </View>

          </View>
          <DialogBox
            ref={dialogbox => {
              this.dialogbox = dialogbox;
            }}
          />
          <ErrorModal
            isVisible={isModal_Visible}
            onBackButtonPress={() => this.closeModal()}
            info={this.state.infoText}
            heading={'Hoot!'}
            onPress={() => this.closeModal()}
          />

        {/* </Content>
      </Container> */}
      </KeyboardAwareScrollView>
    );
  }
};
const mapStateToProps = (state) => {
  return {
    petCategoryArray: state.groups.petCategoryArray
  }
}

export default connect(mapStateToProps, { getPetCategory })(ChoosePet);

const styles = StyleSheet.create({
  wraper: {
    flex: 1,
  },
  choosePetContainer: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 0,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
    // marginVertical: 20,
  },
  option: {
    width: window.width * 0.8 * 0.25,
    height: window.width * 0.8 * 0.25,
    marginBottom: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petOption: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    backgroundColor: BG_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  petName: {
    color: '#000',
  },
  selectedOption: {
    backgroundColor: HEADER,
  },
  petImage: {
    width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    resizeMode: 'contain',
    // tintColor: 'white',
  },
  extraMargin: {
    marginBottom: 10,
  },
  basicDetailsForm: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 16,
  },
  chosenPet: {
    justifyContent: 'space-around',
    marginVertical: 10,
    alignItems: 'center',
  },

  pet: {},

  petOption: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    backgroundColor: BG_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  petName: {
    color: TEXT_LIGHT,
    alignSelf: 'center',
  },
  petImage: {
    width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  changePetText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    textDecorationLine: 'underline',
    textDecorationColor: TEXT_LIGHT,
  },
  contactNum: {
    fontSize: RFValue(14),
    justifyContent: 'center',
  },
  petView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginVertical: RFValue(5),
    width: 24,
    marginHorizontal: 'auto',
  },
  selectedPetStyle: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    borderColor: '#f598a2',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  unSelectedPets: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    borderColor: '#f4f4f4',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderLeftWidth: 0.3,
    borderTopWidth: 0.3,
  },
  imgStyle: {
    width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
    height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
  },
  petimgView: {
    width: window.width * 0.8 * 0.25 * 0.8,
    height: window.width * 0.8 * 0.25 * 0.8,
    borderColor: '#ece9e9',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  petName2: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  btnView: {
    justifyContent: 'center',
    // marginTop: wp(1),
    marginBottom: 5,
    // marginTop: 15,
  },
  label: {
    color: TEXT_INPUT_LABEL,
    fontSize: 15,
  },
  intlPhoneInputStyle: {
    paddingLeft: 2,
    paddingVertical: 0,
    backgroundColor:undefined,
    paddingBottom: Platform.OS == 'ios' ? 10 : null,
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  bdyText: {
    marginTop: 2,
    fontSize: 12,
    color: darkSky,
    marginBottom: 20,
  },

});
