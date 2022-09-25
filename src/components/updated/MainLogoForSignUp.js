import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  PixelRatio,
} from 'react-native';
import ContactInput from '../../components/common/ContactInput';
import StepsUp from './StepsUp';
import { White, darkSky, grey, HEADER, BLUE, DANGER } from '../../constants/colors';
import { Icon, } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { userEdit } from '../../redux/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { textInputFont } from '../../constants/fontSize';
import ChangePhoneNumber from '../ChangePhoneNum';
import { TouchableOpacity } from 'react-native-gesture-handler'
import {getStatusBarHeight} from 'react-native-iphone-x-helper'


class MainLogoForSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }


  sendOTPonPhoneChange = () => {
    this.props.send_OTP_on_Num_Change()

  }



  render() {
    const {
      testImage,
      goBack,
      steps,
      contact,
      phoneNum,
      error,
      cca2,
      callingCode,
      sending,
      handleContactChange,
      handleCountryChange,
      verifyText,
      heading,
      text,
      petName,
      showOverlay,
      handleOverlay,
      setDefaultValue,
      defaultVlaue,
      pageName,  ////// this prop is comming from  VerifyAccount 
      email,      ////// this prop is comming from  VerifyAccountByEmail 
      exist  ,
      changeNum  /// to check either Phone alreay exist 
    } = this.props

    /****************** masked phone number ********************/
    var open = false
    var output = ''

    if (phoneNum) {
      var open = true
    }



    /************** avoid to show overlay when showoverlay prop is undefined ********/

    let showModal = false
    if (showOverlay != undefined) {
      showModal = showOverlay
    }

    return (

      <ImageBackground
        source={require('./../../assets/images/updated/commonLogoBackrond.png')}
        style={styles.image}>

        <View style={styles.backArrowView}>
          {steps >= 3 ?
            <Icon style={styles.headerStyle}/>
            :
            <Icon
              name={'chevron-back-outline'}
              type={'Ionicons'}
              style={styles.headerStyle}
              onPress={() => { goBack() }}
            />
          }

          {pageName == 'verifyAccount' ? null :
            steps &&
            <StepsUp steps={steps}/>
          }

        </View>

        <View style={styles.contentView}>

          <View style={styles.optionsContainerTop}>
            <Image
              style={styles.logoBg}
              resizeMode={'contain'}
              source={require('./../../assets/images/updated/commonLogo.png')}
            />

            {heading ?
              <Text style={[styles.headingStyle, this.props.headingContainer]}>{heading}</Text>
              :
              <View style={styles.optionsContainerText}>
                <Image
                  style={styles.logoBgText}
                  source={testImage}
                  resizeMode='contain'
                />
              </View>
            }
          </View>

          {email ?
            <View style={styles.verificatonTextHolderTwo}>
                <Text style={[styles.textStyle]}>{verifyText}</Text>
                  <Text
                    style={[styles.textStyle, { color: HEADER, marginTop: 5 }]}>
                    {`${email}.`}
                  </Text>
              </View> :null
          }

          {open &&
            <View>
              <View style={styles.verificatonTextHolderTwo}>
                <Text style={[styles.textStyle]}>{verifyText}</Text>
                <Text
                  style={[styles.textStyle, { color: HEADER, marginTop: 5 }]}>
                  {`${callingCode} ${phoneNum}.  `}
                </Text>
              </View>

              {pageName == 'verifyAccount' ? null :
              changeNum ?
                <TouchableOpacity
                  style={[styles.changePhoneStyle]}
                  // hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                 
                   onPress={handleOverlay}
                >
                  <Text style={styles.changeText} >Change my</Text>
                  <Text
                    style={{ color: BLUE, fontSize: textInputFont }}>
                    number?
                  </Text>
                </TouchableOpacity>
                :
                null
              }

            </View>
          }


          {!open && <View style={styles.subTextView}>
            <Text style={styles.textStyle}>{text}</Text>
            <Text style={styles.nameStyle} >{petName}</Text>
          </View>
          }

        </View>


        <ChangePhoneNumber
          visible={showModal}
          toggleOverlay={handleOverlay}
          changeContact={(value) => handleContactChange(value)}
          cca2={cca2}
          callingCode={callingCode}
          contact={contact}
          defaultVlaue={defaultVlaue}
          setDefaultValue={setDefaultValue}
          registerPhoneNumber={() => this.sendOTPonPhoneChange()}
          error={error}
          sending={sending}
          exist={exist?exist : false}
        />

      </ImageBackground>


    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({ loginEdit: user => dispatch(userEdit(user)) });

export default connect(mapStateToProps, mapDispatchToProps)(MainLogoForSignUp);

const styles = StyleSheet.create({
  optionsContainerTop: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

  },
  logoback: {
    width: PixelRatio.getPixelSizeForLayoutSize(3),
    height: PixelRatio.getPixelSizeForLayoutSize(7),
  },

  optionsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20
  },
  image: {
    width: '100%',
    height: Platform.OS === 'ios' ? hp(33) : hp(32),
    marginTop:getStatusBarHeight()

  },
  optionsContainerText: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: 300,
    height: 30,
  },
  logoBg: {
    width: PixelRatio.getPixelSizeForLayoutSize(40),
    height: PixelRatio.getPixelSizeForLayoutSize(25),
  },
  logoBgText: {
    width: '100%',
    height: '100%',
  },
  backArrowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableArea: {
    paddingTop: 20,
    paddingLeft: 20
  },
  iconStyle: {
    color: White,
    fontSize: 20,
    marginRight: 10,
  },
  header: {
    backgroundColor: darkSky,
    height: RFValue(40),
    width: 'auto',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

  },
  label: {
    marginTop: 10,

  },
  labelWithError: {
    marginTop: 10,
    color: DANGER
  },
  errorText: {
    marginTop: 10,
  },
  changePh: {
    color: White,
    fontSize: textInputFont,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  overlayStyle: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  container: {
    width: wp(90, hp(60)),
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  btnContainerStyle: {
    marginTop: 10,
    alignSelf: 'center'
  },
  contentView: {
    marginTop: 20,
  },
  verificatonTextHolder: {
    marginHorizontal: 12,
    marginTop: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificatonTextHolderTwo: {
    width: wp(80),
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  textStyle: {
    textAlign: 'center',
    color: '#8B94A9',
    fontSize: textInputFont,

  },
  subTextView: {
    margin: 12,
    marginBottom: 0,
    marginTop: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerStyle: {
    paddingTop: Platform.OS === 'android' ? 20 : 20,
    paddingLeft: 20,
    color:darkSky,
  },
  nameStyle: {
    color: HEADER,
    fontSize:textInputFont,
    marginLeft: 3
  },
  changeText: {
    color: grey,
    fontSize: textInputFont,
    marginRight: 5
  },
  headingStyle: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontWeight: 'bold',
    color: BLUE,
    marginTop: 15,
  },
  changePhoneStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop:5,
    width: wp(70),
    // zIndex:1,
    // paddingVertical:20,
    // backgroundColor:'red'
  }

});