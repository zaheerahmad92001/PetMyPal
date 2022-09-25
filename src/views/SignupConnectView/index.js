import React from 'react';
import {
  View,
  PixelRatio,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import styles from './styles';
import { Thumbnail, Container, Content } from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userEdit } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import requestRoutes from './../../utils/requestRoutes.json'; //'../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import DialogBox from 'react-native-dialogbox';
import { validateNumber } from '../../utils/RandomFuncs';
import { HEADER, FOOTER_ICON_ACTIVE_NEW } from '../../constants/colors';
import LogoTopRight from '../../components/commonComponents/logoTopRight';
import BackTopLeft from '../../components/commonComponents/backTopLeft';
import FullPageBackground from '../../components/commonComponents/fullPageBackground';
import ChoosePet from './choosePet';
import VerifyPhoneNumber from './verifyPhoneNumber';
import PetDetails from './petDetails';
import UserDetails from './userDetails';
import DogImage from './../../assets/images/pet-icons/dog.png';
import CatImage from './../../assets/images/pet-icons/cat.png';
import CowImage from './../../assets/images/pet-icons/cow.png';
import FishImage from './../../assets/images/pet-icons/fish.png';
import ParrotImage from './../../assets/images/pet-icons/parrot.png';
import HorseImage from './../../assets/images/pet-icons/horse.png';
import BirdImage from './../../assets/images/pet-icons/pigeon.png';
import PigImage from './../../assets/images/pet-icons/pig.png';
import RabbitImage from './../../assets/images/pet-icons/rabbit.png';
import SnakeImage from './../../assets/images/pet-icons/snake.png';
import RodentImage from './../../assets/images/pet-icons/rat.png';
import TurtleImage from './../../assets/images/pet-icons/turtle.png';
import OtherImage from './../../assets/images/pet-icons/other.png';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { commonState } from '../../components/common/CommomState';
class SignupConnectView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      error: '',
      selectedPet: '',
      petName: '',
      firstName: '',
      lastName: '',
      contact: '',
      currentPet: {},
      cca2: 'US',
      callingCode: '1',
      otp: '',
      otpError: false,
      confirm: true,
      petGender: '',
      petBirthday: '',
      selectedSubPet: '',
      selectedPetSize: '',
      email: '',
      accept: false,
      birthday: '',
      gender: '',
      password: '',
      confirm_password: '',
      address: '',
      address_2: '',
      country_id: '',
      state_id: '',
      zip: '',
      city_id: '',
      user_id: '',
      petTypes: commonState.petTypes,
      petSubTypes: [],
      petSizes: null,
      petSizesKeys: [],
      loading: true,
      countryList: [],
      stateList: [],
      cityList: [],
      addMore: false,
      fetching: false,
    };
  }

  componentDidMount() {

    this.requestHandlerGetPetSizes('get-pet-sizes');
    this.requestHandlerGetCountry('get-countries');
  }
  handleStepUp = () => {
    if (this.state.step === 1) {
      this.setState({
        // fetching: false,
        step: ++this.state.step,
        // step: 4,
      });
    } else if (this.state.step === 2) {
      this.handleCreateAccountPressed();
    } else if (this.state.step === 3) {
      this.handleTwoFactorPressed();
    } else if (this.state.step === 4) {
      this.handlePetDetailsPressed();
    } else {
      let up = 0;
      if (this.state.step == 3) {
        up = this.state.step + 2;
      } else {
        up = this.state.step + 1;
      }
      this.setState({
        step: up,
      });
    }
  };

  /////////////// stepper down /////////////////
  handleStepDown = () => {
    let down = 0;
    if (this.state.step == 5) {
      down = this.state.step - 2;
    } else {
      down = this.state.step - 1;
    }
    this.setState({ step: down });
  };

  /////////////// choose pet handler //////////////
  handlePetSelection = pet => {
    this.setState({
      selectedPet: pet,
    });
    this.requestHandlerGetPetSubTypes('get-pet-sub-types', pet);

    const selectedPet = this.state.petTypes.filter(filPet => {
      return filPet.id === pet;
    });

    this.setState({
      currentPet: selectedPet[0],
    });

    this.handleStepUp();
  };

  handlePetDeselection = () => {
    this.setState({
      selectedPet: '',
    });
  };

  ////////////////// basic detail handlers //////////////
  handlePetNameChange = name => {
    this.setState({
      petName: name,
    });
  };

  handleFirstNameChange = name => {
    this.setState({
      firstName: name,
    });
  };

  handleLastNameChange = name => {
    this.setState({
      lastName: name,
    });
  };

  handleCountryChange = country => {
    this.setState({
      cca2: country.cca2,
      callingCode: country.callingCode,
    });
  };

  handleContactChange = value => {
    this.setState({ contact: value, error: '' });
  };

  ///////////////////  verify phone number handlers ///////////////////
  handleOTPChange = value => {
    this.setState({ otp: value });
  };

  //////////////////// pet details handlers //////////////////
  handlePetSubTypeSelect = type => {
    this.setState({
      selectedSubPet: type,
    });
  };

  handlePetSizeSelect = size => {
    this.setState({
      selectedPetSize: size,
    });
  };

  handlePetBirthdayChange = petBirthday => {
    this.setState({ petBirthday, error: '' });
  };

  handlePetGenderChange = e => {
    this.setState({
      petGender: e,
    });
  };

  ////////////// user details handlers ////////////////////////
  handleEmailChange = email => {
    this.setState({ email, error: '' });
  };

  handleGenderChange = e => {
    this.setState({
      gender: e,
    });
  };

  handleBirthdayChange = birthday => {
    this.setState({ birthday, error: '' });
  };

  handleTermsChange = () => {
    this.setState({ accept: !this.state.accept });
  };

  //////////////// password handlers ///////////////////
  handlePasswordChange = password => {
    this.setState({ password, error: '' });
  };

  handleConfirmPasswordChange = confirm_password => {
    this.setState({ confirm_password, error: '' });
  };

  /******************** new functions end *******************************/

  ///////////// ON START APIS //////////////////

  async requestHandlerGetPet(type) {
    const data = new FormData();
    data.append('server_key', server_key);

    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
          this.setState({ petTypes: responseJson.pet_types, loading: false });
        } else {
          this.setState({ petTypes: [], loading: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async requestHandlerGetCountry(type) {
    const data = new FormData();
    data.append('server_key', server_key);

    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
          this.setState({ countryList: responseJson.countries, loading: false });
        } else {
          this.setState({ countryList: [], loading: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async requestHandlerGetPetSubTypes(type, value) {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('pet_type', value);

    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
          this.setState({ petSubTypes: responseJson.pet_sizes, loading: false });
        } else {
          this.setState({ petSubTypes: [], loading: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async requestHandlerGetPetSizes(type) {
    const data = new FormData();
    data.append('server_key', server_key);
    this.setState({ fetching: true });
    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
          this.setState({
            petSizes: responseJson.pet_sizes,
            petSizesKeys: Object.keys(responseJson.pet_sizes),
            loading: false,
            fetching: false,
          });
        } else {
          this.setState({
            petSizes: [],
            petSizesKeys: [],
            loading: false,
            fetching: false,
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ fetching: false });
      });
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    console.log('ekehffbkwe',access_token);
    return access_token;
  }

  ///////////// Create Account API ////////////////

  handleCreateAccountPressed() {
    const { firstName, lastName, callingCode, contact, cca2 } = this.state;
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('first_name', firstName);
    data.append('last_name', lastName);
    // data.append('password', password);
    // data.append('email', email);
    // data.append('confirm_password', confirm_password);
    data.append('phone_number', '+' + callingCode + contact);
    // if (accept && step === 1) {
    // if (password === confirm_password) {
    // this.setState({ error: "" })
    // this.setState({ step: 2 })
    if (validateNumber(contact, cca2)) {
      this.setState({ error: '', fetching: true });
      this.requestHandlerCreate('create-account', data);
    } else {
      this.ErrorBox('Contact number is not valid');
      this.setState({ error: 'Contact number is not valid' });
    }
    // }
    // else {
    //     this.ErrorBox("Your password does not match")
    //     this.setState({ error: "Your password does not match" })
    // }

    //this.requestHandlerCreate('create-account', data);
    // }
    // else {
    //     this.ErrorBox("Please agree to Terms and Conditions")
    //     this.setState({ error: "Please agree to Terms and Conditions", fetching: false })
    // }
    // if (step === 2) {
    //     this.setState({ error: '', fetching: true })
    //     this.requestHandlerCreate('create-account', data);
    // }
  }

  async requestHandlerCreate(type, data) {
    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {

        if (responseJson.api_status === '400') {
          if (responseJson.errors.error_text === "Username is already taken" || responseJson.errors.error_text === "E-mail is already taken") {
            this.LoginBox()
          }
          this.ErrorBox(responseJson.errors.error_text);

          this.setState({
            error: responseJson.errors.error_text,
            fetching: false,
            // step: 2,
          });
        } else if (responseJson.api_status === 200) {
          this.setState({ error: '', fetching: false, confirm: false, step: 2 });
        } else {
          this.setState({
            error: '',
            user_id: responseJson.user_id,
            fetching: false,
            confirm: true,
            step: 3,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  ///////////// Verify Phone Number API ////////////////

  handleTwoFactorPressed() {
    this.setState({ fetching: true, error: '', otpError: false });
    const { user_id, otp, callingCode, contact } = this.state;
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('user_id', user_id);
    data.append('code', parseInt(otp));
    data.append('phone_num', '+' + callingCode + contact);
    if (parseInt(otp) > 999 && parseInt(otp) < 10000) {
      this.setState({ otpError: false });
      this.requestHandlerTwoFactor('two-factor', data);
    } else {
      this.setState({ otpError: true, fetching: false });
    }
  }

  async requestHandlerTwoFactor(type, data) {
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
          const token = await AsyncStorage.getItem(ACCESS_TOKEN);
          console.log();
          if (this.state.selectedPet === 2) {
            this.setState({
              step: 5, //4
              fetching: false,
            });
          } else {
            this.setState({
              step: 5,
              fetching: false,
            });
          }

        } else {
          this.ErrorBox(responseJson.errors.error_text);
          this.setState({
            error: responseJson.errors.error_text,
            fetching: false,
            otpError: true,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleResendOtpPressed = () => {
    this.setState({ fetching: true, error: '', otpError: false, otp: '' });

    const { user_id, otp, callingCode, contact } = this.state;
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
          this.ErrorBox(responseJson.errors.error_text);
          this.setState({
            error: responseJson.errors.error_text,
            fetching: false,
            otpError: true,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /////////// Pet Details Entered ////////////////////
  handlePetDetailsPressed = () => {
    const {
      petGender,
      petBirthday,
      selectedSubPet,
      selectedPetSize,
    } = this.state;
    this.setState({ error: '', step: ++this.state.step });
    // this.handleStepUp();

  };

  handleUserDetailsPressed = () => {
    const { email, birthday, accept, gender } = this.state;
    if (this.validateEmail(email)) {
      this.setState({ error: '' });
    } else {
      this.ErrorBox('Please enter correct email address');
      this.setState({ error: 'Please enter correct email address' });
    }
  };

  validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  /////////// Passwords Entered ////////////////////
  handlePasswordsPressed = () => {
    this.handleUserDetailsPressed();
    const { password, confirm_password } = this.state;
    if (true) {
      if (password === confirm_password) {
        // this.handleUpdateAccountPressed();
        this.handleAddPetPressed();
      } else {
        this.ErrorBox('Your passwords do not match');
        this.setState({ error: 'Your passwords do not match' });
      }
    }
  };

  //////////// Update Account API ////////////////////

  handleUpdateAccountPressed() {
    this.setState({ fetching: true, error: '' });
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
    } = this.state;
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('password', password ? password : '');
    data.append('confirm_password', confirm_password ? confirm_password : '');
    data.append('email', email ? email : '');
    data.append('gender', gender ?  gender : '');
    data.append('dob', birthday ? birthday :'');
    data.append('sub_type', selectedSubPet);
    data.append('pet_size', selectedPetSize);
    data.append('pet_dob', petBirthday);
    data.append('pet_gender', petGender);
// {
//   !email || !gender || !birthday ?
//   alert('Enter your detail')
//   :
  this.requestHandlerUpdate('update-account', data);
// }
    
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
              this.setState({ fetching: false });
              this.ProfileBox();
              this.props.navigation.navigate('AppNavigator');
            } else {
              this.ErrorBox(responseJson.errors.error_text);
              this.setState({
                error: responseJson.errors.error_text,
                fetching: false,
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  ///////////////// Add Pet API ///////////////////////

  handleAddPetPressed() {
    this.setState({ fetching: true, error: '' });
    const {
      selectedPet,
      selectedPetSize,
      selectedSubPet,
      petGender,
      petBirthday,
      petName,
    } = this.state;
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('pet_name', petName);
    data.append('pet_type', selectedPet);
    data.append('pet_size', selectedPetSize);
    data.append('sub_type', selectedSubPet);
    data.append('gender', petGender);
    data.append('birthday', petBirthday);
    data.append('pet_avatar', '');
    this.requestHandlerAddPet('create-pet', data);
  }

  async requestHandlerAddPet(type, data) {
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
              if (this.state.addMore) {
                this.setState({
                  selectedPet: null,
                  selectedPetSize: null,
                  selectedSubPet: null,
                  petName: '',
                  petGender: null,
                  petBirthday: '',
                });
                // this.PetBox();
              } else {
                this.setState({ fetching: false });

                this.props.navigation.navigate('AppNavigator');
                //this.PetBox()
              }
              this.handleUpdateAccountPressed();
            } else {
              this.ErrorBox(responseJson.errors.error_text);

              this.setState({
                error: responseJson.errors.error_text,
                fetching: false,
              });
            }
          })
          .catch(error => {
            this.setState({ fetching: false });
            alert('Network request failed');
          });
      });
  }

  

  goBack = () => {
    this.props.navigation.pop();
  };

  GenderBox = () => {
    const scope = this;
    this.dialogbox.confirm({
      title: 'Gender !',
      content: ['Select your Gender'],
      ok: {
        text: 'Male',
        style: {
          color: 'red',
        },
        callback: () => {
          this.setState({ gender: 'male' });
        },
      },
      cancel: {
        text: 'Female',
        style: {
          color: 'red',
        },
        callback: () => {
          this.setState({ gender: 'female' });
        },
      },
    });
  };

  ErrorBox = error => {
    const scope = this;
    this.dialogbox.confirm({
      title: 'Message !',
      content: [error],
      ok: {
        text: 'OK',
        style: {
          color: 'green',
        },
        callback: () => { },
      },
    });
  };

  ProfileBox = () => {
    const scope = this;
    this.dialogbox.confirm({
      title: 'Message !',
      content: ['Profile Successfully Updated'],
      ok: {
        text: 'OK',
        style: {
          color: 'green',
        },
        callback: () => {
          this.setState({ step: 4 });
        },
      },
    });
  };

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

  PetBox = () => {
    const scope = this;
    this.dialogbox.confirm({
      title: 'Message !',
      content: ['Pet Successfully Registered'],
      ok: {
        text: 'OK',
        style: {
          color: 'green',
        },
        callback: () => {
          this.setState({
            selectedPet: null,
            selectedPetSize: null,
            selectedSubPet: null,
            petName: '',
            petGender: null,
            petBirthday: '',
          });
        },
      },
    });
  };

  OTPBox = () => {
    const scope = this;
    this.dialogbox.confirm({
      title: 'Message !',
      content: ['Mobile Number Successfully Verified'],
      ok: {
        text: 'OK',
        style: {
          color: 'green',
        },
        callback: () => {
          this.setState({ step: 3 });
        },
      },
    });
  };

  contactValidation = () => {
    let { contact, cca2, callingCode } = this.state;
    const scope = this;
    this.setState({ error: '' });
    if (validateNumber(contact, cca2)) {
      // contact = '+' + callingCode + scope.state.contact
      // this.setState({ error: '', contact })
      this.handleCreateAccountPressed();
    } else {
      this.ErrorBox('Contact number is not valid');
      this.setState({ error: 'Contact number is not valid' });
    }
  };

  onPetTypeChange(value) {
    // alert(value)
    this.setState(
      {
        selectedPet: value,
        loading: true,
        petSubTypes: [],
        selectedSubPet: null,
        error: '',
      },
      () => this.requestHandlerGetPetSubTypes('get-pet-sub-types', value),
    );
  }

  onPetSizeChange(value) {
    // alert(value)

    this.setState({ selectedPetSize: value, error: '' });
  }

  onPetSubTypeChange(value) {
    // alert(value)
    this.setState({ selectedSubPet: value, error: '' });
  }
  onGenderChange(value) {
    if (value !== '0') {
      this.setState({ petGender: value, error: '' });
    }
  }
  onCountryChange(value) {
    this.setState(
      {
        country_id: value,
        error: '',
        city_id: '',
        cityList: [],
        stateList: [],
        state_id: '',
      },
      () => this.requestHandlerGetState('get-states', value),
    );
  }

  onStateChange(value) {
    this.setState({ state_id: value, error: '', cityList: [], city_id: '' }, () =>
      this.requestHandlerGetCity('get-cities', value),
    );
  }
  onCityChange(value) {
    this.setState({ city_id: value, error: '' });
  }

  async requestHandlerLogin(type, data) {
    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
          this.setState({ fetching: false, step: 3, otpError: false, error: '' });
          const obj = {
            access_token: responseJson.access_token,
            user_id: responseJson.user_id,
          };
      
          AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({ ...obj }));
          this.OTPBox();
        } else {
          this.ErrorBox(responseJson.errors.error_text);
          this.setState({
            error: responseJson.errors.error_text,
            fetching: false,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async requestHandlerGetState(type, value) {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('country_id', value);

    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
  
          this.setState({ stateList: responseJson.states, loading: false });
        } else {
          this.setState({ stateList: [], loading: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async requestHandlerGetCity(type, value) {
    const data = new FormData();
    data.append('server_key', server_key);
    data.append('state_id', value);

    return fetch(SERVER + requestRoutes[type].route, {
      method: requestRoutes[type].method,
      body: data,
      headers: {},
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.api_status === 200) {
          this.setState({ cityList: responseJson.cities, loading: false });
        } else {
          this.setState({ cityList: [], loading: false });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /////////////////////////// OLD FUNCTIONS - END ////////////////////////

  render() {
    /////////////// props start ////////////////////
    const choosePetProps = {
      step: this.state.step,
      pets: this.state.petTypes,
      selectedPet: this.state.selectedPet,
      fetching: this.state.fetching,
      handleStepUp: this.handleStepUp,
      handlePetSelection: this.handlePetSelection,
      handlePetDeselection: this.handlePetDeselection,
    };

    const basicDetailsProps = {
      petName: this.state.petName,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contact: this.state.contact,
      currentPet: this.state.currentPet,
      selectedPet: this.state.selectedPet,
      error: this.state.error,
      cca2: this.state.cca2,
      callingCode: this.state.callingCode,
      fetching: this.state.fetching,
      handleStepDown: this.handleStepDown,
      handleStepUp: this.handleStepUp,
      handlePetNameChange: this.handlePetNameChange,
      handleFirstNameChange: this.handleFirstNameChange,
      handleLastNameChange: this.handleLastNameChange,
      handleCountryChange: this.handleCountryChange,
      handleContactChange: this.handleContactChange,

      handleCreateAccountPressed: this.handleCreateAccountPressed,
    };

    const verifyPhoneNumberProps = {
      contact: this.state.contact,
      error: this.state.error,
      cca2: this.state.cca2,
      callingCode: this.state.callingCode,
      confirm: this.state.confirm,
      otpError: this.state.otpError,
      fetching: this.state.fetching,
      otp: this.state.otp,
      handleStepUp: this.handleStepUp,
      handleOTPChange: this.handleOTPChange,
      handleContactChange: this.handleContactChange,
      handleCountryChange: this.handleCountryChange,
      handleResendOtpPressed: this.handleResendOtpPressed,
    };

    const PetDetailsProps = {
      step: this.state.step,
      petName: this.state.petName,
      currentPet: this.state.currentPet,
      selectedPet: this.state.selectedPet,
      error: this.state.error,
      fetching: this.state.fetching,
      petBirthday: this.state.petBirthday,
      petGender: this.state.petGender,
      petSizes: this.state.petSizes,
      petSizesKeys: this.state.petSizesKeys,
      selectedSubPet: this.state.selectedSubPet,
      selectedPetSize: this.state.selectedPetSize,
      petSubTypes: this.state.petSubTypes,
      handleStepDown: this.handleStepDown,
      handleStepUp: this.handleStepUp,
      handlePetSubTypeSelect: this.handlePetSubTypeSelect,
      handlePetSizeSelect: this.handlePetSizeSelect,
      handlePetBirthdayChange: this.handlePetBirthdayChange,
      handlePetGenderChange: this.handlePetGenderChange,
      handlePetDetailsPressed: this.handlePetDetailsPressed,
    };

    const userDetailsProps = {
      error: this.state.error,
      email: this.state.email,
      birthday: this.state.birthday,
      gender: this.state.gender,
      accept: this.state.accept,
      firstName: this.state.firstName,
      handleStepUp: this.handleStepUp,
      handleStepDown: this.handleStepDown,
      handleEmailChange: this.handleEmailChange,
      handleGenderChange: this.handleGenderChange,
      handleBirthdayChange: this.handleBirthdayChange,
      handleUserDetailsPressed: this.handleUserDetailsPressed,
    };

    const PasswordProps = {
      error: this.state.error,
      password: this.state.password,
      confirm_password: this.state.confirm_password,
      fetching: this.state.fetching,
      accept: this.state.accept,
      handleStepUp: this.handleStepUp,
      handleStepDown: this.handleStepDown,
      handleTermsChange: this.handleTermsChange,
      handlePasswordChange: this.handlePasswordChange,
      handleConfirmPasswordChange: this.handleConfirmPasswordChange,
      handlePasswordsPressed: this.handlePasswordsPressed,
    };

    /////////////// props end ////////////////////

    const { step } = this.state;
    // var step = 4
    const { callingCode, contact } = this.state;
    var phone = { number: contact, callingCode: callingCode };
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor={'white'}
          barStyle={'dark-content'}
          translucent={false}
        />

        <Content>
          <View style={{ flex: 2 }}>
            <MainLogoForSignUp
              goBack={step == 1 ? this.goBack : this.handleStepDown}
              text={
                step == 1 ? (
                  'Select your pet category'
                ) : step == 2 ? (
                  'Create your free account today'
                ) : step == 3 ? (
                  'Verification code has been sent to your mobile number'
                ) : step == 4 ? (
                  <Text>
                    A little more about your{' '}
                    <Text style={{ color: HEADER }}>{this.state.petName}</Text>
                  </Text>
                ) : step == 5 ? (
                  <Text>
                    A little more about your{' '}
                    <Text style={{ color: HEADER }}>{this.state.petName}</Text>
                  </Text>
                ) : step == 6 ? (
                  <Text>
                    A little more about yourself,{' '}
                    <Text style={{ color: HEADER }}>{this.state.firstName}</Text>{' '}
                  </Text>
                ) : (
                  ''
                )
              }
              steps={step}
              {...choosePetProps}
              {...basicDetailsProps}
              handleCreateAccountPressed={() =>
                this.handleCreateAccountPressed()
              }
              phone={step == 3 && phone}
              testImage={
                step == 3
                  ? require('./../../assets/images/updated/VerifyCode.png')
                  : require('./../../assets/images/updated/CreateAccount.png')
              }
            />
          </View>
          <View style={{ flex: 7, marginTop: hp(2) }}>
            {step === 1 || step === 2 ? (
              <ChoosePet
                {...choosePetProps}
                {...basicDetailsProps}
                navigation={this.props.navigation}
              />
            ) : // ) : step === 2 ? (
              //   <BasicDetails {...basicDetailsProps} />
              step === 3 ? (
                <VerifyPhoneNumber {...verifyPhoneNumberProps} />
              ) : step === 4 || step === 5 ? (
                <PetDetails {...PetDetailsProps} />
              ) : step === 6 ? (
                <UserDetails {...userDetailsProps} {...PasswordProps} />
              ) : (
                // ) : step === 7 ? (
                //   <Password {...PasswordProps} />
                <ActivityIndicator
                  size={'large'}
                  color={HEADER}
                  style={{ flex: 1, justifyContent: 'center' }}
                />
              )}
            <DialogBox
              ref={dialogbox => {
                this.dialogbox = dialogbox;
              }}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  loginEdit: user => dispatch(userEdit(user)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupConnectView);
