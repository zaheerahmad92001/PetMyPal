import React, { Component } from "react";
import { View, Text, Image, ScrollView, FlatList, } from 'react-native'
import { Content, Container, Icon, Thumbnail } from "native-base";
import PMPHeader from '../../components/common/PMPHeader'
import { deactivate } from '../../constants/ConstantValues'
import { Divider } from "react-native-elements";
import Label from '../../components/common/Label';
import styles from './styles'
import { TouchableOpacity } from "react-native";
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import { connect } from 'react-redux';
import CustomLoader from "../../components/common/CustomLoader";
import SkyBlueBtn from "../../components/common/SkyblueBtn";
import WhiteBtn from "../../components/common/WhiteBtn";
import { black, darkSky, White } from "../../constants/colors";
import IntlPhoneInput from 'react-native-intl-phone-input';
import TextField from '../../components/common/TextField';
import { Platform } from "react-native";
import ErrorMsg from '../../components/common/ErrorMsg';
import { Capitalize, validate } from "../../utils/RandomFuncs";
import ErrorModal from '../../components/common/ErrorModal';

import { heightPercentageToDP as hp , widthPercentageToDP as wp} from "react-native-responsive-screen";



class AccountRecovery extends Component {
    modal = React.createRef();

    constructor(props) {
        super(props)

        this.state = {
            smsBtnSelected: false,
            emailBtnSelected: false,
            token:'',
            userId:'',
            phError: false,
            maskedNumber: '',
            setDefaultValue: false,
            error: '',
            email: "",
            cca2: 'US',
            callingCode: '1',
            contact: '',
            sending: false,
            email: '',
            emailError: false,
            showErrorModal:false,
            changeNum:true

        }
    }

    componentDidMount() {
        var curr_date = new Date()
        var currentDate = moment.utc(curr_date).local().format('DD-MM-YYYY')

        var myDate = new Date(new Date().getTime() + (90 * 24 * 60 * 60 * 1000));
        var after_90_Days = moment.utc(myDate).local().format('DD-MM-YYYY')

        this.setState({
            deactivation_Date: currentDate,
            removal_Date: after_90_Days
        })

        this.getAccessToken().then(async (TOKEN) => {
            console.log('token ',TOKEN)
            this.setState({
                token: JSON.parse(TOKEN).access_token,
                userId:JSON.parse(TOKEN).user_id
            });

        });

    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    goBack = () => { 
        // this.props.navigation.pop()
      this.props.navigation.navigate('AuthView')

     }

    verifyBySMS = () => {
        this.setState({
            smsBtnSelected: true,
            emailBtnSelected: false,
            error:'',
            sending:false,
        })
    }
    verifyByEmail = () => {
        this.setState({
            smsBtnSelected: false,
            emailBtnSelected: true,
            phError:false,
            error:'',
            sending:false,
            emailError:false,
        })
    }

    handleContactChange = (value) => {
        this.setState({
            contact: value.unmaskedPhoneNumber,
            maskedNumber: value.phoneNumber,
            phError: !value.isVerified,
            error: "",
            setDefaultValue: false,  //importan 
            cca2: value.selectedCountry.code,
            callingCode: value.selectedCountry.dialCode,
            email: "",
        })

    }

    closeErrorModal =()=>{
        this.setState({showErrorModal: false})
      }

    send_Actiation_code = async (source) => {
        const { 
            callingCode, 
            contact, 
            cca2, 
            email, 
            phError ,
            token ,
            userId,
            maskedNumber,
            changeNum
         } = this.state;

         let userData={
            contact , 
            cca2,
            callingCode,
            maskedNumber,
            user_id: userId,
            token:token,
            changeNum:false
          }

        /*************** sms logic  **************/

        if (source === 'sms') {
            if (contact.trim().length > 0) {
                if (phError) {
                    this.setState({
                        error: 'Invalid Phone number'
                    })
                }
                else {
                    this.setState({ sending: true, error: '', });
                    const formData = new FormData();
                    formData.append('server_key', server_key);
                    formData.append('phone_number', callingCode + contact);
                    formData.append('user_id' , userId)

                 const response = await petMyPalApiService.recover_account(token ,formData).catch((err)=>{
                     console.log('error while sending activation code ', err)
                 })
                const {data} = response
                if(data.status === 200){
                    // console.log('success activation code' , data)
                    this.setState({sending:false},()=> this.props.navigation.navigate('ActivateAccountByPhone',{
                        userData
                    }))

                }else{
                    this.setState({
                        sending:false,
                        errMsg:Capitalize(data.errors),
                        showErrorModal:true,

                    })
                    console.log('error code' , data)
                }
             }
            } else {
                this.setState({ error: 'Please enter phone number.' });
            }
        }
        /*************** Email logic  **************/
        else if (source === 'email') {
            let error = false
            let validateEmail = validate(email)
            if (!validateEmail) {
                error = true
                this.setState({ emailError: true })
            } else {
                this.setState({ sending: true })
                const formData = new FormData()
                formData.append('server_key', server_key);
                formData.append('email', email.toLocaleLowerCase())
                formData.append('user_id' , userId)

                const response = await petMyPalApiService.recover_account(token ,formData).catch((err)=>{
                    console.log('error while sending activation code ', err)
                })

                const { data } = response
                // console.log('activation code', data)
                if (data.status === 200) {
                    console.log('email code ', data, 'code', data.code)
                    this.setState({
                        sending: false,
                    },() => this.props.navigation.navigate('ActivateAccountByEmail', {
                        email,
                        emailCode: data.code,
                        user_id : userId ,
                    })
                    );

                } else {
                    this.setState({
                        // isModal_Visible: true,
                        // error: Capitalize(data.errors.error_text),
                        sending: false,
                        showErrorModal:true,
                        errMsg:Capitalize(data.errors),

                    })
                }
            }

        }

    }

    render() {
        const {
            emailBtnSelected,
            smsBtnSelected,
            cca2,
            sending,
            emailError,
            email,
            error,
            phError,
            showErrorModal,
            errMsg,
        } = this.state

        return (
            <Container>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()} 
                    longWidth={true}
                    headerStyle={{ backgroundColor: darkSky }}
                    backArrowColor={{ color: black }}
                />
                <Content>
                    <View style={styles.darkView}></View>
                    <View style={styles.maintainer}>
                    <View style={styles.imgView}>
                        <Image
                            source={deactivate}
                            resizeMode={'contain'}
                        />
                    </View>
                  
                <View style={styles.container}>
                        <View style={styles.innerView}>
                            <Text style={styles.bigText}>Oops, looks like your account </Text>
                            <Text style={styles.bigText}>is not activated yet.</Text>

                            <Text style={[styles.smallText, { marginTop: 15 }]}>Please choose a method below to</Text>
                            <Text style={styles.smallText}>activate your account.</Text>

                            <View style={styles.infoView}>
                                <View style={styles.btnView}>
                                    <WhiteBtn
                                        title={"Recover by Email"}
                                        onPress={() => this.verifyByEmail()}
                                        btnContainerStyle={emailBtnSelected ? [styles.verifyBySMSBtnSelected] : [styles.verifyBySMSBtn]}
                                        titleStyle={emailBtnSelected ? [styles.titleStyle] : null}
                                    />
                                    <WhiteBtn
                                        title={"Recover by SMS"}
                                        onPress={() => this.verifyBySMS()}
                                        btnContainerStyle={smsBtnSelected ? [styles.verifyBySMSBtnSelected] : [styles.verifyBySMSBtn]}
                                        titleStyle={smsBtnSelected ? [styles.titleStyle] : null}
                                    />
                                </View>
                                <View style={styles.phoneView}>

                                    {smsBtnSelected &&
                                        <View>
                                            <Label text={"Phone Number"} 
                                             error ={phError || error}
                                            />
                                            <IntlPhoneInput
                                                defaultCountry={cca2}
                                                flagStyle={{
                                                    fontSize: Platform.OS == 'android' ? 15 : 25 ,
                                                    marginLeft:-10,
                                                }}
                                                onChangeText={(c) => this.handleContactChange(c)}
                                                // containerStyle={[styles.intlPhoneInputStyle]}
                                            />
                                            <Divider 
                                              style={phError || error ? [styles.intlPhoneInputStyle_err] : [styles.intlPhoneInputStyle]}
                                            />
                                             {error ?
                                                <View style={{ marginTop: 10 }}>
                                                    <ErrorMsg
                                                        errorMsg={error}
                                                    />
                                                </View> : null
                                            }
                                            {sending ?
                                                <View style={{ marginTop: hp(5) }}>
                                                    <CustomLoader />
                                                </View>
                                                :
                                                <SkyBlueBtn
                                                    title={'Send Confirmation'}
                                                    onPress={() => this.send_Actiation_code('sms')}
                                                    btnContainerStyle={styles.buttonContainer}
                                                />
                                            }
                                        </View>
                                    }

                                    {emailBtnSelected &&
                                        <View>
                                            <TextField
                                                label={"Your Email"}
                                                placeholder={'Enter Your Email'}
                                                value={email}
                                                error={emailError}
                                                onChangeText={(text) => this.setState({
                                                    email: text,
                                                    emailError: false,
                                                    error: '',
                                                })}
                                            />

                                            {emailError ?
                                                <View style={{ marginTop: 10 }}>
                                                    <ErrorMsg
                                                        errorMsg={'Please enter email address.'}
                                                    />
                                                </View> : null
                                            }

                                            {sending ?
                                                <View style={{ marginTop: hp(5) }}>
                                                    <CustomLoader />
                                                </View>
                                                :
                                                <SkyBlueBtn
                                                    title={'Send Confirmation'}
                                                    onPress={() => this.send_Actiation_code('email')}
                                                    btnContainerStyle={styles.buttonContainer}
                                                />
                                            }

                                        </View>
                                    }



                                </View>
                            </View>

                        </View>
                    </View>

                    </View>
    
                </Content>
                <ErrorModal
                 isVisible={showErrorModal}
                 onBackButtonPress={() => this.closeErrorModal()}
                 info={errMsg}
                 heading={'Hoot!'}
                 onPress={() => this.closeErrorModal()}
            />
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return { user: state.user }
};
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AccountRecovery);
