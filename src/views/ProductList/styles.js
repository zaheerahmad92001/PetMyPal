import React from 'react'
import { StyleSheet } from 'react-native'
import { TEXT_INPUT_LABEL } from '../../constants/colors'
import { mediumText } from '../../constants/fontSize'

const styles = StyleSheet.create({
   wraper:{
       flex:1
   },
   flatListStyle:{
       marginHorizontal:20,
   },
   loadingView:{
       flexDirection:'row',
       alignItems:'center',
       justifyContent:'center',
       flex:1
   },
   noproduct:{
       color:TEXT_INPUT_LABEL,
       fontSize:mediumText,
       fontWeight:'500',
   }
})
export default styles