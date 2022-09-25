import React from 'react'
import { Platform } from 'react-native';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native'
import { grey, TEXT_INPUT_LABEL, darkSky, White, DANGER, black } from '../../constants/colors';
import { mediumText, textInputFont } from '../../constants/fontSize';
import { Icon } from 'native-base'
import { TouchableOpacity } from 'react-native';
import { THEME_FONT } from '../../constants/fontFamily';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Overlay } from 'react-native-elements'
import { isIphoneX } from 'react-native-iphone-x-helper';
import SkyBlueBtn from './SkyblueBtn';
import { Divider } from "react-native-elements";



const BreedPicker = (props) => {
    const { isVisible, data, loading } = props
    return (
        <Overlay
            isVisible={isVisible ? isVisible : false}
            useNativeDriver={true}
            onBackdropPress={props.onBackdropPress}
            animationIn={props.animationIn}
            animationInTiming={props.animationInTiming}
            animationOut={props.animationOut}
            overlayStyle={styles.overlayStyle}
            fullScreen={true}
        >

            <View style={[styles.modalView]}>
                <View style={{
                    height: hp(83)
                }}>
                    <TextInput
                        placeholder={'Type here'}
                        placeholderTextColor={grey}
                        value={props.value}
                        onChangeText={props.onChangeText}
                        secureTextEntry={props.secureTextEntry}
                        editable={props.editable}
                        multiline={props.multiline}
                        maxLength={props.maxLength}
                        keyboardType={props.keyboardType}
                        returnKeyType={props.returnKeyType}
                        ref={props.ref}
                        onSubmitEditing={props.onSubmitEditing}
                        blurOnSubmit={false}
                        style={[styles.inputField]}
                    />
                    {loading ?
                        <ActivityIndicator
                            color={darkSky}
                            size={'small'}
                        />
                        : !loading && data?.length > 0 ?
                            <FlatList
                                data={data}
                                keyExtractor={(item) => { item }}
                                style={{ marginTop: 10 }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => props.onItemClick(item)}
                                            style={styles.itemContainer}
                                        >

                                            <Text style={styles.itemStyle} >{`${item}`}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            /> :
                            <View style={styles.noData}>
                                <Text
                                    style={
                                        [styles.itemStyle, { color: TEXT_INPUT_LABEL }]}>
                                    {'Data not Found'}</Text>
                            </View>
                    }

                </View>
                <Divider color={darkSky} />
                <View
                    style={styles.closeBtnView}>
                    <SkyBlueBtn
                        onPress={props.onBackdropPress}
                        title={'Close'}
                        btnContainerStyle={styles.btnContainerStyle}
                    />
                </View>

            </View>
        </Overlay>
    )
}
export default BreedPicker

const styles = StyleSheet.create({
    overlayStyle: {
        backgroundColor: 'transparent',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 22,
        borderBottomLeftRadius: 22,
        // width:wp(100),
        alignSelf: 'center',
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        marginBottom: Platform.OS == 'android' ? 50 : 0,
    },
    modalView: {
        backgroundColor: White,
        width: wp(100),
        height: hp(100),
        paddingTop: Platform.OS == 'android' ? 20 : isIphoneX() ? 60 : 35,

    },

    inputField: {
        paddingVertical: Platform.OS == 'ios' ? 10 : 8,
        fontSize: textInputFont,
        marginTop: 20,
        marginHorizontal: 15,
        borderBottomColor: grey,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    itemStyle: {
        color: black,
        fontFamily: THEME_FONT,
        fontSize: mediumText,
        fontWeight: '600',
        marginBottom: 10,
    },
    itemContainer: {
        marginHorizontal: 20,
        // marginBottom:20,
    },
    noData: {
        alignItems: 'center',
        justifyContent: "center",
        flex: 1,
    },
    btnContainerStyle: {
        alignSelf: 'center',
        width: wp(30)
    },
    closeBtnView: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    }
})