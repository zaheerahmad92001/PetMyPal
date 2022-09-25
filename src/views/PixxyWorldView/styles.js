import { StyleSheet, Platform, Dimensions } from 'react-native'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { BGCOLOR, BLACK, DANGER, darkSky, PINK, TEXT_INPUT_LABEL, White, YELLOW } from '../../constants/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { labelFont } from '../../constants/fontSize';

export default StyleSheet.create({
    container: {
        flex:1,
    },
      imageContainerStyle:{
         borderRadius: 15, 
         marginHorizontal:2, 
         marginVertical:5,
      },
      badgeContainer:{
         position: 'absolute',
         bottom:10, 
         right:4,
      },
      badgeTextStyle:{
        color:White,
        fontSize:12,
        fontWeight:'500'
      },
      textStyle: {
        fontSize: RFValue(20),
        color: '#8B94A9',
        fontWeight: 'bold',
    
      },

      tabStyle: {
        backgroundColor: 'white',
        marginBottom: 4,
        marginLeft:wp(2),
      },
      
      activeTextStyle: {
        fontSize: RFValue(20),
        color: '#20ACE2',
        fontWeight: 'bold',
      },
    
      activeTabStyle: {
        backgroundColor: 'white',
        marginBottom: 4,
        marginLeft: wp(2),
        borderBottomColor:darkSky,
        borderBottomWidth:2
      },
      loadingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
      },
      empityPixxy:{
       justifyContent:'center',
       alignItems:'center',
      },
      btnVeiw:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:StyleSheet.hairlineWidth,
        paddingVertical:15,
        paddingHorizontal:20,
        backgroundColor:White,
        shadowColor:'black',
        shadowOffset:{width:0, height:0},
        shadowRadius:0,
        shadowOpacity:0.3,
        elevation:1,
      
      },
      btnText:{
        color:BLACK,
        fontSize:12,
        fontWeight:'700',
      },
      countText:{
        color:BLACK,
        fontSize:12,
        fontWeight:'700',
      },
      lostPet:{
        color:PINK,
        fontSize:12,
        fontWeight:'700',     
      },
      deceasedPet:{
        color:YELLOW,
        fontSize:12,
        fontWeight:'700',     
      },
      noPixxyText:{
        color:TEXT_INPUT_LABEL,
        fontSize:labelFont,
        fontWeight:"500"
      },
      otherBtn:{
         marginTop: 30,
      },
      tabBarUnderlineStyle: {
        borderRadius: 25,
        height: 0,
    },
      
})