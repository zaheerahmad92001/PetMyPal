import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { black, darkSky, White } from '../../constants/colors'
import { Icon } from 'native-base'
import SkyBlueBtn from './SkyblueBtn'
import { authText } from '../../constants/ConstantValues'
import { largeText, textInputFont } from '../../constants/fontSize'

const VendorModal =(props)=> {
    const {isVisible, onPress, getStarted}=props
  return (
            <Modal 
             visible={isVisible?isVisible:false} 
             transparent={true} 
             animationType="slide"
             >
                <View style={styles.modalView} >
                <TouchableOpacity
                    onPress={onPress}
                    style={styles.Icon}
                >
                    <Icon name={'cross'} type="Entypo" style={styles.tagIcon} />
                </TouchableOpacity>
                
                    {/* <View style={styles.modalViewItems} > */}
                        <Image source={require('../../assets/images/updated/artboard2.png')} 
                          style={styles.modalImg} />
                        <Text style={styles.modalText}>Become a Vendor</Text>
                        <Text style={styles.modalTextPara} >
                            {authText}
                        </Text>
                        <SkyBlueBtn
                            title={'Get Started'}
                            titleStyle={{color:White}}
                            onPress={getStarted }
                            btnContainerStyle={styles.btnContainerStyle}
                        />
                    </View>
                {/* </View> */}
            </Modal>
  )
}

export default VendorModal;

const styles = StyleSheet.create({
    modalView:{
        // flex:1,
        backgroundColor:White,
        // backgroundColor:'red',
        alignSelf:"center",
        marginTop:hp(20),
        width:wp(85),
        borderRadius:20,
        paddingVertical:20,
        alignItems:'center',

        shadowColor:'#000',
        shadowOffset:{height:2,width:2},
        shadowOpacity:0.2,
        shadowRadius:2,
        elevation:2,
    },
    modalText:{
        alignSelf:'center',
        color:darkSky,
        fontSize:largeText,
        fontWeight:"700",
    },
    modalTextPara:{
        alignSelf:'center',
        marginTop:hp(1),
        color:'grey',
        margin:wp(8),
        fontSize:textInputFont,
        textAlign:'center'
    },
    modalImg:{
        // height:140,
        width:wp(100),
        resizeMode:'contain'
        // margin:wp(5),
        // width:wp(70),
        // marginBottom:hp(1)
    },
    modalViewItem:{
        justifyContent:'center',
        alignItems:'center'
    },
    btnContainerStyle:{
        justifyContent:'center',
        alignItems:'center',
        width:wp(70),
        
        // marginLeft:wp(5),
        elevation:2
    },
    Icon:{
        // marginTop:hp(1),
        // marginLeft:wp(60)
        alignSelf:"flex-end",
        right:15,
    },
    tagIcon:{
        color:black,
        fontSize:25,
    }
})
