
import React, { Component } from 'react'
import {TouchableOpacity, } from 'react-native';
import { View, Text, StyleSheet, Image, TextInput, } from 'react-native'
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { DANGER, HEADER, White } from '../../constants/colors';
import CustomLoader from './CustomLoader';


const EditPost = (props) => {
    const { 
         showEditModal,
         value,
         handleCancelBtn,
         handleUpdateBtn,
         InProcess,
         postTextError
         } = props
    return (
        <Modal
            isVisible={showEditModal}
            useNativeDriver={true}
            style={styles.modalStyling, { marginBottom: 0 }}
        >
            <View style={styles.onceUponeTiem}>
                <Text style={styles.editPost}>Edit Post</Text>
                <TextInput
                    onChangeText={props.onChangeText}
                    value={value}
                    maxLength={50}
                    multiline={true}
                    textAlignVertical="top"
                    placeholder={`What's in your mind ?`}
                    style={postTextError ? [styles.descError] : [styles.descStyle]}
                />
                <View style={styles.btnView}>
                    <View>
                        <TouchableOpacity 
                        onPress={handleCancelBtn}
                        style={styles.cancelBtn}>
                            <Text style={{ color: '#F596A0', fontWeight: 'bold' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {InProcess ?
                        <CustomLoader/>
                        :
                        <TouchableOpacity 
                        onPress={handleUpdateBtn}
                        style={styles.createBtn}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Update</Text>
                        </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>

        </Modal>
    )
}
export default EditPost;

const styles = StyleSheet.create({
    modalStyling: {
        backgroundColor: White,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginHorizontal: 15,
    },
    descStyle: {
        borderColor: '#00000021',
        borderWidth: 1,
        paddingHorizontal: RFValue(10),
        paddingBottom: RFValue(20),
        marginHorizontal: RFValue(20),
        marginTop: RFValue(6),
        marginBottom: RFValue(16),
        borderRadius: RFValue(15),
        height: 80,
    },
    descError: {
        borderColor: DANGER,
        borderWidth: 1,
        paddingHorizontal: RFValue(10),
        paddingBottom: RFValue(20),
        marginHorizontal: RFValue(20),
        marginBottom: RFValue(16),
        marginTop: RFValue(6),
        borderRadius: RFValue(15),
        height: 80,
    },
    onceUponeTiem: {
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 1,
        width: '90%',
        marginHorizontal: RFValue(20),
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        top: hp(10)
    },
    editPost: {
        textAlign: 'center',
        color: HEADER,
        fontSize: 20,
        marginTop: 15,
        marginBottom: 10,
    },
    createBtn: {
        height: 42,
        borderWidth: 1,
        width: wp(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: RFValue(15),
        borderColor: '#20ACE2',
        backgroundColor: '#20ACE2',
    },
    cancelBtn: {
        height: 42,
        borderWidth: 1,
        width: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: RFValue(15),
        borderColor: '#F596A0',
    },
    btnView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 4,
        paddingBottom:hp(3)
    }
})


