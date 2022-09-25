import React from 'react';
import {View, StyleSheet, Image, StatusBar, Dimensions,TouchableOpacity,ActivityIndicator} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Header,
  Icon,
} from 'native-base';
import {BLUE_NEW} from '../../constants/colors';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import { SERVER, server_key } from '../../constants/server';
import requestRoutes from '../../utils/requestRoutes';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch,useSelector } from 'react-redux';
import {petMyPalPagesApiService} from '../../services/PetMyPalPagesApiService';
import {petMyPalGroupApiService} from '../../services/PetMyPalGroupApiService';
const{petOwnerLikePage}=petMyPalPagesApiService;
const{joinGroup,getPetOwnerRecommendGroups,getOwnerJoinedGroups}=petMyPalGroupApiService;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const Join = props => {
  const dispatch=useDispatch(); 
  const group=useSelector(state=>state.groups);
  const page=useSelector(state=>state.pages); 
  const [selectId,setSelectId]=React.useState('');
  const joinClick = async(item) => {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
    setSelectId(item.id);
    props.callBack(item.id)
  
    if(props?.item?.type == "group"){
    try {
    dispatch(joinGroup(JSON.parse(access_token)?.access_token,item.id));
    } catch (error) {
      console.log(error);
    }
  
}
else if(props?.item?.type == "page"){
  dispatch(petOwnerLikePage(JSON.parse(access_token)?.access_token,item.id));

}


}
   
  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'center', marginTop: wp(2)}}>
           {props.item.id==selectId &&(group.joinedGroupLoader||page.likePageLoader)?
        <ActivityIndicator style={{marginTop:10}} size="small" color="#03B7EC" />
      :<TouchableOpacity
        onPress={() => joinClick(props.item)}
        style={styles.borderTouchable}>
       
<Text numberOfLines={1} style={{color: 'black'}} note>
Join
</Text>
      </TouchableOpacity>}
    </View>
  
  );
};

export default Join;

const styles = StyleSheet.create({
  borderTouchable: {
    flexDirection: 'row',
    width: wp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
    borderWidth: 1,
    borderRadius: 12,
    borderColor: BLUE_NEW,
  },
});
