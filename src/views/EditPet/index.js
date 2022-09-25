import React, { Fragment } from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PlaceholderLoader from '../../components/updated/PlaceholderLoader';
import moment from 'moment';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RadioForm from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';
import { CheckBox, Container, Content, Item, Label, Icon } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp,} from 'react-native-responsive-screen';

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

import _DropDown from '../../components/common/dropDown';
import {dobInfo,defaultImage,} from '../../constants/ConstantValues';
import { cause_Of_Death, PetSize } from '../../constants/ConstantValues';
import ErrorModal from '../../components/common/ErrorModal';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import EventEmitter from '../../services/eventemitter';
import {TEXT_INPUT_LABEL,black,darkSky,grey,placeholderColor} from '../../constants/colors';
import WhiteBtn from '../../components/common/WhiteBtn';
import DatePickerField from '../../components/common/DatePickeField';
import _DatePicker from '../../components/common/_DatePicker';
import InfoModal from '../../components/common/InfoModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import TextField from '../../components/common/TextField';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { LongAboutParseHtml } from '../../components/helpers';
import { Divider } from 'react-native-elements';
import BreedPicker from '../../components/common/BreedPicker'


const { ownerpets, getPetDataAfterUpdate } = petMyPalApiService;

var radio_btn_props = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

class EditPet extends React.Component {

  
  constructor(props) {
    super(props);
    this.navigationParams = this.props.navigation.getParam('petProfileInfo');
    this.state = {
      petInfoDisabled: 1,
      petInfo: this.props.navigation.getParam('petProfileInfo'),
      coverProfile: this.props.navigation.getParam('petProfileInfo').cover,

      petid: this.props.navigation.getParam('petProfileInfo').user_id,
      name: '',
      dob: '',
      gender: this.props.navigation.getParam('petProfileInfo').gender,
      about: '',
      adoptionDate: '',
      size: this.navigationParams?.pet_info? this.navigationParams?.pet_info?.pet_size_text ?? undefined : undefined,
      sizeIndex:undefined,
      token: '',
      avatarImage: {},
      coverImage: {},
      nameError: false,
      genderError: false,
      dobError: false,
      aboutError: false,
      sizeError: false,
      submit: false,
      loading: false,
      deactivate: false,
      saveDeactivate: '0',
      saveDeceased: '0',
      deceased: false,
      deceasedCheckbox: false,
      causeOfDeath: '1',
      causeOfDeathValue: cause_Of_Death[1]?.label,
      deceasedDate: moment(new Date()).format('YYYY/MM/DD'),
      currentDate: new Date(),
      deceasedPicker: false,
      noteFromOwner: '',
      noteError: false,
      deceasedDateError: false,
      infoText: '',
      isModal_Visible: false,
      isErrorModal_Visible: false,
      errorMessage: '',
      breedModalVisible: false,
      listOfBreeds: [],
      petSubTypes: [],
      searchValue: '',
      breed: this.props.navigation.getParam('petProfileInfo').pet_info.pet_sub_type_text,
      breedId:undefined,

      passPolicy: false,
      newdate: '',
      date: new Date(new Date().getTime() - 410240376000),
      headerText: 'Age Policy',

      isConfirm_Modal_visible: false,
      infoMsg: 'Are You Sure ? You Want To Undo Your Previous Action',
      InProcess: false,
      dd_Placeholder: true,
      maxdate: '',
    };
    
  }

  windowWidth = Dimensions.get('window').width;
  windowHeight = Dimensions.get('window').height;


  defaultSize = () => {
  
    let pet_size =
      this.props.navigation.getParam('petProfileInfo')?.pet_info
        ?.pet_size_text ?? undefined;

    switch (pet_size) {
      case 'Small':
        this.setState({ size: '0'  , sizeIndex:'1'});
        break;
      case 'Medium':
        this.setState({ size: '1' , sizeIndex:'2' });
        break;
      case 'Large':
        this.setState({ size: '2' , sizeIndex:'3' });
        break;
      case 'Extra Large':
        this.setState({ size: '3' , sizeIndex:'4' });
        break;

      default:
        break;
    }
  };

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  componentDidMount() {

    this.getAccessToken().then(TOKEN => {
      this.setState({ token: JSON.parse(TOKEN).access_token }, () => {
        this.defaultSize();
      });
    });
    let petInfo = this.props.navigation.getParam('petProfileInfo');

    var maxDate = ''
    if (Platform.OS == 'ios') {
      // maxDate = moment(petInfo.birthday, 'YYYY-MM-DD').format('MM-DD-YYYY');
      var maxDate = petInfo.birthday
    } else {
      var maxDate = petInfo.birthday
    }

    this.setState({
      name: petInfo.name,
      about: LongAboutParseHtml(petInfo.about),
      maxdate: new Date(),
      newdate : moment(maxDate).toDate()
      // newdate: new Date(maxDate),
    });
    this.getUpdatePetData();
    this.requestGetPetSubTypes(petInfo.pet_type)
  }

  componentWillUnmount() {
    this.goBackTimer;
    this.BackTimer;
    EventEmitter.off('UpdatedPetData', true);
  }


  async getUpdatePetData() {
    const returndata = await this.props.getPetDataAfterUpdate(
      this.state.token,
      server_key,
      this.props.navigation.getParam('petProfileInfo').user_id,
    );
    if (returndata?.api_status == 200) {
      this.setState({ petInfo: returndata?.user_data });
    }
  }


  requestGetPetSubTypes = async (value) => {
    const {breed}= this.state

    const formdata = new FormData();
    formdata.append('server_key', server_key);
    formdata.append('pet_type', value);
    const response = await petMyPalApiService.getPetSubTypes(formdata).catch((error) => {
      console.log(error);
    });

    const { data } = response

    if (data.api_status === 200) {
      let subtype = []
      let temp = [] //// just lable 
      data.pet_sizes.map((value, index) => {

       if(breed==value.name){
         this.setState({breedId:value.id})
       }
        subtype.push({ ...data.pet_sizes, label: value.name, value: value.id })
        temp.push(value.name)
      })

      this.setState({
        petSubTypes: subtype,
        listOfBreeds: temp
      });

    } else {
      this.setState({ petSubTypes: [] });
    }

  }

  goBack = () => {this.props.navigation.pop()};

  setBirthDate = () => {
    this.setState({
      isDatePicker_Visible: false,
      submit: true,
      // dob: moment(this.state.newdate).format('MM/DD/YYYY')
    });
  };

  selectDate = date => {
    this.setState({
      newdate: date,
      dob: moment(date).format('MM/DD/YYYY'),
    });
  };

  selectDeceasedDate = date => {
    this.setState({ currentDate: date });
  };

  setDeceasedDate = () => {
    const { currentDate } = this.state;
    // let dd = moment(currentDate).format('MM/DD/YYYY')
    let dd = moment(currentDate).format('YYYY/MM/DD');
    this.setState({ deceasedDate: dd, deceasedPicker: false });
  };

  hideDeceasedPicker = () => {
    this.setState({ deceasedPicker: false });
  };

  hideDatePicker = () => {
    this.setState({ isDatePicker_Visible: false });
  };

  closeModal = () => {
    this.setState({ isModal_Visible: false});
  };

  closeErrorModal = () => {
    this.setState({ isErrorModal_Visible: false});
  };

  handleGender = gender => {
    this.setState({
      gender,
      submit: true,
    });
  };

  showDatePicker = () => {
    this.setState({ isDatePicker_Visible: true });
  };

  showModal = () => {
    this.setState({
      isModal_Visible: true,
      infoText: dobInfo,
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
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const image = {
          name: response.fileName,
          // type: response.type,
          type: 'image/jpeg',
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
              coverProfile: image.uri,
            });
            break;
          default:
            break;
        }
      }
    });
  };

  validateForm = () => {
    let name_Is_Required = false;

    const { name } = this.state;
    if (!name) {
      this.setState({ nameError: true });
      name_Is_Required = true;
    }

    if (name_Is_Required) {
      return false;
    } else {
      return true;
    }
  };

  handleDeactivate = () => {
    this.setState(
      {
        saveDeactivate: this.state.petInfoDisabled == 0 ? '0' : '1',
        deactivate: false,
        submit: true,
      },
      () => {
        this.handleSubmitDeactivate();
      },
    );
  };

  handleDeceased = () => {
    let noteError, deceasedDateError;
    const { deceasedDate, noteFromOwner } = this.state;
    if (noteFromOwner === '') {
      noteError = true;
    } else {
      noteError = false;
    }
    if (deceasedDate === '') {
      deceasedDateError = true;
    } else {
      deceasedDateError = false;
    }
    this.setState({ noteError, deceasedDateError, submit: true });
    if (!noteError && !deceasedDateError) {
      this.setState(
        {
          saveDeceased: '1',
          deceased: false,
          submit: true,
        },
        () => {
          this.handleSubmitDeceased('update-pet-data');
        },
      );
    }
  };

  handleSubmit = async () => {

    const {
      name,gender,dob,about,size,sizeIndex,token,
      submit,petid,avatarImage,coverImage,breedId, breed
    } = this.state;

    if (submit) {
      if (this.validateForm()) {
        this.setState({loading: true});
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('pet_id', petid);

        if (name) {
          formData.append('name', name);
        }

        if (size) {
          formData.append('pet_size', sizeIndex);
        }
        if(breedId){
          formData.append('pet_subtype',breedId)
        }
    
        if (gender) {
          formData.append('gender', gender);
        }

        if (dob) {
          formData.append('birthday', dob);
        }

        if (about) {
          formData.append('about', about);
        }

        {
          avatarImage.uri ? formData.append('avatar', avatarImage) : null;
        }
        {
          coverImage.uri ? formData.append('cover', coverImage) : null;
        }
        
        console.log('formdata',formData );

        const response = await petMyPalApiService.updatePetData(token, formData)
          .catch(e => {
            console.log('here is error while updating Pet data', e);
          });
        const { data } = response;

        if (data.api_status == 200) {
          this.getUpdatePetData();
          this.setState({
            loading: false,
          });

          EventEmitter.emit('UpdatedPetData', true);
          this.BackTimer = setTimeout(() => {
            this.props.navigation.pop();
          }, 1500);
        } else {
          this.setState({
            loading: false,
            isErrorModal_Visible: true,
            errorMessage: 'Fail To Update Data',
          });
        }
      } else {
        this.setState({
          loading: false,
          isErrorModal_Visible: true,
          errorMessage: 'Pet Name Is Required',
        });
      }
    }
  };

  handleSubmitDeceased = async () => {
    const petProfile = this.props.petProfile;

    const {
      token,
      submit,
      petid,
      saveDeceased,
      deceasedCheckbox,
      deceasedDate,
      causeOfDeath,
      noteFromOwner,
    } = this.state;

    if (submit) {
      this.setState({
        loading: true,
      });

      const formData = new FormData();
      formData.append('server_key', server_key);
      formData.append('pet_id', petid);

      if (saveDeceased === '1') {
        formData.append('deceased', saveDeceased);
      }

      if (saveDeceased === '1') {
        formData.append('cause_of_death', causeOfDeath);
      }

      if (saveDeceased === '1') {
        formData.append('deceased_date', deceasedDate);
      }

      if (saveDeceased === '1') {
        formData.append('deceased_note', noteFromOwner);
      }

      if (deceasedCheckbox) {
        formData.append('stop_bd_wishes', '1');
      } else {
        formData.append('stop_bd_wishes', '0');
      }
      
      const response = await petMyPalApiService
        .updatePetData(token, formData)
        .catch(e => {
          console.log('here is error while updating Pet data', e);
        });
      const { data } = response;

      if (data.api_status == 200) {
        this.setState({
          loading: false,
        });
        EventEmitter.emit('UpdatedPetData', true);
        this.BackTimer = setTimeout(() => {
          this.props.navigation.pop();
        }, 1000); //TODO NOT SURE WETHER GO BACK OR NOT
      } else {
        // console.log('error  data ', data)
        this.setState({
          loading: false,
          isErrorModal_Visible: true,
          errorMessage: 'Fail To Update Data',
        });
      }
    }
  };

  handleSubmitDeactivate = async () => {
    const petProfile = this.props.petProfile;

    const { token, submit, petid, saveDeactivate } = this.state;
    if (submit) {
      this.setState({loading: true});

      const formData = new FormData();
      formData.append('server_key', server_key);
      formData.append('pet_id', petid);
      formData.append('disabled', saveDeactivate);
      const response = await petMyPalApiService
        .updatePetData(token, formData)
        .catch(e => {console.log('here is error while updating Pet data', e)});
      const { data } = response;
      if (data.api_status == 200) {
        this.setState({loading: false});
        EventEmitter.emit('UpdatedPetData', true);
        this.BackTimer = setTimeout(() => {
          this.BackTimer = this.props.navigation.pop();
        }, 1000);
      } else {
        this.setState({
          loading: false,
          isErrorModal_Visible: true,
          errorMessage: 'Fil To Update Data',
        });
      }
    }
  };

  closeConfirmModal = () => {
    this.setState({ isConfirm_Modal_visible: false });
  };

  handle_Undo_Deceased = async () => {
    this.setState({ InProcess: true });
    const petProfile = this.props.petProfile;
    const { token, petid } = this.state;

    const formData = new FormData();
    formData.append('server_key', server_key);
    formData.append('pet_id', petid);
    formData.append('deceased', '0');
    const response = await petMyPalApiService
      .updatePetData(token, formData)
      .catch(e => {
        console.log('here is error while updating Pet data', e);
      });
    const { data } = response;

    if (data.api_status == 200) {
      this.setState({
        InProcess: false,
        isConfirm_Modal_visible: false,
      });

      EventEmitter.emit('UpdatedPetData', true);
      this.BackTimer = setTimeout(() => {
        this.BackTimer = this.props.navigation.pop();
      }, 1000); //TODO NOT SURE WHETHER GO BACK OR NOT
    } else {
      this.setState({
        isConfirm_Modal_visible: false,
        InProcess: false,
      });
    }
  };

  modalContent = () => {
    const {
      deactivate,
      deceased,
      petInfo,
      deceasedDate,
      deceasedDateError,
      currentDate,
      noteError,
      causeOfDeathValue,
      dd_Placeholder

    } = this.state;

    if (deactivate === true && deceased === false) {
      return (
        <>
          <Modal
            isVisible={deactivate}
            fullScreen={false}
            useNativeDriver={true}
            onBackdropPress={() => this.setState({ deactivate: false })}>
            <View style={styles.outerView}>
              <View style={styles.overlayStyle}>
                <IonicIcon
                  onPress={() =>
                    this.setState({ deactivate: false, deceased: false })
                  }
                  size={20}
                  style={[styles.deceasedCloseBtn, { top: 0 }]}
                  color={'black'}
                  name={'close'}
                />
                <View style={styles.rowCenter}>
                  <Image
                    style={{
                      width: wp(50),
                      resizeMode: 'contain',
                    }}
                    source={require('./../../assets/images/updated/deactiveAccount.png')}
                  />
                </View>

                {petInfo.disabled == 1 ? (
                  <View style={styles.rowCenter}>
                    <Text style={{ color: '#424242', marginBottom: RFValue(15) }}>
                      {/* Are  You Sure ? You want to Activate {this.state.petInfo ? this.state.petInfo.name + "" : ''}. profile ? */}
                      PetMyPal is delighted to hear about{' '}
                      {this.state.petInfo ? this.state.petInfo.name + '' : ''}`s
                      reactivation status.
                    </Text>
                  </View>
                ) : (
                  <View>
                    <View style={styles.rowCenter}>
                      <Text
                        style={{ color: '#424242', marginBottom: RFValue(15) }}>
                        Your pet will not be visible to it's followers. Yellow
                        border will be depicted on pets profile picture.
                      </Text>
                    </View>
                    <View style={styles.rowCenter}>
                      <Text
                        style={{ color: '#424242', marginBottom: RFValue(15) }}>
                        Are you sure you want to deactivate your pet?
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.btnOuterView}>
              <SkyBlueBtn
                title={'Confirm'}
                onPress={() => this.handleDeactivate()}
                btnContainerStyle={styles.OkbtnView}
              />
              <SkyBlueBtn
                title={'Cancel'}
                onPress={() => this.setState({ deactivate: false })}
                btnContainerStyle={styles.CancelbtnView}
              />
            </View>
          </Modal>
        </>
      );
    } else if (deceased === true && deactivate === false) {
      return (
        <Modal
          isVisible={deceased}
          fullScreen={false}
          useNativeDriver={true}
          onBackdropPress={() => this.setState({ deceased: false })}>
          <View style={styles.overlayStyle}>
            <IonicIcon
              onPress={() =>
                this.setState({ deactivate: false, deceased: false })
              }
              size={20}
              style={styles.deceasedCloseBtn}
              color={'black'}
              name={'close'}
            />
            <View style={styles.rowCenter}>
              {petInfo.avatar ? (
                <View style={[styles.imgView, { marginTop: 0 }]}>
                  <Image
                    style={styles.imgStyle}
                    source={{ uri: petInfo.avatar }}
                  />
                </View>
              ) : (
                this.putDummyAvatar()
              )}
            </View>
            <Text style={styles.deceasedText}>
              PetMyPal is sorry for your loss.{' '}
              {this.state.petInfo ? this.state.petInfo.name + '' : ''} will be
              greatly missed.
            </Text>
            <View style={styles.stopWishView}>
              <CheckBox
                color={'#465575'}
                style={styles.checkbox}
                checked={this.state.deceasedCheckbox}
                onPress={() =>
                  this.setState({
                    deceasedCheckbox: !this.state.deceasedCheckbox,
                  })
                }
              />
              <Text>Stop showing birthday wishes</Text>
            </View>

            <DatePickerField
              label={'Deceased Date'}
              defaultVallue="Deceased Date"
              dob={deceasedDate ? deceasedDate : 'Decease Date'}
              onPress={() => this.setState({ deceasedPicker: true })}
              // openModal={this.showModal}
              errorDOB={deceasedDateError}
            />
            <_DatePicker
              date={currentDate}
              isVisible={this.state.deceasedPicker}
              header={'Select Deceased Date'}
              onDateChange={this.selectDeceasedDate}
              onSelect={this.setDeceasedDate}
              onClose={this.hideDeceasedPicker}
              deceasedDate={true}
              maxDate={new Date()}
            />

            <Label style={styles.labelStyle}>Cause of Death{' '}</Label>

            <_DropDown
              data={cause_Of_Death}
              selectedValue={causeOfDeathValue}
              staticValue={'Cause of death'}
              // error={categoryError}
              placeholder={causeOfDeathValue ? false : dd_Placeholder}
              style={{
                backgroundColor: 'null',
                width: wp(80),
                alignSelf: 'center',
                borderBottomWidth: 0,
              }}
              dropdownPosition={-4.5}
              pickerStyle={{
                width: wp(80),
                alignSelf: 'center',
                marginLeft: 40,
              }}
              onChangeText={(value, index, data) => {
                this.setState({
                  causeOfDeath: index,
                  causeOfDeathValue: data[index].label,
                  dd_Placeholder: false,
                });
              }}
            />
            <Divider style={{borderBottomColor:grey , borderBottomWidth:1}}/>
            
            <TextField
              labelColor={TEXT_INPUT_LABEL}
              label={'Remembrance Message'}
              placeholder={'Type here'}
              onChangeText={t =>
                this.setState({
                  noteFromOwner: t,
                  noteError: false,
                })
              }
              value={this.state.noteFromOwner}
              maxLength={200}
              error={noteError}
              containerStyle={{ marginBottom: 15,marginTop:10 }}
            />

            <SkyBlueBtn
              title={'Save'}
              onPress={() => this.handleDeceased()}
              btnContainerStyle={styles.saveBtn}
            />
          </View>
          {Platform.OS == 'ios' ? <KeyboardSpacer /> : null}
        </Modal>
      );
    }
  };

  putDummyAvatar = () => {
    const { petInfo } = this.state;
    let avatarSource = CatImage;
    let type = petInfo?.pet_info?.pet_type_text ?? '';
    if (type === 'Cat') {
      avatarSource = CatImage;
    } else if (type === 'Dog') {
      avatarSource = DogImage;
    } else if (type === 'Cow') {
      avatarSource = CowImage;
    } else if (type === 'Fish') {
      avatarSource = FishImage;
    } else if (type === 'Parrot') {
      avatarSource = ParrotImage;
    } else if (type === 'Horse') {
      avatarSource = HorseImage;
    } else if (type === 'Bird') {
      avatarSource = BirdImage;
    } else if (type === 'Pig') {
      avatarSource = PigImage;
    } else if (type === 'Rabbit') {
      avatarSource = RabbitImage;
    } else if (type === 'Snake') {
      avatarSource = SnakeImage;
    } else if (type === 'Rodent') {
      avatarSource = RodentImage;
    } else if (type === 'Turtle') {
      avatarSource = TurtleImage;
    } else if (type === 'Others') {
      avatarSource = OtherImage;
    }

    return (
      <Image
        style={{
          width: wp(30),
          height: wp(30),
          resizeMode: 'contain',
        }}
        source={avatarSource}
      />
    );
  };

/*********************** custom dd *************************/
filterData = (query) => {
  const { listOfBreeds } = this.state
  if (query === '') {
    return listOfBreeds
  }
  const regex = new RegExp([query.trim()], 'i')
  return listOfBreeds.filter((c) => c.search(regex) >= 0)
}

handleBreadSelection = (item) => {
  const { petSubTypes } = this.state
  var FOUND = petSubTypes.find(function (post, index) {
    if (post.label == item)
      return post;
  });

  this.setState({
    breedId: FOUND.value,
    breed: item,
    searchValue: '', // if user again open modal will see all breed again
    breedModalVisible: false,
    submit:true,
  })
}

onValueChange = (value) => {
  this.setState({
    breed: value,
    searchValue: value // will do empity once user select its value
  })
}

showBreedList = () => {
  const { breedModalVisible } = this.state
  this.setState({
    breedModalVisible: !breedModalVisible
  })
}



  render() {
    const {
      petInfo,
      avatarImage,
      coverImage,
      nameError,
      dobError,
      size,
      dob,
      deceased,
      deactivate,
      coverProfile,
      isModal_Visible,
      newdate,
      isDatePicker_Visible,
      infoText,
      passPolicy,
      headerText,
      name,
      about,
      isErrorModal_Visible,
      errorMessage,
      infoMsg,
      InProcess,
      isConfirm_Modal_visible,
      dd_Placeholder,
      maxdate,
      breedModalVisible,
      searchValue,
      breed,
      breedId

    } = this.state;

    // console.log('here is breed', breedId);
    const { pet_type_text } = petInfo?.pet_info ?? '';

    /********************** custom dropdown  ***********************/
    filteredBreed = this.filterData(searchValue)

    return (
      <Container>
        {this.state.loading && (
          <View style={styles.loaderPosition}>
            <PlaceholderLoader />
          </View>
        )}

        {deactivate || deceased ? <View style={styles.backdrop} /> : null}
        {deactivate || deceased ? <View>{this.modalContent()}</View> : null}

        <Content style={styles.container}>
          <Image
            source={{ uri: this.state.avatar?.uri ?? coverProfile }}
            style={styles.coverImg}
          />

          <View style={styles.header}>
            <Icon
              onPress={() => this.goBack()}
              name={'ios-chevron-back'}
              type={'Ionicons'}
              style={
                coverProfile != defaultImage
                  ? [styles.iconStyle]
                  : [styles.iconStyle, { color: darkSky }]
              }
            />
            <Text
              style={
                coverProfile != defaultImage
                  ? [styles.headerText]
                  : [styles.headerText, { color: black }]
              }>
              Edit Pet
            </Text>
          </View>

          <View style={styles.cardView}>
            <View style={styles.cardStyle}>
              <View style={styles.cardView}>
                <View style={styles.imgView}>
                  <Image
                    style={styles.imgStyle}
                    source={{ uri: petInfo.avatar }}
                  />
                </View>
              </View>

              <View style={{ marginVertical: wp(3) }}>
                <Text style={styles.nameStyle}>
                  {petInfo.name}{' '}
                  <Text
                    onPress={() => {
                      if (
                        petInfo.petowner_profile.user_id ==
                        this?.props?.user?.user_data?.user_id
                      ) {
                        this.props.navigation.navigate('UserProfile');
                      } else {
                        this.props.navigation.navigate({
                          routeName: 'Profile',
                          key: 'Profile',
                          params: { user_id: petInfo.petowner_profile.user_id },
                        });
                      }
                    }}
                    style={styles.nameStyle}>
                    (@{petInfo.parent_name})
                  </Text>
                </Text>
                <Text style={styles.joiningDate}>
                  {petInfo &&
                    petInfo.pet_info &&
                    petInfo.pet_info.pet_sub_type_text}
                </Text>
              </View>

              <WhiteBtn
                title={'SAVE'}
                onPress={() => this.handleSubmit()}
                btnContainerStyle={styles.btnContainerStyle}
              />
            </View>
          </View>

          <View style={styles.viewForInput}>
            <Text style={styles.NameText}>General Setting</Text>
            <View style={{ marginTop: 10 }}>
              <DatePickerField
                label={'Date of birth'}
                defaultVallue="Date of birth"
                dob={dob === '' ? petInfo.birthday : dob}
                onPress={this.showDatePicker}
                errorDOB={dobError}
              />
              <Item
                stackedLabel
                style={{
                  alignItems: 'flex-start',
                  borderBottomColor: grey,
                  borderBottomWidth: 1,
                }}>
                <Label style={styles.inputLabel}>Gender</Label>

                <RadioForm
                  style={{ marginTop: 15 }}
                  radio_props={radio_btn_props}
                  initial={this.state.gender === 'male' ? 0 : 1}
                  formHorizontal={true}
                  labelHorizontal={true}
                  labelColor={'red'}
                  buttonColor={'#40c4ff'}
                  selectedButtonColor={'#40c4ff'}
                  onPress={value => this.handleGender(value)}
                  buttonInnerColor={'red'}
                  buttonOuterColor={'black'}
                  animation={true}
                  buttonWrapStyle={{ marginLeft: 10 }}
                  buttonSize={10}
                  labelStyle={{
                    fontSize: RFValue(12),
                    color: 'black',
                    paddingRight: 20,
                  }}
                />
              </Item>
              <TextField
                label={'Pet Name'}
                labelColor={'grey'}
                placeholder={'Enter Pet Name'}
                onChangeText={t =>
                  this.setState({
                    submit: true,
                    name: t,
                    nameError: false,
                  })
                }
                value={name}
                error={nameError}
                containerStyle={{ marginTop: 10 }}
              />

              {pet_type_text == 'Dog' && (
                <View style={styles.petSizeView}>
                 <Label style={[styles.inputLabel, { marginTop: 0 }]}>Pet Size</Label>
                  <_DropDown
                    data={PetSize}
                    selectedValue={PetSize[size]?.label}
                    staticValue={'Pet Size'}
                    // error={categoryError}
                    placeholder={size ? false : dd_Placeholder}
                    style={{
                      backgroundColor: 'null',
                      width: wp(87),
                      alignSelf: 'center',
                      borderBottomWidth: 0,
                    }}
                    dropdownPosition={-4.5}
                    pickerStyle={{
                      width: wp(87),
                      alignSelf: 'center',
                      marginLeft: 20,
                    }}
                    onChangeText={(value, index, data) =>{
                      console.log('index value', value)
                      this.setState({
                        size: value,
                        sizeIndex:value,
                        submit: true,
                        dd_Placeholder: false,
                      })
                    }

                    }
                  />

                </View>
              )}
          <Label style={[styles.inputLabel, { marginTop: 10 }]}>Breed</Label>
          <TouchableOpacity
            onPress={() => this.showBreedList()}
            activeOpacity={1}
            style={[styles.breedView]}
          >
            <View style={styles.breadInnerView}>
              {breed ?
                <Text style={styles.breedText} >{breed}</Text> :
                <Text style={[styles.breedText, { color: placeholderColor, }]}>Select Bread</Text>
              }
              <Icon
                name={'caretdown'}
                type={'AntDesign'}
                style={styles.downArrow}
              />
            </View>
          </TouchableOpacity>

              <TextField
                label={'About'}
                labelColor={'grey'}
                placeholder={'Type here'}
                onChangeText={t =>
                  this.setState({
                    submit: true,
                    about: t,
                  })
                }
                value={about}
                multiline={true}
                maxLength={500}
                containerStyle={{ marginTop: 11 }}
              />
            </View>
          </View>

          <View style={styles.viewForInput}>
            <Text style={styles.NameText}>Avatar & Cover Photo</Text>
            <View>
              <Text style={styles.bottomText}>Cover Photo</Text>
              {coverImage.uri ? (
                <View>
                  <Image
                    style={styles.coverAvatar}
                    source={{ uri: coverImage.uri }}
                  />
                  <FontAwesome5
                    name="window-close"
                    onPress={() => this.setState({ coverImage: {} })}
                    color="white"
                    style={{ position: 'absolute', right: 0, top: -1 }}
                    size={25}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => this.handleImageChange('Cover')}
                  style={[styles.coverAvatar, { overflow: 'hidden' }]}>
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      alignSelf: 'center',
                    }}
                    source={{ uri: petInfo.cover }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ justifyContent: 'space-around' }}>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.bottomText}>Avatar</Text>
                {avatarImage.uri ? (
                  <View>
                    <Image
                      style={styles.profileAvatar}
                      source={{ uri: avatarImage.uri }}
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
                      style={{
                        height: '100%',
                        width: '100%',
                        alignSelf: 'center',
                      }}
                      source={{ uri: petInfo.avatar }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.btnRow}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  petInfo.disabled === '1'
                    ? this.setState({ deactivate: true, petInfoDisabled: 0 })
                    : this.setState({ deactivate: true });
                }}
                style={[
                  styles.yellowBtn,
                  {
                    backgroundColor:
                      petInfo.disabled === '1' ? '#F47D8A' : '#FFAF3E',
                  },
                ]}>
                <Text style={[styles.btnText, { color: 'white' }]}>
                  {petInfo.disabled === '1'
                    ? 'Activate'
                    : 'Deactivate my pet account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  petInfo.deceased === '1'
                    ? //   this.goBack()
                    this.setState({ isConfirm_Modal_visible: true })
                    : this.setState({ deceased: true });
                }}
                style={styles.greyBtn}>
                <Text style={styles.btnText}>
                  {petInfo.deceased === '1'
                    ? 'Deceased'
                    : 'My pet has deceased'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>

        <_DatePicker
          maxDate={maxdate}
          date={newdate}
          isVisible={isDatePicker_Visible}
          header={'Select Date of Birth'}
          onDateChange={this.selectDate}
          onSelect={this.setBirthDate}
          onClose={this.hideDatePicker}
        />

        <InfoModal
          isVisible={isModal_Visible}
          onBackButtonPress={() => this.closeModal()}
          info={infoText}
          headerText={headerText}
          policy={passPolicy}
          onPress={() => this.closeModal()}
        />
        <ErrorModal
          isVisible={isErrorModal_Visible}
          onBackButtonPress={() => this.closeErrorModal()}
          info={errorMessage}
          heading={'Hoot!'}
          onPress={() => this.closeErrorModal()}
        />
        <ConfirmModal
          isVisible={isConfirm_Modal_visible}
          onPress={this.closeConfirmModal}
          info={infoMsg}
          DoneTitle={'Ok'}
          onDoneBtnPress={this.handle_Undo_Deceased}
          CancelTitle={'Cancel'}
          onCancelBtnPress={this.closeConfirmModal}
          processing={InProcess}
        />
        <BreedPicker
          isVisible={breedModalVisible}
          data={filteredBreed}
          onItemClick={this.handleBreadSelection}
          onChangeText={(value) => this.onValueChange(value)}
          onBackdropPress={this.showBreedList}
          value={searchValue}
          // loading={loading}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  petProfile: state.mypets.petProfile,
});

export default connect(
  mapStateToProps,
  { ownerpets, getPetDataAfterUpdate },
)(EditPet);
