import { StyleSheet, Dimensions} from 'react-native';
import { THEME_FONT } from '../../constants/fontFamily';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const {height:screenHeight, width:screenWidth} = Dimensions.get('window');

export default StyleSheet.create({
    heading: {
        fontSize: RFValue(26),
        fontWeight: 'bold',
        lineHeight: 33,
        letterSpacing: 1,
        color: '#000000',
        marginLeft: 10,
        fontFamily: THEME_FONT,
    },
    icon: {
        fontSize: RFValue(22),
        color: 'black',
        marginTop: 4,
    },
   
    container: {
        flex: 1,
        backgroundColor: 'white',
        // paddingTop: 20,
        // paddingLeft: 20,
        // paddingRight: 20,
    },
    iconStyle:{
        height: screenHeight * 0.13,
        width: screenWidth * 0.25,
        alignSelf:'center',
        marginBottom:5
    },
    userNameText:{
      fontFamily: THEME_FONT,
      fontSize: RFValue(20),
      width: 100  
    },
    subHeading: {
        fontSize: RFValue(16),
        color: 'white',
        marginLeft: 10,
        fontFamily: THEME_FONT,
    },
    buttonStyle : {
        width:'100%',
        alignItems:'center',
        justifyContent:'flex-start',
        marginBottom:5,
    },   
    subHeadingButton: {
        fontSize: RFValue(16),
        paddingLeft:10,
        paddingRight:10,
        letterSpacing: 1,
        color: '#FFFFFF',
        marginLeft: 10,
        fontFamily: THEME_FONT,
    },
    button:{
        borderColor:'#FF5252',
        borderWidth: 2,
        backgroundColor:'#FF5252',
        marginTop:20,

    },
})