import { ImageBackground, Text, View } from 'react-native';
import React, { Component } from 'react';
import PMPHeader from '../../../components/common/PMPHeader';
import styles from './style'
import TextField from '../../../components/common/TextField';
import { black, grey, offwhite, PLACE_HOLDER, White } from '../../../constants/colors';
import IntlPhoneInput from 'react-native-intl-phone-input';
import { Divider } from 'react-native-elements';
import Label from '../../../components/common/Label';
import _DropDown from '../../../components/common/dropDown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SERVER, server_key } from '../../../constants/server';
import { commonBG, pmpEco } from '../../../constants/ConstantValues'

import axios from 'axios';
import SkyBlueBtn from '../../../components/common/SkyblueBtn';

export default class AboutYourBusiness extends Component {
  constructor(props) {
    super(props);
    this.state = {

      contact: '',
      mskedNumber: '',
      cca2: 'US',
      callingCode: '1',
      perNmaError: false,
      phError: false,
      infoText: '',
      countryCode: '',
      changeNum: null,
      CountryName: '',
      countryList: [],
      Placeholder: true,
      address1: '',
      address2: '',
      countryId: '',
      stateId: '',
      cityId: '',
      weblink: '',


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
    console.log('country ', v, d)
  }
  selectState = (v, i, d) => {
    console.log('staete ', v, d)

  }

  selectCity = (v, i, d) => {
    console.log('city ', v, d)

  }

  render() {
    const {
      cca2,
      phError,
      countryList,
      Placeholder,
      address1,
      address2,
      CountryName,
      weblink,
      countryId,
      stateId,
      cityId,
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor:offwhite}}>
        <ImageBackground
          source={commonBG}
          style={{ width: '100%' }}>
          <PMPHeader
            ImageLeftIcon={true}
            LeftPress={() => this.props.navigation.goBack()}
            centerText={'Vendor Profile'}
            longWidth={true}
          />
          <Text style={styles.step}>Step 2/3</Text>
        </ImageBackground>
        <Text style={styles.header}>Your Business Address</Text>
        <Text style={[styles.text, { marginTop: hp(1) }]}>{`This is more about your business. PetMyPal`}</Text>
        <Text style={styles.text}>{`provides the opportunity to boost business within`}</Text>
        <Text style={styles.text}>{`PetMyPal's ecsystem`}</Text>
        <View style={styles.field}>
          <TextField
            label={'Address 1'}
            placeholder={'Enter address 1'}
            onChangeText={(text) => this.setState({ address1: text })}
            value={address1}
            containerStyle={styles.inputContainerStyle}
          />

          <TextField
            label={'Address 2'}
            placeholder={'Enter address 2'}
            onChangeText={(text) => this.setState({ address2: text })}
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
            onChangeText={(value, index, data) => this.selectedCountry(value, index, data)}
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

          <Label style={{ marginTop: 7 }} text={'State'} />
          <_DropDown
            data={this.state.countryList}
            selectedValue={CountryName}
            renderAccessory={null}
            staticValue={'Select state'}
            dropdownPosition={-4.5}
            placeholder={PLACE_HOLDER}
            onChangeText={(value, index, data) => this.selectState(value, index, data)}

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

          <Label style={{ marginTop: 7 }} text={'City'} />
          <_DropDown
            data={this.state.countryList}
            selectedValue={CountryName}
            renderAccessory={null}
            staticValue={'Select city'}
            dropdownPosition={-4.5}
            placeholder={PLACE_HOLDER}
            onChangeText={(value, index, data) => this.selectCity(value, index, data)}

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
            onChangeText={(text) => this.setState({ weblink: text })}
            value={weblink}
            containerStyle={styles.containerStyle}
          />

        </View>
        <SkyBlueBtn
            title={'Next'}
            titleStyle={{ color: White }}
            // onPress={() => this.props.navigation.navigate("AboutYourBusiness")}
            btnContainerStyle={styles.btnContainerStyle}
          />
      </View>
    );
  }
}
