import { StyleSheet, Platform } from "react-native";
import {getBottomSpace} from 'react-native-iphone-x-helper'
import { widthPercentageToDP } from "react-native-responsive-screen";

import { black, darkSky } from "../../constants/colors";

export default StyleSheet.create({
    wraper: {
        flex: 1,
        backgroundColor:'white',
        marginTop:10

    },
    container: {
        flexGrow:1,
        marginHorizontal:10,
        marginTop:15,
        backgroundColor:'red'
    },
flatListStyle:{
    //  marginHorizontal:10,
},
inputStyle:{
    padding: Platform.OS === 'android' ? 10 : 15,
    flex: 1,
    // width:widthPercentageToDP(85),
    color:black,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    // backgroundColor:'red',
    // elevation:2,
    // shadowColor:'#000',
    // shadowOffset:{height:2,width:0},
    // shadowRadius:5,
    // shadowOpacity:0.2,
    borderColor:'grey',

    borderWidth:StyleSheet.hairlineWidth,
    borderRadius:5,
},
inputOuterView:{
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'white',
    maxHeight: 150,
    marginBottom:getBottomSpace() + 10
},
sendIcon:{
    fontSize:30,
    marginHorizontal:5,
    color:darkSky}
})