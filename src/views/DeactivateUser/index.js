import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList, } from 'react-native'
import { Content, Container, Icon, Thumbnail } from "native-base";
import PMPHeader from '../../components/common/PMPHeader'
import { deactivation_step2, deactivation_step1, whatisPetMyPal, deactivation_pass, deactivation_proceed } from '../../constants/ConstantValues'
import { Divider } from "react-native-elements";
import styles from './styles'
import { TouchableOpacity } from "react-native";
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { connect } from 'react-redux';
import CustomLoader from "../../components/common/CustomLoader";
import SkyBlueBtn from "../../components/common/SkyblueBtn";
import WhiteBtn from "../../components/common/WhiteBtn";
import { Capitalize } from "../../utils/RandomFuncs";
import { widthPercentageToDP } from "react-native-responsive-screen";
import PMP from '../../lib/model/pmp';
import TextField from "../../components/common/TextField";
import { darkSky, TEXT_INPUT_LABEL } from "../../constants/colors";
import ErrorModal from '../../components/common/ErrorModal';
import ConfirmModal from '../../components/common/ConfirmModal';





class DeactivateUser extends Component {
  modal = React.createRef();

  constructor(props) {
    super(props)

    this.state = {
      deactivation_Date: '',
      removal_Date: '',
      token: '',
      sending: false,
      password: '',
      passwordError: false,
      passwordVisible: false,
      errorMsg: "",
      showErrorModal: false,

      isConfirm_Modal_visible: false,
      infoMsg: 'Are you sure you want to deactivate your account?',
      InProcess: false,


    }
  }

  componentDidMount() {
    var curr_date = new Date()
    var currentDate = moment.utc(curr_date).local().format('DD-MM-YYYY')
    let [d, m, y] = currentDate?.split('-')
    let __curr_date = `${m}-${d}-${y}`

    var myDate = new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000));
    var after_90_Days = moment.utc(myDate).local().format('DD-MM-YYYY')

    let [dd, mm, yy] = after_90_Days?.split('-')
    let __remove_date = `${mm}-${dd}-${yy}`

    this.setState({
      deactivation_Date: __curr_date,
      removal_Date: __remove_date
    })

    this.getAccessToken().then(async (TOKEN) => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
      });

    });

  }

  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }

  goBack = () => { this.props.navigation.pop() }

  showPassword = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };

  closeErrorModal = () => {
    
    this.setState({ showErrorModal: false })
  }

  closeConfirmModal = () => {
    this.setState({ isConfirm_Modal_visible: false })
}

handle_Deactivate = async () => {

  const { token , password } = this.state
  // console.log('here is token' , token)
  this.setState({InProcess:true})
  const formData = new FormData();
  formData.append('server_key', server_key);
  formData.append('active', 0)
  formData.append('user_password',password)

  console.log('data sendig to server', formData)
  const response = await petMyPalApiService.updateUserData(token, formData).catch((e) => {
    console.log('error while deactivating User account', e)
    this.setState({ sending: false })
  })
  const { data } = response
  console.log('deactivate response', data)
  if (data.api_status === 200) {
    this.setState({ sending: false , InProcess:false })
    PMP.logout().then(() => {
      this.props.navigation.navigate('AuthView')
    });
    console.log('account deactivate', data)
  }else if(data.api_status === 400){
      this.closeConfirmModal()
      setTimeout(() => {
      this.setState({ 
        sending: false , 
        InProcess:false,
        showErrorModal:true,
        errorMsg:data?.message
       })
        
      },800);
  }else {
    this.setState({ sending: false , InProcess:false })
  }

}


  handle_User_Deactivation = async () => {

    let err = false
    const { password, passwordError } = this.state
    if (password.trim().length > 0) {
      this.setState({ 
        // sending: true ,
        isConfirm_Modal_visible:true
      })
      
    } else {
      err = true
      this.setState({
        passwordError: true,
        errorMsg: "Password Is Required",
        showErrorModal: true
      })

      return true
    }

  }


  render() {
    const {
      deactivation_Date,
      removal_Date,
      sending,
      password,
      passwordError,
      passwordVisible,
      showErrorModal,
      errorMsg,

      infoMsg,
      InProcess,
      isConfirm_Modal_visible,
    } = this.state
    return (
      <Container>
        <PMPHeader
          ImageLeftIcon={true}
          LeftPress={() => this.goBack()}
          centerText={'Deactivate Account'}
          longWidth={true}
        />
        <Content style={styles.container}>
          <Text style={styles.textStyle}>{whatisPetMyPal}</Text>

          <Text style={styles.heading}>{'Step 1:'}</Text>
          <Text style={styles.textStyle}>{deactivation_step1}</Text>

          <Text style={styles.heading}>{'Step 2:'}</Text>
          <Text style={styles.textStyle}>{deactivation_step2}</Text>

          <Text style={styles.heading}>{'Account Deactivation Date:'}</Text>
          <Text style={styles.dateText}>{deactivation_Date}</Text>
          <Divider style={{ marginTop: 5 }} />

          <Text style={styles.heading}>{'Account Removal Date:'}</Text>
          <Text style={styles.dateText}>{removal_Date}</Text>
          <Divider style={{ marginTop: 5 }} />

          <Text style={[styles.textStyle, { marginTop: 15 }]}>{deactivation_pass}</Text>
          <Text style={[styles.textStyle, { marginTop: 15 }]}>{deactivation_proceed}</Text>

          <View style={styles.passwordView}>
            <TextField
              label={'Enter Your PetMyPal Password'}
              placeholder={'Password'}
              value={password}
              onChangeText={(text) => this.setState({ password: text, passwordError: false, errorMsg: '' })}
              onIconPress={() => this.showPassword(passwordVisible)}
              iconName={passwordVisible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!passwordVisible}
              iconType={'Entypo'}
              style={{ color: passwordVisible ? darkSky : TEXT_INPUT_LABEL }}
              error={passwordError}
            />
          </View>


          <View style={styles.btnView}>

            {sending ?

              <CustomLoader
                loaderContainer={{ alignSelf: 'center', width: widthPercentageToDP(41) }}
              /> :

              <SkyBlueBtn
                title={'Confirm'}
                onPress={() => this.handle_User_Deactivation()}
                btnContainerStyle={styles.btnStyle}
              />

            }
            <WhiteBtn
              title={'Cancel'}
              onPress={() => this.goBack()}
              btnContainerStyle={styles.btnStyle}
            />
          </View>

        </Content>
        <ErrorModal
          isVisible={showErrorModal}
          onBackButtonPress={() => this.closeErrorModal()}
          info={errorMsg}
          heading={'Hoot!'}
          onPress={() => this.closeErrorModal()}
        />

        <ConfirmModal
          isVisible={isConfirm_Modal_visible}
          onPress={this.closeConfirmModal}
          info={infoMsg}
          DoneTitle={'Deactivate'}
          onDoneBtnPress={this.handle_Deactivate}
          CancelTitle={'Cancel'}
          onCancelBtnPress={this.closeConfirmModal}
          processing={InProcess}
        />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return { user: state.user }
};
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DeactivateUser);
