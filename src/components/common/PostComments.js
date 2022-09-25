import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Icon, Thumbnail, } from 'native-base';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { postTimeAndReaction } from '../../utils/DateFuncs';
import FastImage from 'react-native-fast-image';
import { commonState } from '../../components/common/CommomState';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';





export const PostComments = (props) => {
   
    const { item, index, reactionsList } = props
    const { reaction } = commonState
    let { time } = postTimeAndReaction(item.time);
    return (
        <View style={{ marginVertical: RFValue(10) }} key={index} >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Thumbnail
                    square
                    source={{ uri: item.publisher.avatar ? item.publisher.avatar : '' }}
                    style={styles.thumbNailStyle}
                />
                <View style={styles.outerView}>
                    <View style={styles.innerView}>
                        <Text style={{ fontWeight: 'bold' }}>{item.publisher.first_name}</Text>
                        <Text style={{ color: '#8B94A9' }}>{time}</Text>
                    </View>
                    <Text style={styles.textStyle}>{item?.Orginaltext}</Text>

                </View>
            </View>
            {item.reactionVisible ? reactionsList() : null}
            {/* <View
                style={styles.textInputOuterView}>
                <View
                    style={styles.textInputInnerrView}>
                    <TouchableOpacity
                        onPress={props.onPress}
                        onLongPress={props.onLongPress}
                        style={{ flexDirection: 'row' }}
                     >
                        {item.reaction.is_reacted ? (

                            <FastImage
                                style={styles.imgIcon1}
                                source={{
                                    uri: reaction[item?.reaction?.type] ? "" + reaction[item.reaction.type] : null,
                                }}
                            />

                        ) : (
                            <IonicIcon name="heart-outline" color="#424242" size={20} style={{top:5}} />
                        )}

                        <Text
                            style={{...styles.textInputStyle,top:6}}>
                            {' ' + item.reaction.count}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.replyView}>
                    <TouchableOpacity style={{ flexDirection: 'row' }}>
                        <Icon
                            name="message-outline"
                            type="MaterialCommunityIcons"
                            style={{ fontSize: RFValue(16) }}
                        />
                        <Text
                            style={styles.textInputStyle}>
                            Reply
                        </Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    )
}

export default PostComments;

const styles = StyleSheet.create({
    imgIcon1: {
        width: RFValue(20),
        height: RFValue(20),
    },
    thumbNailStyle: {
        backgroundColor: '#F2F2F2',
        borderRadius: wp(3),
    },
    outerView: {
        backgroundColor: '#F0F1F4',
        flex: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    innerView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textStyle: {
        marginHorizontal: 2,
        color: '#465575',
        fontSize: 13
    },
    textInputOuterView:{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: RFValue(50),
        paddingTop: RFValue(5),
        marginLeft: 10,
    },
    textInputInnerrView:{
        flexDirection: 'row',
        paddingHorizontal: RFValue(10),
        alignItems: 'center',
    },
    textInputStyle:{
        fontFamily: THEME_FONT,
        fontSize: RFValue(12),
        alignSelf: 'flex-start',
        paddingHorizontal: RFValue(10),

       
    },
    replyView:{
        flexDirection: 'row',
        paddingHorizontal: RFValue(10),
        alignItems: 'center',
    },

})
