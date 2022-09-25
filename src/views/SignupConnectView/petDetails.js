import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import {
  TEXT_INPUT_LABEL,
  White,
  grey,
  DANGER,
  black,
  PINK,
  placeholderColor,
} from '../../constants/colors';
import DeckCard from './DeckCard';
import AsyncStorage from '@react-native-community/async-storage';
import { Years, months } from '../../constants/ConstantValues'
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN, SELECTED_PET, PetName } from '../../constants/storageKeys';
import RadioForm from 'react-native-simple-radio-button';
import MainLogoForSignUp from '../../components/updated/MainLogoForSignUp';
import Label from '../../components/common/Label'
import _DropDown from '../../components/common/dropDown';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import { Container, Content, Icon } from 'native-base';
import { cards } from '../../constants/ConstantValues'
import { labelFont, textInputFont } from '../../constants/fontSize';
import ErrorModal from '../../components/common/ErrorModal';
import { Capitalize } from '../../utils/RandomFuncs';
import CustomDropDown from '../../components/common/CustomDropdown';
import { width, height, totalSize } from 'react-native-dimension';
import { Platform } from 'react-native';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import BreedPicker from '../../components/common/BreedPicker'
import CustomLoader from '../../components/common/CustomLoader';
import axios from 'axios'



let filteredBreed = ''


var radio_btn_props = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];
const window = Dimensions.get('window');

class PetDetails extends Component {

  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      selectM: undefined,
      selectY: '',
      petBirthday: 0,
      petGender: '',
      petSubTypes: [],
      breedError: false,
      monthsError: false,
      yearsError: false,
      genderError: false,
      selectedPet: 0,
      PetName: '',
      selectedSubPet: '',
      selectedPetSize: cards[0],
      error: false,
      kgSelected: false,
      lbsSelected: true,
      fetching: false,
      token: '',
      yearPlaceholder: true,
      monthPlaceholder: true,
      breedPlaceholder: true,
      isErrorModal_Visible: false,
      errorMessage: '',

      isKeyboardShown: false,

      /********* custom dd *******/
      breed: '',
      searchValue: '',
      listOfBreeds: [],
      is_breedSelected: true,
      breedModalVisible: false,
      loading: false,
    }
  }

  async componentDidMount() {
    let TOKEN = null
    let myPetName = ''

    // this.getAccessToken()
    // .then((token) => {
    //   TOKEN = JSON.parse(token).access_token;
    //   this.setState({ token: TOKEN })
    // })

    // console.log('props component Didmount ', this.props.navigation.state.params.param)

    const selectedPet = await AsyncStorage.getItem(SELECTED_PET);
    let pet = JSON.parse(selectedPet)

    myPetName = await AsyncStorage.getItem(PetName);


    this.setState({
      selectedPet: pet.id,
      petName: myPetName
      // petName: pet.name
    })
    this.requestGetPetSubTypes(pet.id)

  }


  requestGetPetSubTypes = async (value) => {
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

  setBirthDate = () => {
    setShow(false);

    handlePetBirthdayChange(
      `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
    );
  };


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

// handleSwipe=(value)=>{
//   console.log(' value', value);

//   var ind = value.index
// if(ind==4){
//   ind=0
// }
// else if(ind===0){
//   ind=3
// }
// else{
//   ind=ind+1
// }
// this.setState({ selectedPetSize: selectedPet, })

// console.log(' flow',ind ,  selectedPet,);

// }
  handlePetSizeSelectRight = (value) => {
    var ind = Number(value.index)
    // ind = ind + 1
    if (ind === 4) {
      ind = 0
    }
    let selectedPet = cards[ind]
    this.setState({ selectedPetSize: selectedPet, })
    

  }
  handlePetSizeSelectLeft= (value) => {
    var ind = Number(value.index)
    ind = ind-1
    if (ind === 0) {
      ind = 3
    }else{
      ind = ind - 1  // in cards arrary index start from 1 and end at 4  thats why 
    }
    let selectedPet = cards[ind]

    this.setState({ selectedPetSize: selectedPet, })
  }

  handlePetGenderChange = (e) => {
    this.setState({ petGender: e, genderError: false })
  }

  petWeightUnitSelection = (value) => {
    if (value === 'lbs') {
      this.setState({ kgSelected: false, lbsSelected: true })
    } else {
      this.setState({ kgSelected: true, lbsSelected: false })
    }
  }



  handlePetDetailsPressed = async () => {
    const {
      petGender,
      selectedSubPet,
      selectM,
      selectY
    } = this.state;

    if (!selectedSubPet) {
      this.setState({ breedError: true, error: true })
    }
    if (selectM != undefined) {
    } else {

      this.setState({ monthsError: true, error: true })
    }
    if (!selectY) {
      this.setState({ yearsError: true, error: true })
    }

    if (!petGender) {
      this.setState({ genderError: true, error: true })

    }

    if (selectM != undefined && selectY != '' && petGender && selectedSubPet) {

      this.addPetDetail()
    }

  };

  getAccessToken = async () => {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  closeErrorModal = () => {
    this.setState({ isErrorModal_Visible: false })
  }

  petAge_month = (value, index, data) => {
    const { selectY } = this.state
    if (selectY) {
      this.setState({
        selectM: value,
        monthsError: false,
        monthPlaceholder: false
      }, () => this.getDBO())
    }
    else {
      this.setState({
        selectM: value,
        selectY: '0',
        monthsError: false,
        monthPlaceholder: false
      }, () => this.getDBO())
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

  ///////////////// Add Pet API ///////////////////////

  addPetDetail = async () => {
    this.setState({
      fetching: true,
      error: ''
    });
    const {
      selectedPet,
      selectedPetSize,
      selectedSubPet,
      petGender,
      petBirthday,
      petName,
      // token,
    } = this.state;

    const token = this.props.navigation.state.params.param.access_token
    const user_id = this.props.navigation.state.params.param.user_id
     
  
    const formdata = new FormData();
    formdata.append('server_key', server_key);
    formdata.append('pet_name', petName);
    console.log('Selected Pet', selectedPet);
    formdata.append('pet_type', selectedPet);
    formdata.append('pet_size', selectedPetSize.index);
    formdata.append('sub_type', selectedSubPet);
    formdata.append('gender', petGender);
    formdata.append('birthday', petBirthday);
    formdata.append('user_id' ,user_id)
    // formdata.append('pet_avatar', '');

    await petMyPalApiService.createPet(token, formdata).then((response)=>{
    const { data } = response;
    if (data?.api_status == 200) {
      this.setState({ fetching: false });
      this.props.navigation.navigate('UserDetails', {
        selectedPetSize,
        selectedSubPet,
        petGender,
        petBirthday,
      })

    } else if(!data) {
      this.addPetDetail()
      
    }else {
      this.setState({
        error: data?.errors?.error_text,
        fetching: false,
        isErrorModal_Visible: true,
        errorMessage: Capitalize(data?.errors?.error_text)

      });
    }

    })
    .catch((error) => {
      this.setState({ fetching: false });
      console.log('Network Request fail', error)

    })
    
  }

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
      is_breedSelected: true,
      breedModalVisible: false
    })
  }

  onValueChange = (value) => {
    this.setState({
      breed: value,
      is_breedSelected: false,
      breedError: false,
      selectedSubPet: '',
      searchValue: value // will do empity once user select its value
    })
  }

  hideShow_Dropdown = () => {
    const { is_breedSelected, breedModalVisible } = this.state
    this.setState({
      is_breedSelected: !is_breedSelected,
      breedModalVisible: !breedModalVisible
    })
  }

  /*********************** custom dd *************************/
  filterData = (query) => {
    const { listOfBreeds } = this.state
    if (query === '') {
      // return []
      return listOfBreeds
    }
    const regex = new RegExp([query.trim()], 'i')
    return listOfBreeds.filter((c) => c.search(regex) >= 0)
  }
  /*********************** custom dd *************************/



  render() {
    const {
      selectM,
      selectY,
      breedError,
      petGender,
      genderError,
      monthsError,
      yearsError,
      selectedPet,
      petName,
      kgSelected,
      lbsSelected,
      monthPlaceholder,
      yearPlaceholder,
      fetching,
      isErrorModal_Visible,
      errorMessage,
      /********* custom dd ****/
      breed,
      searchValue,
      is_breedSelected,
      breedModalVisible,
      loading,

    } = this.state

    /********************** custom dropdown  ***********************/
    filteredBreed = this.filterData(searchValue)
    /********************** custom dropdown  *****************/

    return (
      <Container>
        <Content
          scrollEnabled={is_breedSelected ? true : false}
        >

          <MainLogoForSignUp
            // goBack={() => this.goBack()}
            text={`${petName?.trim()} will have its own profile on PetMyPal`}
            // petName={`${petName}`}
            steps={4}
            heading={`More about ${petName}`}
            headingContainer={{ marginTop: 10 }}
          // testImage={require('./../../assets/images/updated/CreateAccount.png')}
          />

          {selectedPet === 2 ? (
            <View style={{ marginBottom:hp(2), marginHorizontal: wp(6) }}>
              <Label
                text={`${petName?.trim()}'s size `}
                style={{ marginBottom: 5 }}
              />
             
              <DeckCard
                handlePetSizeSelectRight={this.handlePetSizeSelectRight}
                handlePetSizeSelectLeft={this.handlePetSizeSelectLeft}
                // handleSwipe={this.handleSwipe}
                handleUnitSelection={this.petWeightUnitSelection}
                kgSelected={kgSelected}
                lbsSelected={lbsSelected}
              />
            </View>
          ) : null}



          <View style={styles.contentWraper}>

            <Label
              text={`${petName?.trim()}'s Breed `}
              style={{ color: breedError ? DANGER : TEXT_INPUT_LABEL }}
            />
            <TouchableOpacity
              onPress={() => this.hideShow_Dropdown()}
              activeOpacity={1}
              style={breedError ? [styles.breedViewError] : [styles.breedView]}
            >
              <View style={styles.breadInnerView}>
                {breed ?
                  <Text style={styles.breedText} >{breed}</Text> :
                  <Text style={[styles.breedText, { color: placeholderColor }]} >Select Bread</Text>
                }
                <Icon
                  name={'caretdown'}
                  type={'AntDesign'}
                  style={styles.iconStyle}
                />
              </View>
            </TouchableOpacity>

            {/* {Platform.OS === 'ios' ?
              <View
                style={{ zIndex: 1 }}
              >
                <CustomDropDown
                  label={'Breed'}
                  iconName='caretdown'
                  iconType={'AntDesign'}
                  data={filteredBreed}
                  value={breed}
                  is_BreedSelected={is_breedSelected}
                  error={breedError}
                  onItemClick={this.handleBreadSelection}
                  onChangeText={(value) => this.onValueChange(value)}
                  onIconPress={() => this.hideShow_Dropdown()}
                />
              </View>
              :
              
              <CustomDropDown
                label={'Breed'}
                iconName='caretdown'
                iconType={'AntDesign'}
                data={filteredBreed}
                value={breed}
                is_BreedSelected={is_breedSelected}
                error={breedError}
                onItemClick={this.handleBreadSelection}
                onChangeText={(value) => this.onValueChange(value)}
                onIconPress={() => this.hideShow_Dropdown()}
              />
            } */}


            {/* <Label
              text={'Age'}
              style={{
                marginTop: 10,
                color: yearsError || monthsError ? DANGER : TEXT_INPUT_LABEL
              }}
            /> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginRight:wp(22), 
                alignItems: 'center',
              }}>
              <Label
                text={'Year'}
                style={{
                  marginTop: 10,
                  color: yearsError || monthsError ? DANGER : TEXT_INPUT_LABEL,
                }}
              />
              <Label
                text={'Month'}
                style={{
                  marginTop: 10,
                  color: yearsError || monthsError ? DANGER : TEXT_INPUT_LABEL,
                }}
              />
            </View>
            <View style={styles.ddContainer}>
              <View style={{ width: wp(30),borderBottomWidth:0.7 , borderBottomColor: yearsError?DANGER:grey}}>
                <_DropDown
                  data={Years}
                  selectedValue={selectY}
                  staticValue={'Years'}
                  error={yearsError}
                  placeholder={yearPlaceholder}
                  dropdownPosition={-4.5}
                  pickerStyle={{width:wp(36) }}
                  style={{ backgroundColor: 'null',width:wp(30) }}
                  onChangeText={(value, index, data) => this.petAge_years(value, index, data)}
                />
              </View>

              <View style={{ width: wp(30),borderBottomWidth:0.7 , borderBottomColor:monthsError?DANGER:grey }}>
                <_DropDown
                  data={months}
                  selectedValue={selectM}
                  staticValue={'Months'}
                  error={monthsError}
                  placeholder={monthPlaceholder}
                  dropdownPosition={-4.5}
                  style={{ backgroundColor: 'null', width:wp(30) }}
                  pickerStyle={{marginLeft:wp(58), width:wp(36) }}
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
                color: petGender ? black :placeholderColor,
                paddingRight: 20
              }}
            />
            <View style={genderError ? [styles.bottomBorderError] : [styles.bottomBorder]}></View>

          </View>

          <View style={styles.btnView}>
            {
              fetching ?
                <CustomLoader />
                :
                <SkyBlueBtn
                  title={'Next'}
                  onPress={() => this.handlePetDetailsPressed()}
                />
            }
          </View>

          <ErrorModal
            isVisible={isErrorModal_Visible}
            onBackButtonPress={() => this.closeErrorModal()}
            info={errorMessage}
            heading={'Hoot!'}
            onPress={() => this.closeErrorModal()}
          />
          <BreedPicker
            isVisible={breedModalVisible}
            data={filteredBreed}
            onItemClick={this.handleBreadSelection}
            onChangeText={(value) => this.onValueChange(value)}
            onBackdropPress={this.hideShow_Dropdown}
            value={breed}
            loading={loading}
          />
        </Content>
      </Container>
    )
  }
};

const styles = StyleSheet.create({

  contentWraper: {
    marginHorizontal: 20,
  },
  d_containerStyle: {
    backgroundColor: White,
    paddingVertical: 3,
    marginTop: 0,
    paddingLeft: 0,
    borderRadius: 5,
    borderBottomColor: grey,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  btnView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    marginBottom: 20,
    zIndex: -1
  },
  deckWraper: {
    marginBottom: hp(25),
    marginHorizontal: wp(6)
  },
  ddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
    alignItems: 'center',
    marginTop: 10
  },
  bottomBorder: {
    width: wp(88),
    height: StyleSheet.hairlineWidth,
    backgroundColor: grey,
    marginTop: 5
  },
  bottomBorderError: {
    width: wp(88),
    height: StyleSheet.hairlineWidth,
    backgroundColor: DANGER,
    marginTop: 5
  },
  itemContainer: {
    position: 'absolute',
    paddingVertical: 20,
    top: Platform.OS == 'ios' ? height(7) : height(9.5),
    width: width(91),
    backgroundColor: 'red',
    zIndex: 1


  },
  dataContainer: {
    maxHeight: totalSize(20),
  },
  breedView: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: grey,
    width:wp(88)
  },
  breedViewError: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DANGER,
    width:wp(88)

  },

  breadInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  breedText: {
    flex: 1,
    color: black,
    fontSize: textInputFont,
  },

  iconStyle: {
    color: TEXT_INPUT_LABEL,
    fontSize: 11,
    width: wp(10),
    textAlign: 'center'
  }

});

export default PetDetails;