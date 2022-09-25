import { StyleSheet, Platform, Dimensions } from 'react-native'
import { THEME_FONT, THEME_BOLD_FONT } from '../../constants/fontFamily';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { BGCOLOR } from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default StyleSheet.create({
    container: {
        // flex:1,
        backgroundColor:BGCOLOR
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
      shareText:{
        color: '#C7CCDA',
        marginLeft: 10
      },
      shareOuterView:{
        flex: 1,
        borderRadius: wp(4),
        paddingVertical: RFValue(5),
        borderWidth: 1,
        borderColor: '#C7CCDA',
        overflow: 'hidden',
        height: hp(9)
      },
      noMemory:{
        textAlign: 'center',
        fontSize: RFValue(18),
        fontFamily: THEME_FONT,
      },
      noPixxyView:{
        flex: 1,
        height: RFValue(250),
        backgroundColor: '#FFFFFF',
        marginVertical: RFValue(5),
      },
      pixxyShowView:{
        flex: 1,
        paddingHorizontal: RFValue(10),
        backgroundColor: 'white',
      }

})