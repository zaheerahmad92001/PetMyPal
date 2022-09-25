
import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from 'react-native-responsive-screen';

import { popUpImg } from '../../constants/ConstantValues';

export default function ModalWrapper(props){
    if(React.isValidElement(props.children)){  
    return(
        <Modal useNativeDriver animationInTiming={700} animationOutTiming={1500} isVisible={showDelete} style={StyleSheet.flatten([styles.modal,props.style])}>



        </Modal>
    )
    }
    return null;
}

const styles= StyleSheet.create({
        modal: {
            backgroundColor: 'white',
            maxHeight:wp(50),
            width:300,
            alignSelf:'center',
            top:'40%',
            borderRadius:20,
            alignItems:'center',
            justifyContent:'center',
            marginBottom:-5 
          }
    
})


