import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Icon, Container, Content } from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

import PMPHeader from '../../components/common/PMPHeader'
import { SERVER, server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import SkyBlueBtn from '../../components/common/SkyblueBtn'
import { contactUsBg, inquiryAbout, inq_about_list } from '../../constants/ConstantValues'
import Label from '../../components/common/Label';
import BreedPicker from '../../components/common/BreedPicker'
import TextField from '../../components/common/TextField';
import styles from './styles'
import { DANGER, darkSky, grey, TEXT_INPUT_LABEL } from '../../constants/colors';
import { validate } from '../../utils/RandomFuncs';
import InfoModal from '../../components/common/InfoModal';
import ErrorModal from '../../components/common/ErrorModal';
import CustomLoader from '../../components/common/CustomLoader'
import _DropDown from '../../components/common/dropDown';
import {Divider}from 'react-native-elements'

class ContactUs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            Sending: false,
            
            inquiry: '',
            inqError: false,
            inquiry_id: '',
            searchValue: '',
            loading: false,
            isVisible: false,
            fname: '',
            lname: '',
            fname_err: false,
            lname_err: false,
            email: '',
            email_err: false,
            message: '',
            msg_err: '',
            isModal_Visible: false,
            passPolicy: false,
            infoText: '',
            isErrorModal_Visible: false,
            errorMessage: '',
            PlaceholderColor:true,



        }
    }

    componentDidMount() {

        this.getAccessToken().then(async (TOKEN) => {
            this.setState({ token: JSON.parse(TOKEN).access_token });
        });
    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }
    goBack = () => { this.props.navigation.pop() }
     email = () => {
       
         Linking.openURL('mailto:info@petmypal.com') 
        //  title="support@example.com"
      }

    // handle_Inq_Selection = (item) => {

    //     var FOUND = inquiryAbout.find(function (post, index) {
    //         if (post.inq_text == item)
    //             return post;
    //     });

    //     this.setState({
    //         inquiry: item,
    //         inquiry_id: FOUND.id,
    //         searchValue: '', // if user again open modal will see all breed again
    //         inqError: false,
    //         isVisible: false
    //     })
    // }

    
    // on_Inq_ValueChange = (value) => {
    //     this.setState({
    //         inquiry: value,
    //         inqError: false,
    //         searchValue: value // will do empity once user select its value
    //     })
    // }

    hideShow_Dropdown = () => {
        const { isVisible } = this.state
        this.setState({
            isVisible: !isVisible
        })
    }

    closeModal = () => {
        this.setState({ isModal_Visible: false })
    }
    closeErrorModal = () => {
        this.setState({ isErrorModal_Visible: false })
    }


    sendMsg = async () => {
        let err = false
        const {
            inquiry,
            inquiry_id,
            fname,
            lname,
            email,
            message,
            token
        } = this.state

        if (!inquiry) {
            this.setState({ inqError: true })
            err = true
        }
        if (!fname) {
            this.setState({ fname_err: true })
            err = true
        }
        if (!lname) {
            this.setState({ lname_err: true })
            err = true
        }
        if (!email || !validate(email)) {
            this.setState({ email_err: true, })
            err = true
        }
        if (!message) {
            this.setState({ msg_err: true })
            err = true
        }

        if (!err) {
            this.setState({ Sending: true })
            let formData = new FormData()
            formData.append('server_key', server_key);
            formData.append('inquiry_about', inquiry_id)
            formData.append('first_name', fname)
            formData.append('last_name', lname)
            formData.append('email', email)
            formData.append('message', message)

            const response = await petMyPalApiService.contactUs(token, formData).catch((err) => {
                console.log('error while getting states', err)
            })
            const { data } = response
            if (data.status === 200) {
                this.setState({
                    infoText: data?.message,
                    isModal_Visible: true,
                    Sending: false,
                    fname: "",
                    lname: '',
                    message: '',
                    inquiry: '',
                    inquiry_id: '',
                    email: '',
                })
            } else {
                console.log('err', data)
                this.setState({
                    Sending: false,
                    isErrorModal_Visible: true,
                    errorMessage: 'Something Went Wrong'
                })
            }

        }

    }




    // Inq_filterData = (query) => {
    //     if (query.search(/[\[\]?*+|{}\\()@.\n\r]/) == -1) {
    //         if (query === '') {
    //             return inq_about_list
    //         }
    //         const regex = new RegExp([query.trim()], 'i')
    //         return inq_about_list.filter((c) => c.search(regex) >= 0)
    //     } else {
    //         console.log('Inalid query', query)
    //     }
    // }


    


    render() {
        const {
            isVisible,
            inquiry,
            inqError,
            loading,
            searchValue,
            fname,
            lname,
            fname_err,
            lname_err,
            email,
            email_err,
            message,
            msg_err,
            passPolicy,
            isModal_Visible,
            infoText,
            Sending,
            isErrorModal_Visible,
            errorMessage,
            PlaceholderColor,
        } = this.state

        // filteredInquiry = this.Inq_filterData(searchValue)


        return (
            <Container>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={'Contact Us'}
                />
                <Content 
                style={styles.container}
                >
                    <View 
                    style={styles.imgView}
                    >
                        <Image
                            source={contactUsBg}
                            //  resizeMode={'contain'}
                            style={styles.imgStyle}
                        />
                    </View>

                    <Text style={styles.contactusText}>You can contact us anytime at our email address
                        
                    </Text>
                    <TouchableOpacity onPress={this.email}
                  
                    >
                    <Text style={styles.emailText}>  info@petmypal.com</Text>
                    </TouchableOpacity>

                    <View 
                    style={styles.infoContainer}
                    >
                        <Label
                            text={`Inquiry About`}
                            style={{ marginTop: 10, marginBottom:8, fontWeight:'500',marginLeft:3,  }}
                            error={inqError}
                        />

                        <_DropDown
                            data={inquiryAbout}
                            selectedValue={inquiry}
                            renderAccessory={null}
                            staticValue={'Inquiry About'}
                            
                            dropdownPosition={-4.5}
                            dropdownWidth={'50%'}
                            pickerStyle={{width:'86%', marginLeft:18}}
                            
                            placeholder={PlaceholderColor}
                            onChangeText={(value, index, data) => {
                                // console.log('select vlaue',data[index].label)
                                // console.log('selected  id',value)
                            this.setState({
                                inquiry:data[index].label,
                                inqError: false,
                                inquiry_id:value,
                                PlaceholderColor: false
                            })
                            }}
                            style={inqError?[styles.ddView_err]:[styles.ddView]}
                            pickerStyle={{ width: wp(90), alignSelf: 'center', marginLeft: 15 }}

                           />
                         <Divider style={{borderBottomColor:inqError?DANGER:grey,borderBottomWidth:1,width:wp(87) , alignSelf:'center'}}/>
                        {/* <TouchableOpacity
                            onPress={() => this.hideShow_Dropdown()}
                            activeOpacity={1}
                            style={inqError ? [styles.breedViewError] : [styles.breedView]}
                        >
                            <View style={styles.breadInnerView}>
                                {inquiry ?
                                    <Text style={styles.breedText} >{inquiry}</Text> :
                                    <Text style={[styles.breedText, { color: TEXT_INPUT_LABEL }]} >Inquiry About</Text>
                                }
                                <Icon
                                    name={'caretdown'}
                                    type={'AntDesign'}
                                    style={styles.iconStyle}
                                />
                            </View>
                        </TouchableOpacity> */}

                        <TextField
                            label={"First Name"}
                            placeholder={'Enter first name'}
 
                            // placeholderColor={grey}
                            value={fname}
                            error={fname_err}
                            onChangeText={(text) => this.setState({ fname: text, fname_err: false })}
                            containerStyle={styles.containerStyle}
                        />
                        <TextField
                            label={"Last Name"}
                            placeholder={'Enter last name'}
                            value={lname}
                            error={lname_err}
                            onChangeText={(text) => this.setState({ lname: text, lname_err: false })}
                            containerStyle={[styles.containerStyle,{marginTop:0}]}
                        
                        />

                        <TextField
                            label={"Email"}
                            placeholder={'Enter email'}
                            value={email}
                            error={email_err}
                            onChangeText={(text) => this.setState({ email: text, email_err: false })}
                            containerStyle={[styles.containerStyle,{marginTop:0}]}
                    
                    />
                        <TextField
                            label={"Message"}
                            placeholder={'Enter message'}
                            value={message}
                            error={msg_err}
                            multiline={true}
                            onChangeText={(text) => this.setState({ message: text, msg_err: false })}
                            containerStyle={[styles.containerStyle,{marginTop:0}]}
                            
                        
                        />

                        {Sending ?
                            <View style={styles.btnContainerStyle}>
                                <CustomLoader />
                            </View>
                            :
                            <SkyBlueBtn
                                title={'Send'}
                                onPress={() => this.sendMsg()}
                                btnContainerStyle={styles.btnContainerStyle}
                            />
                        }


                    </View>

                
                </Content>


                


                {/* <BreedPicker
                    isVisible={isVisible}
                    data={filteredInquiry}
                    onItemClick={this.handle_Inq_Selection}
                    onChangeText={(value) => this.on_Inq_ValueChange(value)}
                    onBackdropPress={this.hideShow_Dropdown}
                    value={searchValue}
                    loading={loading}
                /> */}

                <InfoModal
                    isVisible={isModal_Visible}
                    onBackButtonPress={() => this.closeModal()}
                    info={infoText}
                    headerText={"Success!"}
                    policy={passPolicy}
                    onPress={() => this.closeModal()}
                />
                <ErrorModal
                    isVisible={isErrorModal_Visible}
                    onBackButtonPress={() => this.closeErrorModal()}
                    info={errorMessage}
                    heading={'Hoot!'}
                    onPress={() => this.closeErrorModal()}
                />
            </Container>
        )
    }

}
export default ContactUs