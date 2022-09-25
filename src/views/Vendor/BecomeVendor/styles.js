import React from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { black, darkSky, grey, White } from '../../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const styles = StyleSheet.create({
    container:{
        backgroundColor:White
    },
    containerBox:{
        flexDirection:'row', backgroundColor:'#EBF3FF'
      },
      Box:{
        marginLeft:10
      },
      text1:{
        fontSize:18, marginLeft:wp(2.5), marginTop:hp(1.5)
      },
      text2:{
        fontSize:24,fontWeight:'500',margin:hp(1)
      },
      text3:{
        color:'grey',fontSize:15, margin:hp(1)
      },
      text4:{
        fontSize:18,fontWeight:'500', margin:hp(1), textDecorationLine:'underline'
      },
      img:{
        margin:10, marginLeft:hp(2.5), width:wp(40),height:hp(18)
    },
    vendor:{
        fontSize:18, margin:15, color:black, fontWeight:'700'
    },
    vendorCard:{
        flexDirection:'row',
        backgroundColor:'#EBF3FF'
    },
    vCardImage:{
        margin:hp(1),
        marginLeft:wp(4),
        width:wp(15),
        height:hp(7),
        borderRadius:20
    },
    vCardText:{
        margin:hp(1),
        justifyContent:'center'
    },
    vText:{
        fontSize:18,
        fontWeight:'600'
    },
    vText1:{
        color:grey,
        fontSize:14,
    },
    vCardBtn:{
        marginLeft:wp(30),
        marginTop:hp(2.5),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        borderWidth:1,
        width:wp(30),
        height:hp(4),
        borderColor:darkSky
    },
    absolute: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
})

export default styles;