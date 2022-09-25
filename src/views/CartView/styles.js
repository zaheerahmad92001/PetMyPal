import { Platform } from 'react-native'
import { StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { black, darkSky, grey, TEXT_INPUT_LABEL, White } from '../../constants/colors'
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily'
import { errorFont, labelFont, largeText, mediumText, textInputFont } from '../../constants/fontSize'
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: 'white', 
        justifyContent: 'center',
        paddingVertical:10,
        // paddingHorizontal:20,
        // alignItems: 'center',
        // borderBottomColor: 'black',
        // borderBottomWidth: 1,
        // height: 50,
    },
    cardView:{
        paddingHorizontal:15,
        paddingVertical:15,
        marginHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        borderRadius:15,
        elevation:3,
        shadowColor:'black',
        // backgroundColor : "#0000",
        backgroundColor:White,
        shadowOffset:{height:0,width:0},
        shadowOpacity:0.6,
        shadowRadius:0.2,
        
    },
    smallImgView:{
        overflow:'hidden',
        width:80,
        height:80,
        // backgroundColor:TEXT_INPUT_LABEL,
        borderRadius:10,
        paddingHorizontal:5,
        paddingVertical:5,

    },
    qtyText:{
     color:TEXT_INPUT_LABEL,
     fontSize:textInputFont,
     fontWeight:'500',
     marginTop:5,
     width:wp(40)
    },
    qty:{
        color:TEXT_INPUT_LABEL,
        fontSize:textInputFont,
        fontWeight:'500',
        marginTop:5,
       },
       price:{
        color:darkSky,
        fontSize:textInputFont,
        fontWeight:'bold',
        marginTop:5,
       },
    imgStyle:{
        width: null, 
        height: null,
         flex: 1
    },
    innerView:{
     marginLeft:10,
     alignSelf:'flex-start',
    //  backgroundColor:'red',
     flex:1,
    },
    
    innerRow:{
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'space-between'
    },

    heading:{
        color:black,
        fontSize:labelFont,
        fontWeight:'bold'
    },

    rowBack: {
        alignItems: 'center',
        // backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center' ,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
        // height:hp(10),
        marginVertical:20,
    },
    backRightBtnRight: {
        // backgroundColor: 'red',
        right: 0,
    },
    imgView:{
        overflow:'hidden',
        width:30,
        height:30,
        borderRadius:10,
        paddingHorizontal:5,
        paddingVertical:5,
    },
    invoiceOuterView:{
      marginHorizontal:25,
      marginTop:hp(4.5),
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
        marginTop:Platform.OS=='android'? hp(8):hp(7),
        // width:wp
    },
    empityView:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
    },
    noItemText:{
        color:TEXT_INPUT_LABEL,
        fontSize:textInputFont,
    }
})
export default styles