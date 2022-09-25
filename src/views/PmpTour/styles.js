import React from 'react'
import {StyleSheet} from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { White } from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { mediumText } from '../../constants/fontSize';


const styles = StyleSheet.create({
    logo:{
        tintColor:White
    },
    video:{
        flex:1,
        borderRadius:10,
        overflow:'hidden',
        marginHorizontal:25,
      },
      
      tourPmp:{
        width:wp(100),
        marginTop:hp(10),
        resizeMode:'contain',
      },
      textContainer:{
        marginTop:hp(5)
      },
      text:{
        color:White,
        textAlign:'center',
        fontSize:30,
        // fontWeight:"bold",
      },
      textStyle:{
        //   marginTop:hp(2),
          color:White,
          fontSize:mediumText,
          textAlign:'center',
      },
      btnContainerStyle:{
        backgroundColor:White,
        marginTop:hp(6),
        height:hp(7),
        width:hp(40),
        alignItems:'center',
        alignSelf:'center',
        elevation:1,
        shadowColor:'#000',
        shadowOffset:{height:1,width:1},
        shadowOpacity:0.2,
        shadowRadius:2,
    },
})

export default styles;