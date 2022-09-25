import React ,{Component}from 'react'
import {View ,Text , Image, StyleSheet,TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import {mediumDog} from '../../constants/ConstantValues'
import { TEXT_INPUT_LABEL } from '../../constants/colors'

const Products=(props)=>{
    const{item} = props
    return(
        <TouchableOpacity 
         onPress={props.onPress}
         style={styles.container}>
         <View style={styles.imgView}>
         <Image
          source={{uri:item?.images[0].i_path_full}}
          style={styles.imgStyle}
        //   resizeMode={'contain'}
         />
         </View>
         <Text style={styles.priceText}>{item.p_name}</Text>
        
         <View style={[styles.priceView,{marginTop:5}]}>
         <Text>Price</Text>
         <Text style={styles.priceText}>{item.p_sale_price}</Text>
         </View>
        </TouchableOpacity>
    )
}
export default Products
const styles = StyleSheet.create({
  container:{
    borderColor:TEXT_INPUT_LABEL,
    borderWidth:StyleSheet.hairlineWidth,
    paddingHorizontal:10,
    paddingBottom:10,
    marginBottom:20,
    marginHorizontal:10,
    // width:wp(40)
  },
  imgView:{
      width:200,
      height:200,
      overflow:'hidden',
      alignSelf:'center',
    //   backgroundColor:'red'
  },  
  imgStyle:{
    width:null,
    height:null,
    flex:1,
  },
  priceView:{
      flexDirection:'row',
  },
  priceText:{
    //   marginLeft:20,
  }
})