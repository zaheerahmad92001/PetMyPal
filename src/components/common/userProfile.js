import React from 'react';
import {View,Text,Image} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CStyles from '../../views/EditProfile/styles';
import { Contact_Person_Icon} from '../../constants/ConstantValues';


const UserProfile=(props)=>{
  var year = ''
  var month = ''
  if (props.user?.registered) {
    [month, year] = props.user.registered.split('/')
} 
    return(
        <View style={CStyles.cardView}>
                <View style={{...CStyles.cardStyle,marginTop:props.top}}>
                  <View style={CStyles.cardView}>
                    <View style={CStyles.imgView}>
                      <Image
                        style={CStyles.imgStyle}
                        source={{
                          uri: props?.user?.avatar ? props.user.avatar : Contact_Person_Icon
                        }}
                      />
                    </View>
                  </View>


                  <View style={{marginTop:wp(5)}}>
                    <Text style={CStyles.nameStyle}> {props?.user?.name}</Text>
                    <Text style={{...CStyles.joiningDate,marginTop:wp(2)}}>
                      Member Since: {year}
                    </Text>
                  </View>

                 

                </View>
              </View>
    )

}
export default UserProfile;