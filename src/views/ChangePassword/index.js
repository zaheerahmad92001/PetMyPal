import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { userEdit } from '../../redux/actions/user';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import { server_key, SERVER } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import PMPHeader from '../../components/common/PMPHeader';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Label from '../../components/common/Label';
import TextField from '../../components/common/TextField';
import { passwordValidate, Capitalize } from '../../utils/RandomFuncs';
import { passwordPolicy } from '../../constants/ConstantValues'
import InfoModal from '../../components/common/InfoModal';
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import ErrorModal from '../../components/common/ErrorModal';
import UserProfile from '../../components/common/userProfile';
import CustomLoader from '../../components/common/CustomLoader';
import { darkSky, TEXT_INPUT_LABEL } from '../../constants/colors';
import { petMyPalApiService } from '../../services/PetMyPalApiService';


class ChangePassword extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  state = {
    loading: false,
    token: '',

    newPassword: '',
    newPasswordError: false,
    isNewPass_Visible: false,

    is_CurrentPassVisible: false,
    c_PasswordError: false,
    c_Password: '',

    confirm_password: '',
    confirmPassError: false,
    isConfirmPass_Visible: false,

    isModal_Visible: false,
    passPolicy: false,
    infoText: '',
    headerText: '',
    isErrorModal_Visible: false,
    errorMessage: '',

  };

  componentDidMount() {
    this.getAccessToken().then(TOKEN => {
      this.setState({
        token: JSON.parse(TOKEN).access_token,
      });
    });
  }


  async getAccessToken() {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return access_token;
  }


  handleNewPassword = (text) => {
    this.setState({ newPassword: text })
    // if (!passwordValidate(text)) {
    // if (text) {
    if (text && text.trim().length < 8) {
      this.setState({ newPasswordError: true })
    } else {
      this.setState({ newPasswordError: false })
    }
    // }else {
    //   this.setState({ newPasswordError: true })
    // }
  }


  showNewPassword = (value) => {
    this.setState({ isNewPass_Visible: !value })
  }

  showPasswordPolicy = () => {

    this.setState({
      isModal_Visible: true,
      passPolicy: true,
      infoText: passwordPolicy,
      headerText: 'Password Policy'
    })

  }

  closeModal = () => {
    this.setState({
      isModal_Visible: false
    })
  }


  handleConfirmPassword = (value) => {
    const { newPassword } = this.state
    if (value != newPassword) {
      this.setState({ confirmPassError: true, confirm_password: value })
    } else {
      this.setState({ confirmPassError: false, confirm_password: value })
    }
  }

  show_confirm_Password = (value) => {
    this.setState({ isConfirmPass_Visible: !value })
  }

  closeErrorModal = () => {
    const scope = this
    this.setState({ isErrorModal_Visible: false })
  }

  handleCurrentPassword = (text) => {
    this.setState({ c_Password: text })
    // if (!passwordValidate(text)) {
    if (text) {
      if (text.trim().length < 8) {
        this.setState({ c_PasswordError: true })
      } else {
        this.setState({ c_PasswordError: false })
      }
    } else {
      this.setState({ c_PasswordError: true })
    }

  }
  showCurrentPassword = (value) => {
    this.setState({ is_CurrentPassVisible: !value })
  }

  goHome = () => {
    this.props.navigation.navigate({
      routeName: 'FooterBarView',
      key: 'FooterBarView',
    });
  };



  windowWidth = Dimensions.get('window').width;

  savePassword = async (type) => {
    const scope = this
    const {
      newPassword,
      confirm_password,
      c_Password,
      token,
    } = this.state

    if (this.validateForm()) {
      this.setState({
        loading: true,
        isNewPass_Visible: false,
        isConfirmPass_Visible: false,
        is_CurrentPassVisible: false,

      });
      try {
        const formDate = new FormData();
        formDate.append('server_key', server_key);
        formDate.append('current_password', c_Password)
        formDate.append('password', newPassword);
        formDate.append('confirm_password', confirm_password);

        const response = await petMyPalApiService.changePassword(token, formDate).catch((err) => {
          console.log('error while changing Password', err)
        })

        const { data } = response
        if (data.api_status === 200) {

          this.setState({
            loading: false,
          })
          setTimeout(() => {
            scope.goBack()
          }, 500)
        } else {
          this.setState({
            loading: false,
            isErrorModal_Visible: true,
            errorMessage: Capitalize(data.errors.error_text)
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };


  validateForm = () => {
    const {
      newPassword,
      confirm_password,
      confirmPassError,
      c_Password,
    } = this.state;

    let error = false

    // if(!passwordValidate(c_Password)){
    if (c_Password) {
      if (c_Password.trim().length < 8) {
        error = true
        this.setState({ c_PasswordError: true, })
      }
      else {
        error = false
        this.setState({ c_PasswordError: false, })
      }
    } else {
      error = true
      this.setState({ c_PasswordError: true, })
    }

    // if (!passwordValidate(newPassword)) {
    if (newPassword) {
      if (newPassword.trim().length < 8) {
        error = true
        this.setState({ newPasswordError: true, })
      } else {
        error = false
        this.setState({ newPasswordError: false, })
      }
    } else {
      error = true
      this.setState({ newPasswordError: true, })
    }


    if (confirmPassError || confirm_password === '') {
      error = true
      this.setState({ confirmPassError: true, })
    }

    if (newPassword != confirm_password) {
      this.setState({ isErrorModal_Visible: true, errorMessage: 'Please Check Your Password' })
      error = true
    }

    if (!error) {
      return true;
    } else {
      return false;
    }
  };

  goBack = () => {
    this.props.navigation.pop();
  };

  render() {
    const {

      loading,
      newPassword,
      newPasswordError,
      isNewPass_Visible,
      is_CurrentPassVisible,
      c_Password,
      c_PasswordError,
      isModal_Visible,

      confirm_password,
      confirmPassError,
      isConfirmPass_Visible,

      infoText,
      headerText,
      passPolicy,

      isErrorModal_Visible,
      errorMessage,

    } = this.state;
    return (
      <Container>
        <PMPHeader
          centerText={'Change Password'}
          ImageLeftIcon={'arrow-back'}
          longWidth={true}
          LeftPress={() => this.goBack()}
        />
        <Content>
          <UserProfile user={this.props.user?.user_data} top={40} />
          <View style={styles.container}>
            {/* <Label
              text="Ensure Password Security"
              style={styles.label}
            /> */}


            <TextField
              label={"Current Password"}
              policy={false}
              placeholder={'Current Password'}
              value={c_Password}
              error={c_PasswordError}
              onChangeText={(text) => this.handleCurrentPassword(text)}
              onIconPress={() => this.showCurrentPassword(is_CurrentPassVisible)}
              iconName={is_CurrentPassVisible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!is_CurrentPassVisible}
              iconType={'Entypo'}
              style={{ color: is_CurrentPassVisible ? darkSky : TEXT_INPUT_LABEL }}
              containerStyle={{ marginTop: hp(7) }}
            />
            <TextField
              label={"New Password"}
              // policy={true}
              placeholder={'New Password'}
              value={newPassword}
              error={newPasswordError}
              showPolicy={() => this.showPasswordPolicy()}
              onChangeText={(text) => this.handleNewPassword(text)}
              onIconPress={() => this.showNewPassword(isNewPass_Visible)}
              iconName={isNewPass_Visible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!isNewPass_Visible}
              iconType={'Entypo'}
              style={{ color: isNewPass_Visible ? darkSky : TEXT_INPUT_LABEL }}
              containerStyle={{ marginTop: 5 }}

            />
            <TextField
              label={"Repeat New Password"}
              placeholder={'Repeat New Password'}
              value={confirm_password}
              error={confirmPassError}
              onChangeText={(text) => this.handleConfirmPassword(text)}
              onIconPress={() => this.show_confirm_Password(isConfirmPass_Visible)}
              iconName={isConfirmPass_Visible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!isConfirmPass_Visible}
              style={{ color: isConfirmPass_Visible ? darkSky : TEXT_INPUT_LABEL }}
              iconType={'Entypo'}
              containerStyle={{ marginTop: 5 }}
            />
            {loading ?
              <CustomLoader
                loaderContainer={styles.buttonContainer}
              /> :
              <SkyBlueBtn
                title={'Save New Password'}
                onPress={() => this.savePassword('reset-password')}
                btnContainerStyle={styles.buttonContainer}
              />
            }
          </View>

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
export default connect(mapStateToProps, mapDispatchToProps,)(ChangePassword);



const styles = StyleSheet.create({
  wraper: {
    flex: 1
  },
  container: {

    marginHorizontal: 15,
  },
  label: {
    color: 'black',
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: hp(7),
    alignSelf: 'center',
  }
})
