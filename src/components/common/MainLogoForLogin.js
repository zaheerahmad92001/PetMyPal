import React from 'react';
import { Platform } from 'react-native';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    PixelRatio
} from 'react-native';
import {Icon}from 'native-base'
import { RFValue } from 'react-native-responsive-fontsize';
import { BLUE, grey, HEADER } from '../../constants/colors';
import { THEME_BOLD_FONT } from '../../constants/fontFamily';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MainLogoForLogin = (props) => {

    const { 
        testImage, 
        goBack, 
        phone, 
        text,
        backButton,
        heading,
     } = props

    var open = false

    if (phone) {
        if (phone.number != "") {
            var open = true

        }
    }


    return (
        
        <ImageBackground
            source={require('./../../assets/images/updated/commonLogoBackrond.png')}
            style={styles.image}
        >
            <View style={styles.backArrowView}>
                <Icon
                    name={'chevron-back-outline'}
                    type={'Ionicons'}
                    style={styles.headerStyle}
                    onPress={() => { goBack() }}
                />
            
            </View>
            <View style={styles.contentView}>
               
                    <View style={styles.optionsContainer}>
                        <Image
                            style={styles.logoBg}
                            resizeMode='contain'
                            source={require('./../../assets/images/updated/commonLogo.png')}
                        />
                    </View>
                    {heading ? 
                    <Text style={styles.headingStyle}>{heading}</Text>:
                
                    <View style={styles.optionsContainerText}>  
                        <Image
                            style={styles.logoBgText}
                            source={testImage}
                            resizeMode='contain'
                        />
                    </View>
                 }

                {open && 
                 <View style={styles.textHolder}>
                    <Text style={styles.textStyle}>Verification code has been sent to your mobile number +{phone.callingCode + " " + phone.number}</Text>

                </View>
            }

                {text && 
                <View style={styles.subTextView}>
                    <Text style={styles.subText}>{text}</Text>
                </View>
                }
            </View>
        </ImageBackground>
        // </View>

    );
}

export default MainLogoForLogin;

const styles = StyleSheet.create({
    contentView: {
        // justifyContent: 'center',
        marginTop:20,
        // height:Platform.OS==='android'?hp(40):hp(40) 
        //  PixelRatio.getPixelSizeForLayoutSize(80)
    },
    optionsContainerTop: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',

    },

    subText: {
        fontSize: RFValue(16),
        // fontFamily: THEME_BOLD_FONT,
        textAlign: 'center',
        paddingHorizontal: RFValue(15),
        fontWeight: '500',
        color:grey
    },
    logoback: {
        width: PixelRatio.getPixelSizeForLayoutSize(3),
        height: PixelRatio.getPixelSizeForLayoutSize(7),
    },
    optionsContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    image: {
        width: '100%',
        // backgroundColor:'red',
        height:hp(35),
        // backgroundColor:'red'
        // height: PixelRatio.getPixelSizeForLayoutSize(80),
    },
    optionsContainerText: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20
    },
    logoBg: {
        width: PixelRatio.getPixelSizeForLayoutSize(40),
        height: PixelRatio.getPixelSizeForLayoutSize(25),
        // resizeMode: 'contain',
    },
    logoBgText: {
        width: PixelRatio.getPixelSizeForLayoutSize(50),
        height: PixelRatio.getPixelSizeForLayoutSize(11),
    },
    touch: {
        paddingTop: 20,
        paddingLeft: 20
    },
    textHolder: {
        margin: 12,
        justifyContent: 'center'
    },
    textStyle: {
        textAlign: 'center'
    },
    subTextView: {
        // margin: 12,
        marginHorizontal:12,
        marginTop:5,
        justifyContent: 'center'
    },
    backArrowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      headerStyle: {
        paddingTop: Platform.OS === 'android' ? 20 : 20,
        paddingLeft: 20,
        color:HEADER,
      },
      headingStyle: {
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        fontWeight: 'bold',
        color: BLUE,
        marginTop:15,
        alignSelf:'center'
      },

});



