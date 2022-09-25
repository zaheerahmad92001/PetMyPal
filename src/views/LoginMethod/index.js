import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  NativeModules
} from 'react-native';
const { RNTwitterSignIn } = NativeModules

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { persistToken } from '../../redux/actions/user';
import { grey, darkSky, TEXT_INPUT_LABEL } from '../../constants/colors';
import { SERVER, server_key } from '../../constants/server';
import requestRoutes from '../../utils/requestRoutes';
import AsyncStorage from '@react-native-community/async-storage';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
// import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import firebase from 'react-native-firebase';
import MainLogoForLogin from '../../components/common/MainLogoForLogin';
import TextField from '../../components/common/TextField';
import ErrorMsg from '../../components/common/ErrorMsg';
import ErrorModal from '../../components/common/ErrorModal'
import SkyBlueBtn from '../../components/common/SkyblueBtn';
import Hr from "react-native-hr-component";
import {account_Deactivated} from '../../constants/ConstantValues'
import styles from './styles';
import { validate ,Capitalize } from '../../utils/RandomFuncs';
import CustomLoader from '../../components/common/CustomLoader'
import { USER_DETAIL } from '../../constants/storageKeys';



import {
  AccessToken,
  GraphRequest,
  LoginManager,
} from 'react-native-fbsdk';

let _webClientId ='55185035239-c9l4cerkh28vue9gvd8ap33bpdmg33pt.apps.googleusercontent.com'
const Constants = {
  //Dev Parse keys
  TWITTER_COMSUMER_KEY:'ZaHW7zn1jvuiyJ2huldfqovsB',
  TWITTER_CONSUMER_SECRET:'hI9RGOs7wPx9R3nBSC7Haq9QrcFpAaNJjA0O4junt7BojVQQqm'
}

GoogleSignin.configure({
  webClientId:
    '55185035239-c9l4cerkh28vue9gvd8ap33bpdmg33pt.apps.googleusercontent.com',
  offlineAccess: true,
});

class LoginMethod extends React.Component {
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
      fetching: false,
      gmailFetching: false,
      androidId: '',
      passwordVisible: false,
      loading: false,
      nameError:false,
      passwordError:false,
      error: '',
      heading:'Hoot!',
      isModal_Visible:false,


    };
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  componentDidMount() {

    this.getFCM();
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

  opengmailLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('here is user info from Google ' , userInfo)
      // this.getUserInfo_Gmail(userInfo)
      this.handleSocialLogin(userInfo.idToken, 'google');

      return true 

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated');
      }
    }
  };

  // getUserInfo_Gmail = async (token)=>{
  //   console.log('api call')

  //     await fetch(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,birthdays,genders,urls&sources=READ_SOURCE_TYPE_PROFILE&key=${token.serverAuthCode}`,{
  //       headers: {
  //         Authorization: `Bearer ${token.idToken}` ,
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //     }).then((response) => {
  //              response.json().then((json) => {
                   
   
  //                  console.log("Public Profile " , json);
  //              })
  //          })
  //          .catch(() => {
  //              console.log('ERROR GETTING DATA FROM FACEBOOK')
  //          })
  //       }


  
  openfbLogin = async () => {   
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
  }
    LoginManager.logInWithPermissions(["public_profile","email", ]).then((result)=>{
      console.log('here are permissions' , result)
      if(result){
    AccessToken.getCurrentAccessToken().then((data) => {
      const { accessToken } = data
      console.log('here is access token', data)
      if(accessToken){
     

      this.handleSocialLogin(accessToken, 'facebook');
      }

      console.log(accessToken);
      this.initUser(accessToken)
  })
}

})
  return true

    console.log('fb login')
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
  }

    let soc = this;
    LoginManager.logInWithPermissions(["public_profile", "email","name"]).then(
      function (result) {
        console.log('facebook login result', result)
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const infoRequest = new GraphRequest(
              "/me?fields=name,picture,email",
              null,
              (error, result) => {
                if (error){ 
                  console.log('err login with facebook' , error)
                  soc.setState({ loading: false });
                }
                if (result) {
                  console.log("This is facebooook :: ", result);
                  soc.facebookSignIn(result.email, result.name);
                }
              }
            );
            // new GraphRequestManager().addRequest(infoRequest).start();
          });
          console.log("Login success with permissions: " + result);
        }
      },
      
    )
    .catch((err)=>{
      console.log('err in catch', err)
    })

  
  };

  initUser = async (token) => {
   await fetch('https://graph.facebook.com/v2.8/me?fields=id,name,first_name,last_name,gender,email,hometown,friends&access_token=' + token)
        .then((response) => {
          
            response.json().then((json) => {
          console.log('fb login response ', json,'kkkkkkk');

                const ID = json.id
                // console.log("ID " + ID);

                const EM = json.email
                // console.log("Email " + EM)

                const FN = json.first_name
                // console.log("First Name " + FN);
                const LN = json.last_name
                // console.log("Last Name " + LN);
const fbProfilrpic=json.picture.data.url
                console.log("Public Profile pic " , fbProfilrpic);
            })
        })
        .catch(() => {
            console.log('ERROR GETTING DATA FROM FACEBOOK')
        })
}


  closeModal = () => {
    this.setState({ isModal_Visible: false })
  }


  handleSocialLogin = async (token, provider) => {
    switch (provider) {
      case 'facebook':
        this.setState({ fetching: true });
        break;
      case 'google':
        this.setState({ gmailFetching: true });
        break;
      default:
        break;
    }

    try {
      const data = new FormData();
      data.append('server_key', server_key);
      data.append('provider', provider);
      data.append('access_token', token);
      data.append('google_key' ,'55185035239-c9l4cerkh28vue9gvd8ap33bpdmg33pt.apps.googleusercontent.com')
      data.append('android_n_device_id', this.state.androidId);
      data.append('android_m_device_id', this.state.androidId);

      const response = await fetch(
        SERVER + requestRoutes['social-login'].route,
        {
          method: requestRoutes['social-login'].method,
          body: data,
          headers: {},
        },
      );
      const responseJson = await response.json();
      console.log('here is social response ' , responseJson)
      if (responseJson.api_status === 200) {
        this.setState({
          fetching: false,
          gmailFetching: false,
        });
        const obj = {
          access_token: responseJson.access_token,
          user_id: responseJson.user_id,
        };
        await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({ ...obj }));
        this.props.navigation.navigate('AppNavigator');
      } else {
        this.setState({
          fetching: false,
          gmailFetching: false,
        });
        Alert.alert('', "Can't sign in !");
      }
    } catch (e) {
      Alert.alert('', 'Network Error !');
      console.log(error);
    }
  };

  showPassword = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };



 async handleLoginPressed() {
    const { username, password, androidId } = this.state;

    // if (username.trim().length > 0 && password.trim().length > 0) {
      if (validate(username.trim()) && password.trim().length > 0) {
      this.setState({ passwordVisible: false, loading: true });

      let user_obj={username,password,androidId}
      await AsyncStorage.setItem(USER_DETAIL,JSON.stringify(user_obj))

      const data = new FormData();
      data.append('server_key', server_key);
      data.append('username', username.trim());
      data.append('password', password);
      data.append('android_n_device_id', androidId);
      data.append('android_m_device_id', androidId);

      this.setState({ loading: true })

      petMyPalApiService.login(data).then(response => this.requestHandler(response?.data)).catch(e => {
        this.setState({ 
          loading: false,
          isModal_Visible:true,
          error:Capitalize(e?.errors?.error_text)
         });
         console.log('error when trying to login' , e)
      })
      
    } else if(!validate(username) && ! password){
      this.setState({
        loading: false,
        errorMsg: 'Check Your Email And Password.',
        nameError:true,
        passwordError:true
      });
     
    }else if(!validate(username)){
      this.setState({
        loading: false,
        errorMsg: 'Valid Email Is Required.',
        nameError:true,
      });
    }else if(!password){
      this.setState({
        loading: false,
        errorMsg: 'Password is Required!',
        passwordError:true
      });
    }
  }

  async requestHandler(response) {

    if (response.api_status === 200) {
      this.setState({ loading: false });
      // console.log('response?.message',response)
     await this.props.persistToken(response?.access_token)
      const obj = {
        access_token: response.access_token,
        user_id: response.user_id,
      };
      await AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify({ ...obj }));

      if(response?.message == account_Deactivated){
        this.props.navigation.navigate('AccountRecovery')
      }else if(response?.message !=account_Deactivated){
      this.props.navigation.navigate('AppNavigator');
      }
      
    } else {
      console.log('error while login', response.errors.error_text)
      this.setState({
        // error: Capitalize(response.errors.error_text),
        error:'Invalid Email or Password',
        isModal_Visible:true,
        fetching: false,
        loading:false
      });
    }

  }

  goBack = () => {
    this.props.navigation.pop();
  };

   

   getResponseInfo = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.log(JSON.stringify(result));
    }
  };

  LoginWithTwitter =()=>{
    RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        console.log('loginData',loginData)
        const { authToken, authTokenSecret } = loginData
        if (authToken && authTokenSecret) {
          this.setState({})
        }
      })
      .catch(error => {
        console.log('login with twitter', error)
      }
    )

  }


  

   

  render() {
    const {
      fetching,
      gmailFetching,
      errorMsg,
      passwordVisible,
      nameError,
      passwordError,
      error,
      heading , 
      isModal_Visible,
    } = this.state;
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
        <Content>

          <MainLogoForLogin
            goBack={this.goBack}
            testImage={require('./../../assets/images/updated/SignIn.png')}
          />

          <View style={{ flex: 3, marginHorizontal: 15 }}>
            <TextField
              label={'Email'}
              placeholder={'Enter Email'}
              value={this.state.username}
              onChangeText={(text) => this.setState({ username: text,nameError:false,  errorMsg: '' })}
              error={nameError}
              keyboardType={"email-address"}
            />

            <TextField
              label={'Password'}
              placeholder={'Enter Password'}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text, passwordError:false,  errorMsg: '' })}
              onIconPress={() => this.showPassword(passwordVisible)}
              iconName={passwordVisible ? 'eye' : 'eye-with-line'}
              secureTextEntry={!passwordVisible}
              iconType={'Entypo'}
              style={{color: passwordVisible ?darkSky :TEXT_INPUT_LABEL}}
              error={passwordError}
            />
      {nameError || passwordError ?
              <ErrorMsg
                errorMsg={errorMsg}
              /> : null
            }


            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ForgotPassword')}
              style={styles.forgetPass}>
              <Text style={styles.forgetText}>Forgot your password?</Text>
            </TouchableOpacity>

         {this.state.loading?
           <CustomLoader/>
          : 
          <SkyBlueBtn
              btnContainerStyle={styles.btnStyle}
              title={'Sign In'}
              onPress={() => { this.handleLoginPressed() }}
            />
            
          }
            <Hr
              lineColor={grey}
              width={StyleSheet.hairlineWidth}
              text="OR"
              hrStyles={{ marginTop: 25, marginBottom: 15 }}
              textStyles={styles.customStyle}
            />
          </View>

          {/* <SkyBlueBtn
              btnContainerStyle={styles.btnStyle}
              title={'Sign Twitter'}
              onPress={() => { this.LoginWithTwitter() }}
            /> */}
          <View style={{ marginHorizontal: wp(5) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {fetching ?
            <CustomLoader/>
            :
            <TouchableOpacity 
            // onPress={() => { this.openfbLogin() }}
            >
              {/* <Image
                style={[styles.logoText, { resizeMode: 'contain' }]}
                source={require('../../assets/images/updated/fbLogo.png')}
              /> */}
            </TouchableOpacity>
          }

           { gmailFetching ? 
            <CustomLoader/>:
        
              <TouchableOpacity 
              // onPress={() => { this.opengmailLogin() }}
              >
                {/* <Image
                  style={[styles.logoText, { resizeMode: 'contain' }]}
                  source={require('../../assets/images/updated/googleLogo.png')}
                /> */}
              </TouchableOpacity>
              }

            </View>
          </View>


          {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('ChoosePet') }}>
              <Image
                style={[styles.signupText, { resizeMode: 'contain' }]}
                source={require('../../assets/images/updated/signupText.png')}
              />
              
            </TouchableOpacity>*/}

         <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop:3,
            marginBottom:20
          }}>
           <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('ChoosePet') }}>
              <Text style={{ color: '#8B94A9' }}>you don`t have an account?
              <Text style={{ fontWeight: 'bold', color: '#f598a2' }}> Sign Up</Text></Text>
          </TouchableOpacity>
       </View> 

        </Content>
        <ErrorModal
            isVisible={isModal_Visible}
            onBackButtonPress={() => this.closeModal()}
            info={error}
            heading={heading}
            heading={'Hoot!'}
            onPress={() => this.closeModal()}
          />
      </Container>
    );



  }
}



const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps ={persistToken};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginMethod);
