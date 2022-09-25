import { StyleSheet, Platform, Dimensions } from 'react-native'
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { BGCOLOR, BLUE } from '../../constants/colors';

export default StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:BGCOLOR,
      
    },
    bottomSheet:{
        height: screenHeight * 0.42, 
        backgroundColor:'#F7FAFC', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20, 
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        elevation: Platform.OS === 'ios' ? 5 : 10,
        shadowRadius: 5,
        shadowOpacity: 0.4,
        alignItems:'center'
      },
      imgIcon: {
        width: RFValue(36),
        height: RFValue(36)
      },
      imgIcon1: {
        width: RFValue(20),
        height: RFValue(20)
      },
})