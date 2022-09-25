import React from 'react'
import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp , heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { black, DANGER, darkSky, grey, placeholderColor, TEXT_INPUT_LABEL } from '../../constants/colors'
import { labelFont, textInputFont } from '../../constants/fontSize'
const styles =  StyleSheet.create({
   wraper:{
       flex:1,
   },
   container:{
    marginHorizontal:25,
   },
   imgView:{
    width: wp(100),
    height:200,
    overflow:'hidden',
   },
   imgStyle:{
      height:null,
      width:null,
      flex:1
   },
   
   contactusText:{
    color:TEXT_INPUT_LABEL,
    fontSize:textInputFont,
    fontWeight:'500',
    marginTop:15,
   },
   emailText:{
      marginLeft:-5,
      color:darkSky,
      fontWeight:'600',
      fontSize:labelFont,
   },
   infoContainer:{
    marginTop:15,
   },

   breedViewError:{
    paddingVertical:10,
    // borderBottomWidth:StyleSheet.hairlineWidth,
    // borderBottomColor:DANGER
  },
  breedView:{
    paddingVertical:10,
    // borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:grey
  },
  breadInnerView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  breedText:{
    flex:1,
    color: black,
  },
  iconStyle:{
    color: TEXT_INPUT_LABEL,
    fontSize: 11,
    width:wp(10),
    textAlign:'center'
  },
  containerStyle:{
      marginTop:10,
    color:TEXT_INPUT_LABEL,
    width:wp(86),
    left:3

  },
  textInput:{
    width:wp(86),
    left:4
  },
  btnContainerStyle:{
      alignSelf:'center',
      marginTop:15,
      bottom:9
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  ddView:{
      // flex: 1, 
    // borderBottomColor:grey ,
    // borderBottomWidth:1,
    // color:'#969592',
    bottom:4
    
  

  },
  ddView_err:{
    // flex: 1, 
    borderBottomWidth:0 ,
    borderBottomColor:DANGER ,
    color:placeholderColor,
    bottom:4
  }
    

})
export default styles