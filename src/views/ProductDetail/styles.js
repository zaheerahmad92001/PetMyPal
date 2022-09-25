import { StyleSheet } from 'react-native'
import { black, darkSky, grey, TEXT_INPUT_LABEL, White } from '../../constants/colors'
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily'
import { labelFont, largeText, mediumText, textInputFont } from '../../constants/fontSize'
const styles = StyleSheet.create({
    container:{
      marginHorizontal:25,
    },
    sliderholder:{
        height:150,
        // flex:1,
        marginBottom:10,
      },
    slide1: {
        height:150,
        justifyContent: 'center',
        alignItems: 'center',
        overflow:'hidden',
        paddingVertical:20,
        paddingHorizontal:20,
      },
      imgContainer:{
          width:'100%',
        //   height:'100%',
          height:150,
          overflow:'hidden',
      },
      smallImg:{
        width:'100%',
        height:60,
        overflow:'hidden',
    },
      buttonText:{
          color:darkSky,
          fontSize:40,
          fontWeight:'bold',
      },
      
    headingView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        // marginTop:20,
    },
    ratingView:{
     flexDirection:'row',
     alignItems:'center',
     marginTop:10,
    },

    heading:{
        color:black,
        fontSize:labelFont,
        fontWeight:'bold'
    },
    price:{
        color:darkSky,
        fontSize:labelFont,
        fontWeight:'bold'
    },
    rating:{
        color:black,
        fontSize:12,
        fontWeight:'500',
        marginLeft:5,
    },
    totalRating:{
        color:TEXT_INPUT_LABEL,
        fontWeight:'500',
        fontSize:12,
        marginLeft:5
    },
    desView:{
      marginTop:20,
    },
    description:{
        color:grey,
        fontSize:textInputFont,
        fontWeight:'500',
    },
    border:{
        width:'100%',
        height:StyleSheet.hairlineWidth,
        backgroundColor:TEXT_INPUT_LABEL,
        marginTop:20,
    },
    imgStyle:{
        width: null, 
        height: null,
         flex: 1
    },
    smallImgView:{
        overflow:'hidden',
        width:45,
        height:45,
        backgroundColor:TEXT_INPUT_LABEL,
        borderRadius:10,
        paddingHorizontal:5,
        paddingVertical:5,

    },
    checkBoxView:{
        flexDirection:'row',
        alignItems:'center',
        // justifyContent:'center',
    },
    btnContainerStyle:{
        alignSelf:"center",
        marginTop:25,
        marginBottom:20
    },
        
})
export default styles