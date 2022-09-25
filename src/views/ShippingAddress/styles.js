import { Platform } from 'react-native'
import { StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { black, DANGER, darkSky, grey, PINK, TEXT_INPUT_LABEL, White } from '../../constants/colors'
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily'
import { labelFont, largeText, mediumText, textInputFont } from '../../constants/fontSize'
const styles = StyleSheet.create({

    container:{
      marginHorizontal:25,
    },
    heading:{
      color:black,
      fontWeight:'bold',
      fontSize:labelFont,
      // marginTop:10,
    },
    intlPhoneInputStyle:{
        paddingLeft:2,
        paddingVertical:0,
        borderBottomColor:grey,
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingBottom:Platform.OS=='ios'?10:null,
        marginTop:Platform.OS==='android'? 0:10,
    },
    intlPhoneError:{
      paddingLeft:2,
      paddingVertical:0,
      borderBottomColor:DANGER,
      borderBottomWidth:StyleSheet.hairlineWidth,
      paddingBottom:Platform.OS=='ios'?10:null,
      marginTop:Platform.OS==='android'? 0:10,
    },
    border:{
        width:'100%',
        height:StyleSheet.hairlineWidth,
        backgroundColor:TEXT_INPUT_LABEL,
        marginTop:20,
    },
    breedView:{
      paddingVertical:10,
      borderBottomWidth:StyleSheet.hairlineWidth,
      borderBottomColor:grey
    },
    breedViewError:{
      paddingVertical:10,
      borderBottomWidth:StyleSheet.hairlineWidth,
      borderBottomColor:DANGER
    },

    breadInnerView:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
    },
    breedText:{
      flex:1,
      color: black,
      fontSize:textInputFont,
    },

    iconStyle:{
      color: TEXT_INPUT_LABEL,
      fontSize: 11,
      width:wp(10),
      textAlign:'center'
    },
    cardFormWrapper: {
      // padding: 10,
      // margin: 10
      // paddingVertical:10,
      marginVertical:10,
    },
    alertIconWrapper: {
      padding: 5,
      flex: 4,
      justifyContent: 'center',
      alignItems: 'center'
    },
    alertWrapper: {
      backgroundColor: '#ecb7b7',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderRadius: 5,
      paddingVertical: 5,
      marginTop: 10
    },
    alertTextWrapper: {
      flex: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    alertText: {
      color: '#c22',
      fontSize: 16,
      fontWeight: '400'
    },

    invoiceOuterView:{
      marginHorizontal:15,
    //   alignSelf:'flex-end',
    //   alignItems:'center',
    //   justifyContent:'space-between',
      marginTop:hp(3),
    //   backgroundColor:'green',
    },
    invoiceView:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      marginBottom:10,
    },
    invoiceHeading:{
        color:TEXT_INPUT_LABEL,
        // textAlign:'right',
        fontWeight:'500',
        fontSize:labelFont,
        // marginRight:15,
        // width:wp(30)

    },
    totalText:{
        color:black,
        fontSize:labelFont,
        // textAlign:'right',
        fontWeight:'bold',
        // marginRight:15,
        // width:wp(30)
    },
    priceStyle:{
        color:black,
        fontSize:labelFont,
        fontWeight:'500',
        // width:wp(25),
        // textAlign:'right',
    },
    totalPriceStyle:{
        color:darkSky,
        fontSize:labelFont,
        fontWeight:'bold',
        // textAlign:'right',
        // width:wp(25) 
    },
    btnContainerStyle:{
        alignSelf:"center",
        marginTop:Platform.OS=='android'? hp(4):hp(3.5),
        marginBottom:20,
        // width:wp
    },
    cancelBtn:{
        alignSelf:"center",
        // marginTop:10,
        // marginTop:Platform.OS=='android'? hp(3):hp(2.5),
        borderColor:PINK
    },

    indicatorView:{
     flexDirection:'row',
     alignItems:'center',
     marginHorizontal:20,
    },

    inactive:{
      width:25,
      height:25,
      borderRadius:25/2,
      borderColor:darkSky,
      borderWidth:1,
      justifyContent:'center',
      alignItems:'center',
    },
    active:{
      width:25,
      height:25,
      borderRadius:25/2,
      borderColor:darkSky,
      backgroundColor:darkSky,
      borderWidth:1,
      justifyContent:'center',
      alignItems:'center'
    },
    completed:{
      width:25,
      height:25,
      borderRadius:25/2,
      borderColor:PINK,
      backgroundColor:PINK,
      borderWidth:1,
      justifyContent:'center',
      alignItems:'center'
    },

    hrLine:{
      width:wp(33),
      backgroundColor:darkSky,
      height:1,
    },
    inactiveNumStyle:{
      color:TEXT_INPUT_LABEL,
      fontSize:mediumText,
      fontWeight:'400',
      marginTop:-1
    },
    activeNumStyle:{
      color:White,
      fontSize:mediumText,
      fontWeight:'400',
      marginTop:-1
    },
    freeTagView:{
      backgroundColor:PINK ,
      borderRadius:5,
      justifyContent:'center',
      alignItems:'center',
      paddingVertical:10,
      marginTop:10,
      // paddingHorizontal:10,
    },
    h1:{
       color:White,
       fontSize:labelFont,
       marginBottom:6

    },
    h2:{
       color:White,
       fontSize:labelFont,
       marginBottom:6

    },
    disView:{
      // marginHorizontal:25,
      width:wp(73),
       flexDirection:'row',
       alignItems:"center" , 
       alignSelf:'center',
       justifyContent:'center',
       marginTop:10,
       borderBottomColor:grey,
       borderBottomWidth:1
       },
       applyText_active:{
         fontSize:labelFont,
         fontWeight:'bold',
         color:darkSky
       },
       applyText_Inactive:{
        fontSize:labelFont,
        fontWeight:'500',
        color:grey
      },
      checkBox_container:{
          borderWidth: 0,
          left: -20,
          // marginTop: 10
      }
    
    
})
export default styles