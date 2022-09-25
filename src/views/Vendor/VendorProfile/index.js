import { View, Text, ImageBackground, TouchableOpacity, Platform , Image } from 'react-native';
import React from 'react';
import PMPHeader from '../../../components/common/PMPHeader';
import styles from './styles';
import { CheckBox, Divider } from 'react-native-elements';
import IntlPhoneInput from 'react-native-intl-phone-input';
import ImagePicker from 'react-native-image-picker';

import {
  black,
  darkSky,
  PLACE_HOLDER,
  grey,
  TEXT_INPUT_LABEL,
  White,
} from '../../../constants/colors';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import TextField from '../../../components/common/TextField';
import SkyBlueBtn from '../../../components/common/SkyblueBtn';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { commonBG } from '../../../constants/ConstantValues';
import Label from '../../../components/common/Label';
import _DropDown from '../../../components/common/dropDown';

import axios from 'axios';
import { SERVER, server_key } from '../../../constants/server';
import { Icon } from 'native-base';
import { labelFont } from '../../../constants/fontSize';

const options = {
  title: 'Select image',
  mediaType: 'image',
  storageOptions: {
    skipBackup: true,
    path: 'image',
  },
};

var radio_btn_businessType = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];

var radio_btn_services = [
  { label: 'Pet Professional Services', value: 'services' },
  { label: 'Veterinaries', value: 'veterinaries' },
];

var radio_btn_animals = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Cow', value: 'cow' },
  { label: 'Fish', value: 'fish' },
  { label: 'Parrot', value: 'parrot' },
  { label: 'Horse', value: 'horse' },
  { label: 'Bird', value: 'bird' },
  { label: 'Pig', value: 'pig' },
  { label: 'Rabbit', value: 'rabbit' },
  { label: 'Snake', value: 'snake' },
  { label: 'Rodent', value: 'rodent' },
  { label: 'Turtle', value: 'turtle' },
  { label: 'Others', value: 'others' },
];

class VendorProfie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: '',
      businessNameError: false,
      publicIndividualInd: -1,
      publicIndividualVal: '',
      serviceProvider: '',
      radioButtonInd: -1,
      radioButtonVal: '',
      kindofServices: '',
      petProServiceInd: -1,
      petProServiceVal: '',
      countryList: [],
      cca2: 'US',
      callingCode: '1',
      contact: '',
      mskedNumber: '',
      step: 1,
      imgUri: '',
      errorAccept: false,

      profileUri: '',
      profileImg: '',
      coverImg: '',
      coverUri: '',
    };
  }

  componentDidMount() {
    this.countryNames();
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
          this.setState({ countryList: newArray ?? [] }, () => { });
        }
      });
  };

  selectedCountry = (v, i, d) => {
    console.log('country ', v, d);
  };
  selectState = (v, i, d) => {
    console.log('staete ', v, d);
  };

  selectCity = (v, i, d) => {
    console.log('city ', v, d);
  };

  selection = (item, index) => {
    this.setState({
      radioButtonVal: item.value,
      radioButtonInd: index,
      // petProServiceVal : item.value,
      // petProServiceInd : index,
    });
  };

  businessPP = (item, index) => {
    this.setState({
      publicIndividualVal: item.value,
      publicIndividualInd: index,
    });
  };

  petProProvider = (item, index) => {
    this.setState({
      petProServiceVal: item.index,
      petProServiceInd: index,
    });
  };

  businessType = ({ item, index }) => {
    const { publicIndividualInd, publicIndividualVal } = this.state;
    return (
      <View
        style={{
          width: wp(32),
          flexDirection: 'row',
          marginBottom: 10,
        }}>
        <RadioForm formHorizontal={true} animation={true}>
          <RadioButton labelHorizontal={true} key={index}>
            <RadioButtonInput
              obj={item}
              index={index}
              isSelected={publicIndividualInd == index}
              onPress={() => this.businessPP(item, index)}
              initial={-1}
              labelColor={black}
              buttonColor={publicIndividualInd == index ? darkSky : grey}
              selectedButtonColor={darkSky}
              animation={true}
              buttonSize={10}
              buttonInnerColor={darkSky}
              buttonWrapStyle={{ marginLeft: 0 }}
            />
            <RadioButtonLabel
              obj={item}
              initial={1}
              index={index}
              labelHorizontal={true}
              onPress={this.businessPP}
              labelStyle={{ fontSize: 16, color: black }}
            />
          </RadioButton>
        </RadioForm>
      </View>
    );
  };

  petProfessionalServices = ({ item, index }) => {
    console.log('petProfessionalServices', item);
    const { petProServiceVal, petProServiceInd } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
        }}>
        <RadioForm formHorizontal={true} animation={true}>
          <RadioButton labelHorizontal={true} key={index}>
            <RadioButtonInput
              obj={item}
              index={index}
              isSelected={petProServiceInd == index}
              onPress={() => this.petProProvider(item, index)}
              initial={-1}
              labelColor={black}
              buttonColor={petProServiceInd == index ? darkSky : grey}
              selectedButtonColor={black}
              animation={true}
              buttonSize={10}
              buttonInnerColor={black}
              buttonWrapStyle={{ marginLeft: 0 }}
            />
            <RadioButtonLabel
              obj={item}
              initial={1}
              index={index}
              labelHorizontal={true}
              onPress={this.petProProvider}
              labelStyle={{ fontSize: 15, color: black }}
            />
          </RadioButton>
        </RadioForm>
      </View>
    );
  };

  renderRadioButtons = ({ item, index }) => {
    const { radioButtonInd, radioButtonVal } = this.state;
    return (
      <View
        style={{
          width: wp(30),
          flexDirection: 'row',
          marginBottom: 10,
          color: radioButtonInd ? 'red' : '#f44336',
        }}>
        <RadioForm
          formHorizontal={true}
          animation={true}
          selectedButtonColor={darkSky}
          labelStyle={{
            fontSize: 18,
            color: radioButtonInd ? black : darkSky,
            paddingRight: 20,
          }}>
          <RadioButton labelHorizontal={true} key={index}>
            <RadioButtonInput
              obj={item}
              index={index}
              isSelected={radioButtonInd == index}
              onPress={() => this.selection(item, index)}
              initial={-1}
              labelColor={black}
              // buttonColor={TEXT_INPUT_LABEL}
              buttonColor={radioButtonInd == index ? darkSky : grey}
              selectedButtonColor={TEXT_INPUT_LABEL}
              // onPress={this.handlePetGenderChange}
              animation={true}
              buttonSize={10}
              buttonInnerColor={darkSky}
              buttonWrapStyle={{ marginLeft: 0 }}
            />
            <RadioButtonLabel
              obj={item}
              initial={1}
              index={index}
              labelHorizontal={true}
              onPress={this.selection}
              labelStyle={{ fontSize: 15, color: black }}
            />
          </RadioButton>
        </RadioForm>
      </View>
    );
  };


  uploadCoverPhoto = async () => {
    var scope = this;
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        var uri = this.getFilePathForPlatform(response);

        scope.setState({
          coverUri: uri,
          coverImg: response,
        });
      }
    });
  };

  uploadProfile= async ()=>{
    var scope = this;
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        var uri = this.getFilePathForPlatform(response);

        scope.setState({
          profileUri: uri,
          profileImg: response,
        });
      }
    });
  }



  getFilePathForPlatform = response => {
    if (Platform.OS === 'ios') {
      return response.uri;
    } else {
      return response.path && 'file://' + response.path;
    }
  };

  stepOneContent() {
    const { businessName, businessNameError } = this.state;
    return (
      <View>
        <View style={styles.field}>
          <TextField
            label={'Your business name'}
            placeholder={'Enter your business name'}
            value={businessName}
            error={businessNameError}
            containerStyle={styles.containerStyle}
            onChangeText={text =>
              this.setState({ businessName: text, businessNameError: false })
            }
          />
          <Text style={styles.individual}>
            Are you a business or an individual
          </Text>

          <FlatList
            data={radio_btn_businessType}
            keyExtractor={item => {
              item.label;
            }}
            numColumns={2}
            renderItem={this.businessType}
            style={{ marginTop: 10 }}
          />
          <Text style={styles.individual}>
            What kind of service to you provide
          </Text>

          <FlatList
            data={radio_btn_services}
            keyExtractor={item => {
              item.label;
            }}
            renderItem={this.petProfessionalServices}
            style={{ marginTop: 10 }}
          />
          <Text style={styles.individual}>
            What kind of service to you provide
          </Text>

          <FlatList
            data={radio_btn_animals}
            keyExtractor={item => {
              item.label;
            }}
            numColumns={3}
            renderItem={this.renderRadioButtons}
            style={{ marginTop: 10 }}
          />
        </View>
        <SkyBlueBtn
          title={'Next'}
          titleStyle={{ color: White }}
          onPress={() => this.setState({ step: 2 })}
          // onPress={() => this.props.navigation.navigate("AboutYourBusiness")}
          btnContainerStyle={styles.btnContainerStyle}
        />
      </View>
    );
  }

  stepTwoContent = () => {
    const {
      address1,
      address2,
      CountryName,
      weblink,
      cca2,
      phError,
      countryList,
    } = this.state;
    return (
      <View>
        <View style={styles.field}>
          <TextField
            label={'Address 1'}
            placeholder={'Enter address 1'}
            onChangeText={text => this.setState({ address1: text })}
            value={address1}
            containerStyle={styles.inputContainerStyle}
          />

          <TextField
            label={'Address 2'}
            placeholder={'Enter address 2'}
            onChangeText={text => this.setState({ address2: text })}
            value={address2}
            containerStyle={styles.inputContainerStyle}
          />

          <Label text={'Country'} />
          <_DropDown
            data={countryList}
            // selectedValue={CountryName}
            renderAccessory={null}
            staticValue={'Select Country'}
            dropdownPosition={-4.5}
            placeholder={PLACE_HOLDER}
            onChangeText={(value, index, data) =>
              this.selectedCountry(value, index, data)
            }
            itemTextStyle={{ marginLeft: 17 }}
            style={{
              borderBottomWidth: 0,
              left: -1,
              width: wp(87.5),
              alignSelf: 'center',
            }}
            pickerStyle={{ width: wp(88), alignSelf: 'center', marginLeft: 17 }}
          />
          <Divider style={styles.border} />

          <Label style={{ marginTop: 10 }} text={'State'} />
          <_DropDown
            data={this.state.countryList}
            selectedValue={CountryName}
            renderAccessory={null}
            staticValue={'Select state'}
            dropdownPosition={-4.5}
            placeholder={PLACE_HOLDER}
            onChangeText={(value, index, data) =>
              this.selectState(value, index, data)
            }
            itemTextStyle={{ marginLeft: 17 }}
            style={{
              borderBottomWidth: 0,
              left: -1,
              width: wp(87.5),
              alignSelf: 'center',
            }}
            pickerStyle={{ width: wp(88), alignSelf: 'center', marginLeft: 17 }}
          />
          <Divider style={styles.border} />

          <Label style={{ marginTop: 10 }} text={'City'} />
          <_DropDown
            data={this.state.countryList}
            selectedValue={CountryName}
            renderAccessory={null}
            staticValue={'Select city'}
            dropdownPosition={-4.5}
            placeholder={PLACE_HOLDER}
            onChangeText={(value, index, data) =>
              this.selectCity(value, index, data)
            }
            itemTextStyle={{ marginLeft: 17 }}
            style={{
              borderBottomWidth: 0,
              left: -1,
              width: wp(87.5),
              alignSelf: 'center',
            }}
            pickerStyle={{ width: wp(88), alignSelf: 'center', marginLeft: 17 }}
          />
          <Divider style={styles.border} />

          <Label
            style={phError ? [styles.label, { color: DANGER }] : [styles.label]}
            text={'Business Phone'}
          />

          <IntlPhoneInput
            defaultCountry={cca2}
            ref={this.inputRef}
            flagStyle={{ fontSize: 15 }}
            onChangeText={c => this.handlePhoneNumber(c)}
            phoneInputStyle={{ color: black }}
            //  onChangeText={(c)=>this.setState({v:c,setDefaultValue:false})}
            //  setDefaultValue={this.state.setDefaultValue}
            //  defaultVlaue={'03327476323'}
            containerStyle={styles.intlPhoneInputStyle}
          />
          <Divider style={styles.border} />

          <TextField
            label={'Website'}
            placeholder={'Enter website'}
            onChangeText={text => this.setState({ weblink: text })}
            value={weblink}
            containerStyle={[styles.containerStyle, { marginTop: 10 }]}
          />
        </View>
        <SkyBlueBtn
          title={'Next'}
          titleStyle={{ color: White }}
          onPress={() => this.setState({ step: 3 })}
          // onPress={() => this.props.navigation.navigate("AboutYourBusiness")}
          btnContainerStyle={styles.btnContainerStyle}
        />
      </View>
    );
  };

  stepThreeContent = () => {
    const { coverUri , profileUri } = this.state;
    return (
      <View style={styles.field}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Profile & Cover Photo
        </Text>
        <Text style={{ color: TEXT_INPUT_LABEL, marginTop: hp(3) }}>
          Add Cover
        </Text>
        {coverUri ? (
          <TouchableOpacity onPress={() => { }} style={styles.breedImgView}>
            <View
              style={styles.closeBtn}>
              <Icon
                onPress={() =>this.setState({coverImg:'' , coverUri:"" })}
                name={'close'}
                type={'AntDesign'}
                style={styles.closeIcon}
              />
            </View>
            <Image source={{ uri: coverUri }} style={styles.imgStyle} />
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => { this.uploadCoverPhoto() }}
              style={styles.emp_breedImgView}>
              <Icon
                name={'camera'}
                type={'SimpleLineIcons'}
                style={{ color: TEXT_INPUT_LABEL }}
              />
            </TouchableOpacity>
          </View>
        )}
        <View>
          <Text style={{ color: TEXT_INPUT_LABEL, marginTop: hp(3) }}>
            Logo / Profile
          </Text>
          {profileUri ? (
            <TouchableOpacity onPress={() => { }} style={styles.avatarImgView}>
              <View
                style={styles.closeBtn}>
                <Icon
                  onPress={()=>this.setState({profileImg:'', profileUri:''})}
                  name={'close'}
                  type={'AntDesign'}
                  style={styles.closeIcon}
                />
              </View>
              <Image source={{ uri: profileUri }} style={styles.imgStyle} />
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                onPress={() =>this.uploadProfile()}
                style={styles.emp_avatarImgView}>
                <Icon
                  name={'camera'}
                  type={'SimpleLineIcons'}
                  style={{ color: TEXT_INPUT_LABEL }}
                />
              </TouchableOpacity>
            </View>
          )}
          <CheckBox
            title="I accept terms and conditions"
            containerStyle={{
              backgroundColor: 'null',
              borderWidth: 0,
              left: -20,
              marginTop: 10,
            }}
            checkedColor={darkSky}
            textStyle={{
              // color: errorAccept ? 'red' : 'grey',
              fontSize: labelFont,
              fontWeight: '500',
            }}
            onPress={() => this.handleTermsChange()}
            checked={{}}
          />
        </View>
        <SkyBlueBtn
          title={'Finish'}
          titleStyle={{ color: White }}
          // onPress={() => this.setState({ step: 3 })}
          onPress={() => this.props.navigation.navigate("EditVendorProfile")}
          btnContainerStyle={styles.btnContainerStyle}
        />
      </View>
    );
  };

  goBack = () => {
    const { step } = this.state;
    if (step == 1) {
      this.props.navigation.goBack();
    } else {
      let tmpStep = step;
      tmpStep = tmpStep - 1;
      this.setState({ step: tmpStep });
    }
  };

  handleTermsChange = value => {
    this.setState({ accept: !value, errorAccept: false });
  };

  render() {
    const { step, errorAccept } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: White }}>
        <ImageBackground source={commonBG} style={{ width: '100%' }}>
          <PMPHeader
            ImageLeftIcon={true}
            LeftPress={() => this.goBack()}
            centerText={'Vendor Profile'}
            longWidth={true}
          />
          <Text style={styles.step}>{`Step ${step}/3`}</Text>
        </ImageBackground>

        <ScrollView>
          <Text style={styles.header}>
            {step == 3 ? `Your Business Identity` : `Your Business Address`}
          </Text>
          <Text style={[styles.text, { marginTop: hp(1) }]}>
            {step == 3
              ? `Upload your identity images`
              : `This is more about your business. PetMyPal`}
          </Text>
          {step != 3 ? (
            <View>
              <Text
                style={
                  styles.text
                }>{`provides the opportunity to boost business within`}</Text>
              <Text style={styles.text}>{`PetMyPal's ecsystem`}</Text>
            </View>
          ) : null}

          {step == 1
            ? this.stepOneContent()
            : step == 2
              ? this.stepTwoContent()
              : this.stepThreeContent()}
        </ScrollView>
      </View>
    );
  }
}

export default VendorProfie;
