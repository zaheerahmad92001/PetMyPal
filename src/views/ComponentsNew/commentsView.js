import React, {useState} from 'react';
import {Dimensions, View, Text, TouchableOpacity , StyleSheet} from 'react-native';

import {Thumbnail} from 'native-base';
import {RFValue} from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp,heightPercentageToDP as hp,} from 'react-native-responsive-screen';
import HTML from 'react-native-render-html';

const CommentsView = ({
  item,
  user,
  navigation,
  postTimeAndReaction,
  openComments,
}) => {
  let comment = 
    item.get_post_comments?.length >= 2
      ? item.get_post_comments.slice(1)
      : item.get_post_comments?.length > 0
      ? item.get_post_comments.slice(-1)
      : [];


      let userId = undefined
  if (user?.user_data?.user_id) {
    userId = user?.user_data?.user_id   // becoze  we r getting user from redux as state.user.user on some screens
  } else {
    userId = user?.user?.user_data?.user_id  // becoze on petOwnerView we r getting user from redux as state.user due to some other props i am not changing it
  }
  return (
    <>
      <TouchableOpacity
        onPress={() => openComments && openComments()}
        style={styles.writeComentsView}>
        <Text style={{color: '#C7CCDA'}}>Write a comment</Text>
      </TouchableOpacity>
      {Array.isArray(comment) && comment.concat()?.reverse().map((item, i) => {

        let {time, feeling} = postTimeAndReaction(item.time);
        return (
          <View key={i}>
            <View style={styles.InnerView}>
              <TouchableOpacity
                style={styles.profileBtn}
                onPress={() => {
                  if (item.user_id == userId) {
                    navigation.navigate('UserProfile');
                  } else {
                    navigation.navigate({
                      routeName: 'Profile',
                      key: 'Profile',
                      params: {user_id: item.user_id},
                    });
                  }
                }}>
                <Thumbnail
                  square
                  source={{uri: ""+ item.publisher.avatar}}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
              <View style={styles.commentOuterView}>
                <View style={styles.timeNameView}>
                  <Text style={{fontWeight: 'bold'}}> {item.publisher.first_name}</Text>
                  <Text style={{color: '#8B94A9'}}>{time}</Text>
                </View>

                {item.text ? 
                <Text numberOfLines={2} ellipsizeMode='tail'>{item.Orginaltext}</Text>
                // <Text numberOfLines={2} ellipsizeMode='tail'>{item.text.replace(/<br>/g,'\n')}</Text>
                // <Text>{item.text}</Text>
                // <HTML
                //   baseFontStyle={{
                //     marginHorizontal: 2,
                //     color: '#465575',
                //     fontSize: 13,
                //   }}
                //   html={item.text}
                // />
                : null}
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
};

export default CommentsView;

const styles = StyleSheet.create({

writeComentsView:{
  borderWidth: 0.6,
  borderRadius: 6,
  padding: 8,
  paddingLeft: 12,
  borderColor: '#C7CCDA',
},
InnerView:{
  flexDirection: 'row',
   marginTop: 12,  
},
profileBtn:{
  marginRight: RFValue(8),
  overflow: 'hidden',
  borderRadius: wp(3),
  alignItems:'center',
},
thumbnail:{
  backgroundColor: '#F2F2F2',
  borderRadius: wp(3),
  width:wp(10),
  height:wp(10),
  top:1
},
commentOuterView:{
  backgroundColor: '#F0F1F4',
  flex: 1,
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 10,
  height: 65,
  overflow: 'hidden'
},
timeNameView:{
  flexDirection: 'row',
  justifyContent: 'space-between',
},

})