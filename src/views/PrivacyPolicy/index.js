import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather'
import { Container, Icon as Iconn } from 'native-base';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import { DARK_THEME } from 'react-native-country-picker-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';

import { TEXT_DARK, darkSky } from '../../constants/colors';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
const { savePrivacySettings, petOwnerData } = petMyPalApiService;
import UserProfile from '../../components/common/userProfile';
import CustomLoader from '../../components/common/CustomLoader';
import ErrorModal from '../../components/common/ErrorModal';
import PMPHeader from '../../components/common/PMPHeader'





class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        const { follow_privacy, message_privacy, friend_privacy, post_privacy, birth_privacy, confirm_followers, visit_privacy, show_activities_privacy, status, share_my_location, share_my_data } = this.props?.user ?? {};
        this.state = {
            data: [{
                open: false,
                selectedValue: follow_privacy,
                value: 'follow_privacy',
                label: 'Who can follow me?',
                items: [
                    { label: 'Everyone', value: '0' },
                    { label: 'People I Follow', value: '1' },

                ]
            },
            {
                open: false,
                selectedValue: message_privacy,
                value: 'message_privacy',
                label: 'Who can message me?',
                items: [
                    { label: 'Everyone', value: '0' },
                    { label: 'People I Follow', value: '1' },
                    { label: 'Nobody', value: '2' }
                ]
            },
            {
                open: false,
                selectedValue: friend_privacy,
                value: 'friend_privacy',
                label: 'Who can see my followers?',
                items: [
                    { label: 'Everyone', value: '0' },
                    { label: 'People I Follow', value: '1' },
                    { label: 'People Follow Me', value: '2' },
                    { label: 'Nobody', value: '3' }
                ]
            },
            {
                open: false,
                selectedValue: post_privacy,
                value: 'post_privacy',
                label: 'Who can post on my timeline?',
                items: [
                    { label: 'Everyone', value: 'everyone' },
                    { label: 'People I Follow', value: 'ifollow' },
                    { label: 'Nobody', value: 'nobody' }
                ]
            },
            {
                open: false,
                selectedValue: birth_privacy,
                value: 'birth_privacy',
                label: 'Who can see my birthday?',
                items: [
                    { label: 'Everyone', value: '0' },
                    { label: 'People I Follow', value: '1' },
                    { label: 'Nobody', value: '2' }
                ]
            },
            {
                open: false,
                selectedValue: confirm_followers,
                value: 'confirm_followers',
                label: 'Confirm request when some follow you?',
                items: [
                    { label: 'Yes', value: '1' },
                    { label: 'No', value: '0' }
                ]
            },
            {
                open: false,
                selectedValue: visit_privacy,
                value: 'visit_privacy',
                label: 'Send users a notification when i visit there profile?',
                items: [
                    { label: 'Yes', value: '1' },
                    { label: 'No', value: '0' }
                ]
            },
            {
                open: false,
                selectedValue: show_activities_privacy,
                value: 'show_activities_privacy',
                label: 'Show my activities?',
                items: [
                    { label: 'Yes', value: '1' },
                    { label: 'No', value: '0' }
                ]
            },
            {
                open: false,
                selectedValue: status,
                value: 'status',
                label: 'Status?',
                items: [
                    { label: 'Online', value: '1' },
                    { label: 'Offline', value: '0' }
                ]
            },
            {
                open: false,
                selectedValue: share_my_location,
                value: 'share_my_location',
                label: 'Share my location with public?',
                items: [
                    { label: 'yes', value: '1' },
                    { label: 'No', value: '0' }
                ]
            },
            {
                open: false,
                selectedValue: share_my_data,
                value: 'share_my_data',
                label: 'Allow search engines to index my profile and posts?',
                items: [
                    { label: 'yes', value: '1' },
                    { label: 'No', value: '0' }
                ]
            }
            ],
            token:null,
            showModal:false,
            sending:false,

        }
    }
    componentDidMount() {
        this.accessToken();

    }
    accessToken = async () => {
        const access_token = await AsyncStorage.getItem('access_token');

        let token = JSON.parse(access_token).access_token;
        this.setState({ token })
    }
    handleSave = () => {
        this.setState({sending:true})
        const formData = new FormData();
        formData.append('s', this.state.token);
        formData.append('type', 'privacy_settings');
        formData.append('user_id', this.props.user?.user_id)
        this.state.data.map(item => {
            formData.append(item.value, item.selectedValue);
        })
        //formData.append("e_wondered",0);
        this.props.savePrivacySettings(formData).then(res => {

            if (res?.data?.api_status == 200) {
                this.props.petOwnerData(this.state.token, this.props.user?.user_id);
                this.setState({ showModal: true,sending:false });
            

            }
        }).catch(e => console.log(e))


    }
    setOpen(open, i) {
        var newData = [...this.state.data];
        newData[i].open = open;
        this.setState({
            data: newData
        });
    }

    setValue(callback, i) {
        var newData = [...this.state.data];
        newData[i].selectedValue = callback();
        this.setState({
            data: newData
        });
    }

    setItems(callback, i) {
        //TODO not sure about this function functionality

        this.setState(state => ({
            items: callback(state.items)
        }));
    }

    closeErrorModal =()=>{
        
        this.setState({showModal: false},()=>this.props.navigation.goBack())
      }



    render() {

        return (
            <Container>
                <SafeAreaView />
                {/* <Modal animationIn="fadeInLeft" animationOut="fadeOutLeft" useNativeDriver animationInTiming={1000} animationOutTiming={1500} isVisible={this.state.showModal} style={styles.modal}>
                    <Text style={styles.alertText}>Settings updated successfully.</Text>
                </Modal> */}

                {/* <View style={{ paddingHorizontal: wp(5), width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                    <Iconn
                        onPress={() => this.props.navigation.goBack()}
                        name={'ios-chevron-back'}
                        type={'Ionicons'}
                        style={{ color: darkSky }}
                    />
                    <Text style={styles.headerText}> Privacy Settings </Text>
                </View> */}

                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.props.navigation.goBack()}
                    centerText={'Privacy Settings'}
                    longWidth={true}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <UserProfile user={this.props?.user} top={80} />
                    <View style={{ width: '100%', paddingHorizontal: wp(6), marginTop: wp(0), marginBottom: wp(10) }}>
                        {this.state?.data?.map((item, i) => (
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:'100%'}} key={i} >
                                <Text style={{ marginTop: 40, color: DARK_THEME, fontWeight: '500',width:'64%',fontSize:RFValue(13),marginRight:wp(1) }}>{item.label}</Text>
                                <DropDownPicker
                                    containerStyle={{ width:'35%', height: item.open ? item.items.length == 2 ? item.items.length * 60 : item.items.length == 4 ? item.items.length * 40 : item.items.length * 30 : 50, marginBottom: item?.open ? (item.items.length == 4 ? 20 : item.items.length == 2 ? 0 : 50) : 'auto' }}
                                    textStyle={{ color: TEXT_DARK,fontSize:RFValue(10) }}
                                    selectedItemContainerStyle={{ backgroundColor:darkSky, }}
                                    selectedItemLabelStyle={{ color: 'white' }}
                                    dropDownContainerStyle={{ borderColor: TEXT_DARK }}
                                    open={item.open}
                                    value={item.selectedValue}
                                    items={item.items}
                                    setOpen={(data) => this.setOpen(data, i)}
                                    setValue={(data) => this.setValue(data, i)}
                                    setItems={(data) => this.setItems(data, i)}
                                    style={{ marginVertical: wp(7), borderColor: TEXT_DARK,height: 28 ,maxHeight:40 }}
                                    
                                />

                            </View>

                        ))}

                    </View>
                    <View style={styles.btnContainer}>
                        
                    {this.state.sending ? 
                         <CustomLoader
                        //   loaderContainer={{left:-60}}
                         />  :
                        <TouchableOpacity onPress={()=>this.handleSave()} style={styles.btn}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                 }

                    </View>
                </ScrollView>

                <ErrorModal
                    isVisible={this.state.showModal}
                    onBackButtonPress={() => this.closeErrorModal()}
                    info={'Settings Updated Successfully'}
                    heading={'Hoot!'}
                    onPress={() => this.closeErrorModal()}
             />

            </Container>
        )
    }
}
const styles = StyleSheet.create({
    headerText: {
        color: darkSky,
        fontSize: 20,
        fontWeight: 'bold',
        flexGrow: 1,
        textAlign: 'center',
        paddingRight: wp(8)

    },
    btnContainer: {
        flexDirection: 'row',
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: wp(5),
        marginBottom: wp(10),
        justifyContent:'center'
    },
    btn: {
        width: wp(80),
        height: 42,
        borderRadius: RFValue(13),
        backgroundColor: darkSky,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

    },
    modal: {
        backgroundColor: 'white',
        maxHeight: 80,
        width: 300,
        alignSelf: 'center',
        top: '40%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertText: {
        fontSize: wp(4),
        color: 'green',

    }
});
const mapStateToProps = (state) => {
    return {
        user: state.user?.user?.user_data

    }
}

export default connect(mapStateToProps, { savePrivacySettings, petOwnerData })(PrivacyPolicy);


