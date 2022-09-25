import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { LIKE_URL, LOVE_URL, SAD_URL, ANGRY_URL, HAHA_URL, WOW_URL, videoTimeSize } from '../../constants/ConstantValues';


const Reactions = (props) => {
    const { ReactOnComment, item, index } = props
    return (
        <View
            key={item.id}
            style={styles.outerView}>
            <TouchableOpacity
              onPress={() => { ReactOnComment(index, item, 'Like'); }}>
                <FastImage
                    style={[styles.imgIcon,]}
                    source={require('../../assets/images/reactions/GIF350.gif')}
                    // source={{ uri: LIKE_URL }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { ReactOnComment(index, item, 'Love'); }}
            >
                <FastImage
                    style={styles.imgIcon}
                    source={{ uri: LOVE_URL }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { ReactOnComment(index, item, 'HaHa'); }}
            >
                <FastImage
                    style={styles.imgIcon}
                    source={{ uri: HAHA_URL }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { ReactOnComment(index, item, 'Wow') }}
            >
                <FastImage
                    style={styles.imgIcon}
                    source={{ uri: WOW_URL }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { ReactOnComment(index, item, 'Sad') }}
            >
                <FastImage
                    style={styles.imgIcon}
                    source={{
                        uri: SAD_URL
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => { ReactOnComment(index, item, 'Angry') }}
            >
                <FastImage
                    style={styles.imgIcon}
                    source={{
                        uri: ANGRY_URL
                    }}
                />
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({

    outerView: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        marginTop:10,
        marginBottom:10,
    },
    imgIcon: {
        width: RFValue(26),
        height: RFValue(26),
        marginLeft:RFValue(10),
    },
})

export default Reactions