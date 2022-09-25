import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import {Container,Content} from 'native-base';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {userEdit} from '../../redux/actions/user';
import {RFValue} from 'react-native-responsive-fontsize';
import {THEME_BOLD_FONT} from '../../constants/fontFamily';
import {SERVER, server_key} from '../../constants/server';
import {ACCESS_TOKEN} from '../../constants/storageKeys';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import {HEADER, TEXT_DARK} from '../../constants/colors';
import FullPageBackground from '../../components/commonComponents/fullPageBackground';
import LogoTopRight from '../../components/commonComponents/logoTopRight';
import DarkButton from '../../components/commonComponents/darkButton';
import BigHeading from '../../components/commonComponents/bigHeading';
import BigParagraph from '../../components/commonComponents/bigParagraph';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from "@react-native-community/netinfo";
import firebase from 'react-native-firebase';
import CustomLoader from '../../components/common/CustomLoader';

class LoginView extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    user: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      success: '',
      fetching: false,
      passwordVisible: false,
      androidId: '',
    };
  }

  componentDidMount() {
    this.netinfoUnsubscribe= NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.getFCM();
      }
     
  })

    
  }

  getFCM = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      this.setState({
        androidId: fcmToken,
      });
    } else {
      this.setState({
        androidId: '',
      });
    }
  };
  componentWillUnmount() {
    if (this.netinfoUnsubscribe) {
      this.netinfoUnsubscribe();
      this.netinfoUnsubscribe = null;
    }

  }

  handleLoginPressed() {
    if (this.state.username !== '' && this.state.password !== '') {
      this.setState({fetching: true, passwordVisible: false});
      const {username, password, androidId} = this.state;
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('username', username);
      data.append('password', password);

      data.append('android_n_device_id', androidId);
      data.append('android_m_device_id', androidId);

      this.requestHandler('login', data);
    } else {
      this.setState({
        error: 'Username (or) Password is Empty!',
      });
    }
  }
  async requestHandler(type, data) {
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
            username: '',
            password: '',
            error: '',
            fetching: false,
            success: 'Successfully logged in',
          });
          const obj = {
            access_token: responseJson.access_token,
            user_id: responseJson.user_id,
          };
          await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({...obj}));
          this.props.navigation.navigate('AppNavigator');
        } else {
          this.setState({
            error: responseJson.errors.error_text,
            fetching: false,
          });
        }
      })
      .catch(error => {
        alert('Network Error !');
        console.log(error);
      });
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  togglePassword = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };

  render() {
    const {
      username,
      password,
      error,
      fetching,
      success,
      passwordVisible,
    } = this.state;
    return (
      <Container style={styles.container}>
        <FullPageBackground
          image={require('../../assets/images/authBackground.png')}>
          <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />

          <Content nestedScrollEnabled={true} contentContainerStyle={{flex: 1}}>
            <LogoTopRight image={require('../../assets/images/logo.png')} />

            <View style={{flex: 1, paddingVertical: RFValue(20)}}>
              <BigHeading>Welcome Back</BigHeading>
              <BigParagraph>Login with your Email</BigParagraph>
              <View
                style={{
                  paddingTop: RFValue(20),
                  paddingHorizontal: RFValue(40),
                }}>
                <TextInput
                  onChangeText={username =>
                    this.setState({username, error: ''})
                  }
                  value={username}
                  placeholder={'Email'}
                  style={
                    error === 'Username not found'
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          marginVertical: RFValue(10),
                          paddingHorizontal: RFValue(20),
                          borderRadius: RFValue(10),
                          borderWidth: RFValue(1),
                          borderColor: '#FF0000',
                        }
                      : {
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          marginVertical: RFValue(10),
                          paddingHorizontal: RFValue(20),
                          borderRadius: RFValue(10),
                        }
                  }
                />
                <View>
                  <TextInput
                    onChangeText={password =>
                      this.setState({password, error: ''})
                    }
                    value={password}
                    secureTextEntry={passwordVisible ? false : true}
                    placeholder={'Password'}
                    style={
                      error === 'Password is incorrect'
                        ? {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: RFValue(10),
                            paddingHorizontal: RFValue(20),
                            borderRadius: RFValue(10),
                            borderWidth: RFValue(1),
                            borderColor: '#FF0000',
                          }
                        : {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: RFValue(10),
                            paddingHorizontal: RFValue(20),
                            borderRadius: RFValue(10),
                          }
                    }
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      zIndex: 500,
                      right: 15,
                      top: 11,
                    }}
                    onPress={() => this.togglePassword()}>
                    <Icon
                      size={25}
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      color={TEXT_DARK}
                    />
                  </TouchableOpacity>
                </View>

                {error.length > 0 ? (
                  <Text
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      color: '#FF0000',
                      fontSize: RFValue(14),
                      fontFamily: THEME_BOLD_FONT,
                      textAlign: 'center',
                      paddingHorizontal: RFValue(15),
                      paddingVertical: RFValue(5),
                    }}>
                    {error}
                  </Text>
                ) : null}
                {success.length > 0 ? (
                  <Text
                    style={{
                      color: 'green',
                      fontSize: RFValue(14),
                      fontFamily: THEME_BOLD_FONT,
                      textAlign: 'center',
                      paddingHorizontal: RFValue(15),
                      paddingVertical: RFValue(5),
                    }}>
                    {success}
                  </Text>
                ) : null}
                {fetching ? (
                  <CustomLoader/>
                ) : (
                  <View style={styles.button}>
                    <DarkButton onPress={() => this.handleLoginPressed()}>
                      Sign in
                    </DarkButton>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ForgotPassword');
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: RFValue(14),
                      fontFamily: THEME_BOLD_FONT,
                      textAlign: 'center',
                      paddingHorizontal: RFValue(15),
                      paddingTop: RFValue(10),
                    }}>
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Content>
        </FullPageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    height: 42,
    marginTop: 10,
  },
  accessButton: {
    height: 42,
    marginTop: 42,
  },
});

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  loginEdit: user => dispatch(userEdit(user)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
