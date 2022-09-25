import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import { DANGER, TEXT_INPUT_LABEL, PINK, black, labelFont, grey, placeholderColor, White } from '../../constants/colors';
import posed, { Transition } from 'react-native-pose';
import { Container, Content, Icon } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import { Platform } from 'react-native';
import {server_key } from '../../constants/server';
import TextField from '../../components/common/TextField';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import AsyncStorage from '@react-native-community/async-storage';
import { ACCESS_TOKEN, SELECTED_PET } from '../../constants/storageKeys';
import ErrorModal from '../../components/common/ErrorModal'
import Label from '../../components/common/Label';
import { isIphoneX } from 'react-native-iphone-x-helper';
import BreedPicker from '../../components/common/BreedPicker'
import DeckCard from '../../views/SignupConnectView/DeckCard';
import { cards, Years, months } from '../../constants/ConstantValues'
import _DropDown from '../../components/common/dropDown';
import RadioForm from 'react-native-simple-radio-button';
import { StackActions, NavigationActions } from 'react-navigation';
import styles from './styles'
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import CustomLoader from '../../components/common/CustomLoader';
import { connect } from 'react-redux';
import { petMyPalGroupApiService } from '../../services/PetMyPalGroupApiService';
const { getPetCategory } = petMyPalGroupApiService;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const window = Dimensions.get('window');
let filteredBreed = ''

var radio_btn_props = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

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
    this.petNameRef = React.createRef()


    this.state = {
      petId: 0,
      selectedPet: {},
      currentPet: '',
      petSubTypes: [],
      step: 1,
      selectM: undefined,
      selectY: '',
      petBirthday: 0,
      petGender: '',
      monthsError: false,
      yearsError: false,
      genderError: false,
      petType: [],
      petName: '',

      petNameError: false,
      infoText: '',
      countryCode: '',
      selectedPetSize: cards[0],
      /********* custom dd *******/
      breed: '',
      breedError: '',
      searchValue: '',
      listOfBreeds: [],
      // is_breedSelected: true,
      breedModalVisible: false,
      loading: false,
      kgSelected: false,
      lbsSelected: true,
      yearPlaceholder: true,
      monthPlaceholder: true,
      breedPlaceholder: true,
      sending: false,
      isKeyboardOpen: false,
      token: '',
      user_id: '',
      randomKey: 'FooterBarView',

    }
  }

  goBack = () => {
    const { step } = this.state
    if (step == 1) {

      this.props.navigation.pop()

    } else {
      this.setState({ step: 1, petId: 0, selectedPet: {} })
    }

  }


  componentDidMount() {
    this.getPetCategoryList();

    let r = Math.random().toString(36).substring(7);

    let tempVal = ''
    tempVal = `${this.state.cca2},${this.state.callingCode}`
    // this.setState({
    //   countryCode: tempVal
    // })

    this.getAccessToken()
      .then((Token) => {
        let TOKEN = JSON.parse(Token).access_token;
        let user_id = JSON.parse(Token).user_id;
        // console.log('token is ' , TOKEN)
        this.setState({
          token: TOKEN,
          user_id: user_id,
          randomKey: r,   /// important
          countryCode: tempVal

        })
      })

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpen: true })
    // alert('Keyboard Shown');
  }

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpen: false })
    // alert('Keyboard Hidden');
  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }
  async getPetCategoryList() {
    const response = await this.props.getPetCategory();
    this.setState({ petType: response.data.pet_types })
  }

  requestGetPetSubTypes = async (value) => {
    console.log('value', value);
    this.setState({ loading: true })
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
        subtype.push({ ...data.pet_sizes, label: value.name, value: value.id })
        temp.push(value.name)
      })

      this.setState({
        petSubTypes: subtype,
        loading: false,
        listOfBreeds: temp
      });

    } else {
      this.setState({ petSubTypes: [], loading: false });
    }

  }

  petAge_years = (value, index, data) => {
    const { selectM } = this.state
    if (selectM) {
      this.setState({
        selectY: value,
        monthsError: false,
        yearsError: false,
        yearPlaceholder: false
      }, () => this.getDBO())
    }
    else {
      this.setState({
        selectY: value,
        selectM: '0',
        monthsError: false,
        yearsError: false,
        yearPlaceholder: false
      }, () => this.getDBO())

    }
  }

  petAge_month = (value, index, data) => {
    const { selectY } = this.state
    if (selectY) {
      this.setState({
        selectM: value,
        monthsError: false,
        yearsError: false,
        monthPlaceholder: false
      }, () => this.getDBO())
    }
    else {
      this.setState({
        selectM: value,
        selectY: '0',
        monthsError: false,
        yearsError: false,
        monthPlaceholder: false
      }, () => this.getDBO())
    }
  }

  getDBO = () => {
    const { selectM, selectY } = this.state

    let getMonths = 0
    if (selectY > -1) {
      getMonths = (selectY) * 12
    } if (selectM > 0) {
      getMonths = selectM

    } if (selectM > 0 && selectY > 0) {
      getMonths = ((selectY) * 12) + selectM
    }
    if (getMonths > 0) {
      var x = -getMonths;
      var CurrentDate = new Date();
      CurrentDate.setMonth(CurrentDate.getMonth() + x);

      var m = CurrentDate.getMonth() + 1
      if (m <= 9) {
        m = '0' + m
      }
      var d = CurrentDate.getDate()
      if (d <= 9) {
        d = '0' + d
      }

      this.handlePetBirthdayChange(
        `${d}-${m}-${CurrentDate.getFullYear()}`,
      );
    }
  }
  handlePetBirthdayChange = (bd) => {
    this.setState({ petBirthday: bd })
  }

  handlePetSelection = async (pet) => {
    const { selectedPet } = this.state
    this.setState({
      currentPet: selectedPet,
      step: 2
    }, () => this.requestGetPetSubTypes(selectedPet.id));

    try {
      await AsyncStorage.setItem(SELECTED_PET, JSON.stringify(selectedPet));
    } catch (err) {
      console.log('async error', err);
    }

  };




  handleBreadSelection = (item) => {
    const { petSubTypes } = this.state
    var FOUND = petSubTypes.find(function (post, index) {
      if (post.label == item)
        return post;
    });

    this.setState({
      selectedSubPet: FOUND.value,
      breed: item,
      searchValue: '', // if user again open modal will see all breed again
      breedError: false,
      // is_breedSelected: true,
      breedModalVisible: false
    })
  }

  onValueChange = (value) => {
    this.setState({
      breed: value,
      // is_breedSelected: false,
      breedError: false,
      selectedSubPet: '',
      searchValue: value // will do empity once user select its value
    })
  }

  showBreedList = () => {
    const { is_breedSelected, breedModalVisible } = this.state
    this.setState({
      // is_breedSelected: !is_breedSelected,
      breedModalVisible: !breedModalVisible
    })
  }




  changePet = () => { this.setState({ step: 1, petId: 0, selectedPet: {}, breed: '' }) }


  handlePetGenderChange = (e) => {
    this.setState({ petGender: e, genderError: false })
  }

  handlePetSizeSelectRight = (value) => {

    var ind = Number(value.index)
    // ind = ind + 1
    if (ind === 4) {
      ind = 0
    }
    let selectedPet = cards[ind]
    this.setState({ selectedPetSize: selectedPet, })

  }
  handlePetSizeSelectLeft = (value) => {
    var ind = Number(value.index)
    ind = ind - 1

    if (ind === 0) {
      ind = 3
    } else {
      ind = ind - 1  // in cards arrary index start from 1 and end at 4  thats why 
    }
    let selectedPet = cards[ind]
    this.setState({ selectedPetSize: selectedPet, })
  }

  petWeightUnitSelection = (value) => {
    if (value === 'lbs') {
      this.setState({ kgSelected: false, lbsSelected: true })
    } else {
      this.setState({ kgSelected: true, lbsSelected: false })
    }
  }

  closeModal = () => { this.setState({ isModal_Visible: false }) }


  AddPet = async () => {
    let err = false
    let {
      petName,
      selectM,
      selectY,
      petGender,
      breed,
      petId,
      selectedPet,
      selectedPetSize,
      petBirthday,
      selectedSubPet,
      token,
      randomKey,
      user_id
    } = this.state

    if (!petName) {
      this.setState({ petNameError: true })
      err = true
    }
    if (selectM === undefined) {
      this.setState({ monthsError: true })
      err = true
    }
    if (!selectY) {
      this.setState({ yearsError: true })
      err = true
    }

    if (selectM == 0 && selectY == 0) {
      this.setState({ monthsError: true, yearsError: true })
      err = true
    }


    if (!breed) {
      this.setState({ breedError: true })
      err = true
    }
    if (!petGender) {
      this.setState({ genderError: true })
      err = true
    }

    if (!err) {
      this.setState({ sending: true })

      const formdata = new FormData();
      formdata.append('server_key', server_key);
      formdata.append('pet_name', petName);
      formdata.append('pet_type', selectedPet.id);
      formdata.append('pet_size', selectedPetSize.index);
      formdata.append('sub_type', selectedSubPet);
      formdata.append('gender', petGender);
      formdata.append('birthday', petBirthday);
      formdata.append('user_id', user_id)
      
      const response = await petMyPalApiService.createPet(token, formdata).catch((error) => {
        console.log('Network Request fail', error)

      })
      const { data } = response;
      if (data.api_status === 200) {

        //  this.setState({sending:false})

        this.resetAndNavigate({
          routeName: 'FooterBarView',
          key: randomKey,
          // params: { willRefresh: true },
        });
      }
      console.log('pet added successfully ', data)
    }

  }

  resetAndNavigate = routeName => {
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ ...routeName })],
    });
    navigation.dispatch(resetAction);
    // this.props.navigation.navigate('FooterBarView')
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

  petChooseVew = () => {
    const { petId, petType } = this.state
    return (
      // <StepOne key="a">
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
        {console.log('selected pets', this.state.selectedPet)
        }
      </View>

      // </StepOne>

    )
  }

  petDetail = () => {
    const {
      currentPet,
      petNameError,
      breedError,
      breed,
      kgSelected,
      lbsSelected,
      selectY,
      yearPlaceholder,
      yearsError,
      selectM,
      monthPlaceholder,
      monthsError,
      genderError,
      petGender,
      petId,
      isKeyboardOpen,
      sending,

    } = this.state

    return (
      // <StepTwo key="b">
      <View>
        <View style={[styles.chosenPet, {
          //  marginTop: 0,
            position:'absolute',
            zIndex:1,
            marginTop:Platform.OS=='android'?hp(-5): isIphoneX()? hp(-4): hp(-2),
            alignSelf:'center',
             }]}>
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
            <Text style={[styles.changePetText, { color: '#20ace2' }]}>Change Pet</Text>
          </TouchableOpacity>
        </View>

        <View style={{ 
          marginHorizontal: 10, 
          marginTop:Platform.OS=='android'?hp(9): isIphoneX()? hp(9): hp(13),
          }}>

          {petId === 2 &&
            <View
              style={{ marginBottom: 10, height: 150 }}
            >

              <Label
                text={'Size'}
                style={{ marginBottom: 5 }}
              />
              <DeckCard
                handlePetSizeSelectRight={this.handlePetSizeSelectRight}
                handlePetSizeSelectLeft={this.handlePetSizeSelectLeft}
                handleUnitSelection={this.petWeightUnitSelection}
                kgSelected={kgSelected}
                lbsSelected={lbsSelected}
              />
            </View>
          }


          <TextField
            label={"Pet Name"}
            placeholder={'Enter Pet Name'}
            value={this.state.petName}
            onChangeText={(text) => this.setState({
              petName: text,
              petNameError: false,
              error: false
            })}
            onSubmitEditing={Keyboard.dismiss}
            error={petNameError}
            containerStyle={{ marginTop: 20, width: wp(82) }}
          />

          <Label
            text={'Breed'}
            style={{ color: breedError ? DANGER : TEXT_INPUT_LABEL }}
          />
          <TouchableOpacity
            onPress={() => this.showBreedList()}
            activeOpacity={1}
            style={breedError ? [styles.breedViewError, { width: wp(82) }] : [styles.breedView, { width: wp(82) }]}
          >
            <View style={styles.breadInnerView}>
              {breed ?
                <Text style={styles.breedText} >{breed}</Text> :
                <Text style={[styles.breedText, { color: placeholderColor, }]} >Select Bread</Text>
              }
              <Icon
                name={'caretdown'}
                type={'AntDesign'}
                style={styles.iconStyle}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.ddContainer}>
            <View style={{ width: wp(30), borderBottomColor: grey, borderBottomWidth: 1 }}>
              <Label
                text={'Years'}
                error={yearsError}
              />
              <_DropDown
                data={Years}
                selectedValue={selectY}
                staticValue={'Years'}
                error={yearsError}
                placeholder={yearPlaceholder}
                dropdownPosition={isKeyboardOpen ? -11.5 : -4.5}
                dropdownWidth={'100%'}
                pickerStyle={{ width: wp(36) }}
                style={{ backgroundColor: 'null', width: wp(30) }}
                onChangeText={(value, index, data) => this.petAge_years(value, index, data)}
              />
            </View>
            <View style={{ width: wp(30), borderBottomColor: grey, borderBottomWidth: 1 }}>
              <Label
                text={'Months'}
                error={monthsError}
                style={{ marginVertical: 3 }}
              />

              <_DropDown
                data={months}
                selectedValue={selectM}
                staticValue={'Months'}
                error={monthsError}
                placeholder={monthPlaceholder}
                dropdownPosition={isKeyboardOpen ? -11.5 : -4.5}
                style={{ backgroundColor: 'null', width: wp(30) }}
                pickerStyle={{ marginLeft: wp(58), width: wp(36) }}
                onChangeText={(value, index, data) => this.petAge_month(value, index, data)}
              />
            </View>

          </View>


          <Label
            text={'Gender '}
            style={{
              marginTop: 10,
              color: genderError ? DANGER : TEXT_INPUT_LABEL
            }}
          />

          <RadioForm
            style={{ marginTop: 10 }}
            radio_props={radio_btn_props}
            initial={-1}
            formHorizontal={true}
            labelHorizontal={true}
            labelColor={'red'}
            buttonColor={TEXT_INPUT_LABEL}
            selectedButtonColor={PINK}
            onPress={this.handlePetGenderChange}
            buttonInnerColor={'red'}
            buttonOuterColor={black}
            animation={true}
            buttonWrapStyle={{ marginLeft: 10 }}
            buttonSize={10}
            labelStyle={{
              fontSize: labelFont,
              color: petGender ? black : placeholderColor,
              paddingRight: 20
            }}
          />
          <View style={genderError ? [styles.bottomBorderError, { width: wp(82) }] : [styles.bottomBorder, { width: wp(82) }]}></View>

        </View>
      </View>
      // </StepTwo>

    )
  }




  render() {

    const {
      petId,
      step,
      isModal_Visible,
      sending,
      /********* custom dd ****/
      breed,
      searchValue,
      // is_breedSelected,
      breedModalVisible,
      loading,
      petType
    } = this.state


    /********************** custom dropdown  ***********************/
    filteredBreed = this.filterData(searchValue)


    return (
      // <Container style={{ flex: 1 }}>
      // <Content> 
      <KeyboardAwareScrollView style={{flex:1, backgroundColor:White}}>
        <MainLogoForSignUp
          goBack={() => this.goBack()}
          text={
            step === 1 ?
              "Let's begin your pet journey together!"
              : "Let's begin your pet journey together!"
          }
          heading={'Add Pet'}
          headingContainer={{ marginTop: 5 }} />

        <View style={{
          width: window.width * 0.9,
          alignSelf: 'center',
          marginTop: Platform.OS == 'android' ? 5 : isIphoneX() ? hp(-5) : hp(-2),
        }}>
          {/* <Transition> */}
          {step === 1 ? (
            this.petChooseVew()
          ) : step === 2 ? (
            this.petDetail()
          ) : null}

          {/* </Transition> */}

          <View style={{ justifyContent: 'center', marginTop: wp(2), marginBottom: 10, }}>
            <View style={[styles.btnView]}>

              {step === 1 ?
                <SkyBlueBtn
                  btnContainerStyle={{ alignSelf: 'center',marginTop: 10 }}
                  title={'Next'}
                  onPress={() => {
                    petId === 0 ?
                      this.setState({ isModal_Visible: true, infoText: 'Select Your Pet Type' })
                      :
                      this.handlePetSelection(petId)
                  }} />
                : step === 2 && sending ?
                  <View style={{ marginTop: 10 }}>
                    <CustomLoader />
                  </View>
                  :
                  <SkyBlueBtn
                    btnContainerStyle={{ alignSelf: 'center', marginTop: 10 }}
                    title={'Next'}
                    onPress={() => this.AddPet()}
                  />}

            </View>

          </View>

        </View>

        <ErrorModal
          isVisible={isModal_Visible}
          onBackButtonPress={() => this.closeModal()}
          info={this.state.infoText}
          heading={'Hoot!'}
          onPress={() => this.closeModal()}
        />
        <BreedPicker
          isVisible={breedModalVisible}
          data={filteredBreed}
          onItemClick={this.handleBreadSelection}
          onChangeText={(value) => this.onValueChange(value)}
          onBackdropPress={this.showBreedList}
          value={searchValue}
          loading={loading}
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

