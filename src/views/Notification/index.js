import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Icon as Iconn } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import {darkGrey, darkSky, TEXT_DARK} from '../../constants/colors';
import {petMyPalApiService} from '../../services/PetMyPalApiService';
import ErrorModal from '../../components/common/ErrorModal';
const {saveNotificationSettings,petOwnerData} =petMyPalApiService;
import UserProfile from '../../components/common/userProfile';
import CustomLoader from '../../components/common/CustomLoader';
import { RFValue } from 'react-native-responsive-fontsize';
import PMPHeader from '../../components/common/PMPHeader'


class Notification extends React.Component {
    constructor(props){
        super(props);
        const{e_liked,e_commented,e_shared,e_followed,e_liked_page,e_visited,e_mentioned,e_joined_group,e_accepted,e_profile_wall_post,e_pet_qr_scan}=JSON.parse(this.props?.user?.notification_settings);
       
                this.state = {
                    data: [
                        { status: e_liked ?? 0, label: 'Someone liked my posts', value: 'e_liked' },
                        { status: e_commented ?? 0, label: 'Someone commented on my posts', value: 'e_commented' },
                        { status:e_shared ?? 0, label: 'Someone shared my posts ', value: 'e_shared' },
                        { status:e_followed ?? 0, label: 'Someone followed me', value: 'e_followed' },
                        // { status: e_liked_page?? 1, label: 'Someone liked my pages', value: 'e_liked_page' },
                        // { status: e_visited ?? 0, label: 'Someone visited my profile', value: 'e_visited' },
                        { status: e_mentioned ?? 0, label: 'Someone mentioned me', value: 'e_mentioned' },
                        { status: e_joined_group ?? 1, label: 'Someone joined my communities', value: 'e_joined_group' },
                        { status: e_accepted ?? 0, label: 'Someone accepted my friend/follow request', value: 'e_accepted' },
                        { status: e_profile_wall_post ?? 0, label: 'Someone posted on my timeline', value: 'e_profile_wall_post' },
                        { status: e_pet_qr_scan ?? 0, label: 'Someone scan my pet QR', value: 'e_pet_qr_scan'}


                    ],
                    token:null,
                    showModal:false,
                    sending:false,
                }
}
componentDidMount(){
    this.accessToken();
   
}
accessToken=async()=>{
    const access_token = await AsyncStorage.getItem('access_token');
 
   let token =JSON.parse(access_token).access_token;
   this.setState({token})
}
    handleSave(check){

        this.setState({sending:true})

        const formData=new FormData();
        formData.append('s',this.state.token);
        formData.append('type','update_notifications_settings');
        formData.append('user_id',this.props.user?.user_id)
    this.state.data.map(item=>{
            formData.append(item.value,item.status);
        })

        this.props.saveNotificationSettings(formData).then(res=>{
            if(res?.data?.api_status==200){
                this.props.petOwnerData(this.state.token,this.props.user?.user_id);
                this.setState({showModal:true , sending:false});
                if(check==1){
                    setTimeout(()=>{
                        // this.setState({showModal:false});
                        this.props.navigation.goBack();

                    },2000)
                   
                }
                // this.setState({showModal:false});

            }
        }).catch(e=>console.log(e))


    }
    handleChange(value, i) {
        var newData = [...this.state.data];
         newData[i].status = value==false?0:1;
        this.setState({ data: newData })
       

    }

    closeErrorModal =()=>{
        this.setState({showModal: false},()=>this.props.navigation.goBack())
      }

    render() {

    const {showModal , sending} = this.state
    
        return (
            <Container>
                <SafeAreaView />

                {/* <View style={{ paddingHorizontal: wp(5), width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                    <Iconn
                        onPress={() => this.props.navigation.goBack()}
                        name={'ios-chevron-back'}
                        type={'Ionicons'}
                        style={{color:darkSky}}
                        
                    />
                    <Text style={styles.headerText}> Notification Settings </Text>
                </View> */}

                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.props.navigation.goBack()}
                    centerText={'Notification Settings'}
                    longWidth={true}
                />

                <ScrollView showsVerticalScrollIndicator={false}> 
                    <UserProfile user={this.props?.user} top={80} />
                    <Text style={styles.mainTile}>Notify me when</Text>
                    <View style={{ width: '100%', paddingHorizontal: wp(5), marginTop:wp(0),marginBottom:wp(10) }}>
                        {this.state?.data?.map((item, i) => {
                            return (
                                <View key={i} style={styles.childBoxContainer}>

                                    <CheckBox
                                        style={styles.customStyle}
                                        boxType='square'
                                        disabled={false}
                                        value={item.status==0?false:true}
                                        onValueChange={(value) => this.handleChange(value, i)}
                                        onFillColor={darkSky}
                                        onCheckColor={'white'}
                                        onTintColor={darkSky}
                                        tintColors={{ true: darkSky, false: '#bebebe' }}
                                        
                                    />
                                    <Text style={styles.text}>{item.label}</Text>

                                </View>

                            )
                        })}

                    </View>
                    <View style={styles.btnContainer}>
                        
                        {sending ? 
                         <CustomLoader
                          
                         />  : 
                       <TouchableOpacity onPress={()=>this.handleSave(0)} style={styles.btn}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                      }

                    </View>

                </ScrollView>
                <ErrorModal
                    isVisible={showModal}
                    onBackButtonPress={() => this.closeErrorModal()}
                    info={'Settings Updated Successfully.'}
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
    mainTile: {
        flexGrow: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: darkSky,
        marginTop: wp(5)
    },
    checkBoxContainer: {
        height: '100%',
        paddingHorizontal: wp(3),
        paddingVertical: wp(3)
    },
    childBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: wp(3)

    },
    text: {
        color: TEXT_DARK,
        marginLeft: wp(3),
        fontSize: wp(4)
    },
    customStyle: {
        width: 22,
        height: 22,
        padding: 2,
    

    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent:'center',

        marginBottom:wp(20)
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
        maxHeight:80,
        width:300,
        alignSelf:'center',
        top:'40%',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
      },
      alertText:{
          fontSize:wp(4),
          color:'green',
       
      }


})

const mapStateToProps=(state)=>{
    return{
       user:state.user?.user?.user_data

    }
}

export default connect(mapStateToProps,{saveNotificationSettings,petOwnerData}) (Notification);