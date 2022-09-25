import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { BLUE_NEW } from '../../constants/colors';
import styles from './styles';
import { COVER, AVATAR } from '../../components/helpers';
import LoaderWrapper from '../../components/helpers/LoaderWrapper';
import CustomLoader from '../../components/common/CustomLoader';


export default function ExistingGroup(props) {

    const { group, avatarImage, coverImage, loader } = props.group;

    function handleImageStatus(type) {

        if (type == COVER) {
            return coverImage?.uri ?? group?.cover
        }
        else {
            return avatarImage?.uri ?? group?.avatar
        }
    }

    return (
        <>

            <Image source={{ uri: "" + handleImageStatus(COVER) }} style={styles.coverImg} />

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                <View
                    style={styles.existingGroupcontainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', marginTop: hp(-2) }}>
                            <View
                                style={{
                                    marginRight: 20,
                                    width: RFValue(35),
                                    height: RFValue(35),
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: wp(4) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    overflow: 'hidden',
                                    borderRadius: 10,
                                }}>
                                <Image
                                    style={styles.profileImg}
                                    source={{ uri: "" + handleImageStatus(AVATAR) }}
                                />
                            </View>
                            <View style={{ marginLeft: wp(3) }}>
                                <Text
                                    style={{
                                        color: '#182A53',
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        width: wp(50)

                                    }}>
                                    {group?.group_title}
                                </Text>
                                <Text style={{ color: '#8B94A9', marginTop: wp(1) }}>
                                    Members:{' '}{group?.members ?? '1'}
                                </Text>
                            </View>
                        </View>
                        {loader ? <LoaderWrapper style={{ position: 'relative', marginVertical: wp(5) }}><CustomLoader /></LoaderWrapper> :
                            <View
                                style={{
                                    marginVertical: wp(4),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            flex: 7,
                                            justifyContent: 'center',
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                            <TouchableOpacity
                                                onPress={() => { props.updateGroup('update-group-data') }}
                                                style={{
                                                    flexDirection: 'row',
                                                    width: wp(35),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: wp(10),
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    borderColor: BLUE_NEW,

                                                }}>
                                                <Text style={{ fontWeight: '700', fontSize: 12, color: BLUE_NEW }}>
                                                    {group?.newGroup ? 'Create' : 'Save'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            flex: 7,
                                            justifyContent: 'center',
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                            <TouchableOpacity
                                                onPress={() => props.showDeleteModal()}
                                                style={{
                                                    backgroundColor: '#E42222',
                                                    flexDirection: 'row',
                                                    width: wp(35),
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: wp(10),
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    borderColor: 'red',

                                                }}>
                                                <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                                                    Delete Community
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </View>


        </>
    )

}


