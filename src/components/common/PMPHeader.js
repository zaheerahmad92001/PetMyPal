import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity
} from 'react-native';
import {
  Thumbnail,
  Text,
  Header,
  Icon,
} from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import { black, BLUE, darkSky, White,} from '../../constants/colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { logo } from '../../constants/ConstantValues';
import { labelFont, textInputFont } from '../../constants/fontSize';
import { Badge } from 'react-native-elements';
import DrawerMenu from '../../assets/drawer-icons/drawer-menu.svg'


const PMPHeader = props => {
  const {
    rghtIconType , 
    ImageRightIcon ,
    rghtIconStyle,
    isCart,
    cartValue,
    backArrowColor,
    headerStyle
  } = props
  return (
    <Header
      noShadow
      transparent
      style={headerStyle}
    >
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} translucent={false} />
      <View style={[styles.wraper,{headerStyle}]}>
    
        <View style={styles.leftView}>
          <TouchableOpacity onPress={props.LeftPress}
            style={styles.leftView}
          >
            {props.ImageLeftIcon ? (
              <Icon
                name={'chevron-back'}
                type="Ionicons"
                style={
                  backArrowColor?  
                  [styles.iconStyle,{color:backArrowColor}] 
                  :
                  [styles.iconStyle]
                }
              />
            ) : (
              <DrawerMenu
               width={20} height={20}
              />
              // <Thumbnail
              //   square
              //   style={[styles.menuStyle, { resizeMode: 'contain' }]}
              //   source={props.menuImg}
              // />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.middleView}>
          {props.centerText ?
            <Text style={
              backArrowColor ?
              [styles.centerTextStyle,{width:props.longWidth?wp(80):wp(60),textAlign:'center' , color:backArrowColor,fontSize:textInputFont}]
              :
              [styles.centerTextStyle,{width:props.longWidth?wp(80):wp(60),textAlign:'center',fontSize:textInputFont}]
              }>{props.centerText}</Text>
            :
            props.appLogo && <Thumbnail
              square
              style={[styles.logoStyle,props.pmplogoStyle]}
              source={logo}
            />}
        </View>

        
          <View style={styles.rightView}>
            {props.rightBtnText ?
              <View>
                <TouchableOpacity onPress={props.RightPress}>
                  <View style={styles.rightBtnStyle}>
                    <Text style={styles.rightBtnTextStyle}>{props.rightBtnText}</Text>
                  </View>
                </TouchableOpacity>
              </View> :
            <View style={{flexDirection:'row' ,alignItems:'center'}}>
              <Icon
               onPress={props.HashTagPress}
               name={props.HashTagIcon}
               type={props.HashTagIconType}
               style={styles.hashTagIconStyle}
              />
              {/* <TouchableOpacity
               onPress={props.HashTagPress}
               style={[styles.touchStyle,{marginRight:15}]}>
                <Thumbnail
                    square
                    style={{ width:20, height: 20, resizeMode: 'contain' }}
                    source={props.hashtag}
                  />
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={props.RightPress}
                style={styles.touchStyle}
                disabled={props.disabled}
                >
                {!ImageRightIcon ? (
                  <Thumbnail
                    square
                    style={{ width: 23, height: 23, resizeMode: 'contain' }}
                    source={props.ImageRight}
                  />
                ) : (
                  <Icon
                    name={ImageRightIcon}
                    type= {rghtIconType?rghtIconType:"MaterialIcons"}
                    style={rghtIconStyle?[rghtIconStyle]:[styles.imgRighIconStyle]}
                  />
                )}
                {props.RightText ? (
                  <Text style={[styles.textStyle],{color:props.disabled?'black':darkSky}}>{props.RightText}</Text>
                ) : null}
              </TouchableOpacity>
              </View>

            }
          </View>
         {cartValue>0 && 
          <Badge
           value={cartValue}
           containerStyle={styles.bdgContainer}
           badgeStyle={{backgroundColor:darkSky}}
          />
          }

      </View>
    </Header>

  );
};

export default PMPHeader;

const styles = StyleSheet.create({

  wraper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Platform.OS == 'ios' ? 10 : 0,
    // backgroundColor:'white',
    top:Platform.OS =='android'? -10:0,
    flex: 1,
  
  },
  leftView: {
    justifyContent: 'center',
    // alignItems: 'center',
    flex: 3,
    height: hp(5),
  },
  rightView: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  middleView: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    fontSize: 24,
    color:darkSky
  },
  menuStyle: {
    width: 18,
    height: 18,
  },
  centerTextStyle: {
    fontSize:textInputFont,
    fontWeight: 'bold',
    color:darkSky,
    
  },
  logoStyle: {
    resizeMode:'contain',
    width: 50,
    height: 50
  },


  dashboardHeading: {
    fontSize: RFValue(18),
    fontFamily: THEME_BOLD_FONT,
    color: '#222326',
    alignSelf: 'center',
    fontWeight: '600',
  },
  rightBtnStyle: {
    backgroundColor: BLUE,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  rightBtnTextStyle: {
    color: 'white',
    fontSize: 14,
    textAlign:'center'
  },
  textStyle:{
    color:black,
    fontFamily:THEME_FONT,
    fontSize:labelFont,
    fontWeight:'700'
  },

  imgRighIconStyle:{
   fontSize: 24,
   color:darkSky
    // color: '#222326'
  },
  bdgContainer:{ 
     position: 'absolute',
     top:Platform.OS=='android'? 0:4, 
     right:0,
  },
 hashTagIconStyle:{
   color:darkSky,
   fontSize:17,
   marginRight:15,
 }

});
