import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Icon, Left, Right, Body, ListItem, Input } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { THEME_FONT } from '../../constants/fontFamily';
import { BGCOLOR, BLUE, darkSky } from '../../constants/colors';
import { Overlay } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { SERVER, server_key } from '../../constants/server';
import { petMyPalGroupApiService } from '../../services/PetMyPalGroupApiService';
import { getAccessToken } from '../../utils/global';
const { getMembers } = petMyPalGroupApiService

const Width=Platform.OS === 'IOS' ? wp(60) : wp(45)

const MemberModal = (props ) => {
    const { showModal, navigation, Members, closeModal, group_id, isOwnGroup } = props


    const [members, setMembers] = useState([]);
    const [user_Id, setuser_Id] =useState('')

    useEffect(() => {
        setMembers(Members)
        getAccessToken()

    }, [Members])

  const getAccessToken=async()=> {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        let token= JSON.parse(access_token)
        setuser_Id(token.user_id)
      }
    
    const makeAdmin = async (id, admin, index) => {

        const type = 'add_admin'
        const TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
        const token = JSON.parse(TOKEN).access_token;
        const formData = new FormData();
        formData.append('user_id', id);
        formData.append('server_key', server_key);
        formData.append('type', type)
        formData.append('group_id', group_id)

        const response = await getMembers(token, formData);
        
        let updatedMembers = members;
        if (response?.data?.data == true) {

            updatedMembers[index].is_admin = true;
            setMembers([...updatedMembers]);
        }

        else {
            updatedMembers[index].is_admin = false
            setMembers([...updatedMembers]);
        }
    }
    const deleteMember = async (id, index) => {
        const type = 'delete_joined_user'
        const TOKEN = await AsyncStorage.getItem(ACCESS_TOKEN);
        const token = JSON.parse(TOKEN).access_token;
        const formData = new FormData();
        formData.append('user_id', id);
        formData.append('server_key', server_key);
        formData.append('type', type)
        formData.append('group_id', group_id)

        const response = await getMembers(token, formData);

        if (response?.data?.status == 200) {
            let updatedMembers = members
            setMembers([...members.filter(item => item.user_id != id)])
        }

    }
    const renderMember = ({ item, index }) => {
        return (

            <View key={index}>
                <View style={{ backgroundColor: '#FFFFFF'}}>
                </View>
                <View
                    style={{
                        width: Dimensions.get('window').width,
                        backgroundColor: index % 2 == 0 ? '#FFFFFF' : '#E8F6FC',
                        marginVertical: wp(1),
                    }}>
                    <ListItem
                        noBorder
                        style={{ marginBottom: wp(2) }}
                        avatar
                    >
                        <TouchableOpacity style={styles.Pressed}
                        onPress={()=>
                        {
                            closeModal()
                
                            if (item.user_id!==user_Id) {
                                navigation.navigate({
                                    routeName: 'Profile',
                                    key: 'Profile',
                                    params: {user_id: item.user_id},
                                  })
                            } 
                            else{
                                navigation.navigate({
                                    routeName:'UserProfile',
                                    key:'Profile',
                                    params:{user_id:item.user_id}
                            
                            });
                            }
                        }}
                        >
                        <Left style={{ justifyContent: 'center',  }}>
                            <Image
                                style={styles.imgStyle}
                                source={{ uri: item?.avatar }}
                            />
                        </Left>
                        <Body>
                            <Text style={styles.eNameText} numberOfLines={1} note>
                                {item?.full_name}
                            </Text>

                        </Body>
                        </TouchableOpacity>
                        {
                            item?.user_id == isOwnGroup ?
                                null
                                :
                                <Right style={styles.rightView}>

                                    <TouchableOpacity
                                        onPress={() => {makeAdmin(item?.user_id, item?.is_admin, index)}}
                                        style={
                                            item.is_admin == true ?
                                            [styles.adminBtn, { backgroundColor: '#c6c6c7' }]:styles.adminBtn
                                        }>

                                        {
                                            item.is_admin == true ?
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Revoke</Text>
                                                :
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Admin</Text>
                                        }

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => deleteMember(item?.user_id, index)}
                                        style={styles.removeBtn}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                                    </TouchableOpacity>

                                </Right>
                        }
                    </ListItem>
                </View>
            </View>

        );

    };

    return (

        <Overlay
            animationType='fade'
            useNativeDriver
            animationInTiming={700}
            animationOutTiming={1000}
            isVisible={showModal ? showModal : false}
            overlayStyle={styles.modal}
        >
            <Text style={styles.heading}>Community Members</Text>
            <TouchableOpacity
                onPress={props.closeModal}
                style={{ paddingHorizontal: wp(2), position: 'absolute', top: 0, right: 5 }}
            >
                <Icon
                    name={'cross'}
                    type="Entypo"
                    style={styles.tagIcon}
                />
            </TouchableOpacity>
            {members?.length > 0 ?
                <View style={{ marginTop: wp(6) }}>
                    <FlatList
                        disableVirtualization={true}
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                        horizontal={false}
                        data={members}
                        renderItem={renderMember}
                        style={{ marginVertical: RFValue(5), backgroundColor: BGCOLOR }}
                    />
                </View> :
                <Text
                    style={{
                        marginTop: 20, width: '100%', textAlign: 'center',
                        fontSize: RFValue(16), color: darkSky,
                        fontWeight: 'bold'
                    }}>
                   No Community Member</Text>}
        </Overlay>

    )

}

export default MemberModal;

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        // flex: 1,
        width: '80%',
        height: '80%',
        alignSelf: 'center',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        top: '10%',
        paddingBottom: wp(Platform.OS == 'ios' ? 20 : 10)
    },
    Pressed:{
        
            flexDirection:'row',
            ...Platform.select({
                ios:{
                    width:wp(60)
                },
                android:{
                    width:wp(55)
                }
            }),
            // width:Platform.OS === 'IOS' ? wp(45) : wp(60),
            justifyContent:'center',
            alignItems:'center'
    
    },
    imgStyle: {
        alignSelf: 'center',
        backgroundColor: 'black',
        width: RFValue(45),
        height: RFValue(45),
        borderRadius: 10,
    },
    eNameText: {
        fontSize: RFValue(14),
        fontWeight: 'bold',
        color: 'black',
        fontFamily: THEME_FONT,
    },
    eContentText: {
        fontSize: RFValue(14),
        fontFamily: THEME_FONT,
        color: 'black',
        fontWeight: '500',

    },
    heading:{
        position: 'absolute',
        top: 6,
        fontSize: RFValue(14),
        fontWeight: 'bold',
        color: BLUE,
      },
    tagIcon: {
        fontSize: RFValue(22),
        color: '#222326',
        marginTop: wp(1),
        color:BLUE

    },
    addBtn: {
        width: wp(23),
        height: wp(8),
        backgroundColor: darkSky,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    adminBtn: {
        height: 30,
        width: 55,
        borderRadius: 8,
        // backgroundColor:'#FD672A',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f47d8a',
    },
    removeBtn: {
        height: 30,
        width: 55,
        borderRadius: 8,
        backgroundColor: '#20ace2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    textColor: {
        color: 'white',
        fontWeight: 'bold',
        alignItems: 'center',
    },
    rightView: {
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150
    }

})