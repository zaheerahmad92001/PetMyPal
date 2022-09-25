import React ,{Component}from 'react'
import {View ,Text , Image, StyleSheet,TouchableOpacity, Linking } from 'react-native'
import { PINK, TEXT_INPUT_LABEL } from '../../constants/colors'
import HTML from 'react-native-render-html';

const Products=(props)=>{
    const{item} = props
    let link =`<a href="${item.postLink}" target="_blank" class="hash" rel="nofollow">${item.postLink}</a>`
        return(
        <TouchableOpacity onPress={() =>Linking.openURL(item.postLink)}>
         <Text style={styles.priceText}>{item.postLinkTitle}</Text>
         <HTML
              baseFontStyle={styles.baseFontStyle}
              html={link}
              tagsStyles={{  
                a:{
                  color:PINK,marginBottom:10,
                  textDecorationLine: 'none'
                },        
            //     p:{textAlign: 'justify', top:8},
            // i:{textAlign: 'justify',color:'red' },
            // li:{color:'green'},
            // ul:{textAlign:'justify' ,top:20, color:'red'},
         }}
            />
         <View style={styles.imgView}>
         <Image
          resizeMode='contain'
          source={{uri:item.postLinkImage}}
          style={styles.imgStyle}
         />
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
      width:'100%',
      height:200,
      overflow:'hidden',
      alignSelf:'center',
    //   backgroundColor:'red'
  },  
  imgStyle:{
    width:'100%',
    height:null,
    flex:1,
  },
  baseFontStyle: {
    // fontSize: 14,
    // flex: 8,
    // flexWrap: 'wrap',
    // fontWeight: 'normal',
    // color:PINK,
    // color: '#465575',
  },
  priceView:{
      flexDirection:'row',
  },
  priceText:{
    marginVertical:4,
  }
})