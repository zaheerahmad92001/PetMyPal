import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { BG_DARK, HEADER, TEXT_LIGHT, } from '../../constants/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SERVER, server_key } from '../../constants/server';
import {
    Icon
} from 'native-base';
import requestRoutes from '../../utils/requestRoutes.json';

import { connect } from 'react-redux';

import PMP from '../../lib/model/pmp';
import { RFValue } from 'react-native-responsive-fontsize';

const window = Dimensions.get('window');
export class MyPetsPanel extends React.Component {

    closeRNBS=()=>{
    this.props.parentCallback()
    }

    render() {
        const {  mypets, navigation, upAndDown , parentCallback } = this.props
        return (
            <View >
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 8, marginHorizontal: wp(6) }}>

                    <Icon type={'AntDesign'} name={'up'} style={{ fontSize: 24, color: 'white' }} />
                    <Text style={{ fontWeight: '700', fontSize: 20 }}>My Pets</Text>
                    {/* <Icon onPress={() => OnPressUpDown()} type={'Entypo'} name={upAndDown ?  'chevron-thin-down':'chevron-thin-up'} style={{ fontSize: 24}} /> */}
                    <Icon type={'AntDesign'} name={'up'} style={{ fontSize: 24, color: 'white' }} />

                </View>
                <View style={styles.optionContainer}>
                    {mypets?.length > 0 ? mypets.map((item, i) => {
                        if(item?.avatar){

                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate({
                                        routeName: 'PetProfile',
                                        key: 'PetProfile',
                                        params: { item, changePet:true },
                                    });
                                    this.closeRNBS()
                                }}
                                style={styles.option} key={i}>
                                <View
                                    style={
                                        {
                                            width: wp(19),
                                            height: hp(13),
                                            borderColor:item.deceased== 1 ?'black' : item.disabled==1?"orange":null,
                                            borderWidth:(item.deceased== 1||item.disabled==1) ? 3: null,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                            borderRadius: 10,
                                            
                                        }
                                    }>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            resizeMode: 'cover',
                                        }}
                                        source={{ uri: item?.avatar }}
                                    />
                                </View>
                                <Text 
                                numberOfLines={1}
                                style={{ fontWeight: 'bold' , width:RFValue(70), textAlign:'center'}}>{item.first_name}</Text>
                            </TouchableOpacity>
                        );
                                    }
                    }) :
                        <View style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 8 }}>

                            <Text style={{ fontWeight: '700' }}>No Pets Found</Text>
                        </View>
                    }
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    choosePetContainer: {
        width: window.width * 0.8,
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 0,
    },
    optionContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    option: {
        // width: wp(50),
        // height: hp(15),
        marginHorizontal: wp(2),
        marginVertical: hp(1),
        // marginBottom: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    petOption: {
        width: window.width * 0.8 * 0.25 * 0.8,
        height: window.width * 0.8 * 0.25 * 0.8,
        backgroundColor: BG_DARK,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    petName: {
        color: '#000',
    },
    selectedOption: {
        backgroundColor: HEADER,
    },
    petImage: {
        width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
        height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
        resizeMode: 'contain',
        // tintColor: 'white',
    },
    extraMargin: {
        marginBottom: 10,
    },
    basicDetailsForm: {
        width: window.width * 0.8,
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 16,
    },
    chosenPet: {
        justifyContent: 'space-around',
        marginVertical: 10,
        // flexDirection: 'row',
        alignItems: 'center',
    },
    pet: {},
    petOption: {
        width: window.width * 0.8 * 0.25 * 0.8,
        height: window.width * 0.8 * 0.25 * 0.8,
        backgroundColor: BG_DARK,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    petName: {
        color: TEXT_LIGHT,
        alignSelf: 'center',
    },
    petImage: {
        width: window.width * 0.8 * 0.25 * 0.8 * 0.65,
        height: window.width * 0.8 * 0.25 * 0.8 * 0.65,
        resizeMode: 'contain',
        tintColor: 'white',
    },
    changePetText: {
        fontSize: 16,
        color: TEXT_LIGHT,
        textDecorationLine: 'underline',
        textDecorationColor: TEXT_LIGHT,
    },
});
const mapStateToProps = state => {
    return ({
        mypets: state.mypets ? state.mypets.pets : []
    })
}
export default connect(
    mapStateToProps
)(MyPetsPanel);
