import React, { Component } from "react";
import { View, Text, Image } from 'react-native'
import { Content, Container, Icon } from "native-base";
import PMPHeader from '../../components/common/PMPHeader'
import { breed_banner } from '../../constants/ConstantValues'
import styles from './styles'
import { darkSky, TEXT_INPUT_LABEL } from "../../constants/colors";
import { TouchableOpacity } from "react-native";
import SkyBlueBtn from "../../components/common/SkyblueBtn";
import ImagePicker from 'react-native-image-picker';
import { Platform } from "react-native";
import { server_key } from '../../constants/server';
import { ACCESS_TOKEN } from '../../constants/storageKeys';
import AsyncStorage from '@react-native-community/async-storage';
import { petMyPalApiService } from '../../services/PetMyPalApiService';
import ErrorModal from '../../components/common/ErrorModal';
import CustomLoader from "../../components/common/CustomLoader";
import TextField from "../../components/common/TextField";
import { Capitalize } from "../../utils/RandomFuncs";

var options = {
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class BreedIdentifier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgResponse: '',
            imgUri: '',
            result: false,
            token: '',
            showErrorModal: false,
            errMsg: '',
            searching: false,
            apiResult: '',
            breedResult: '',
            feedback_like: false,
            feedback_disLike: false,
            breedName: '',
            breedNameError: false,
            sending: false,
            feedbackSent: false,
            __state: 1,

        }


    }
    componentDidMount() {
        this.getAccessToken().then(async (TOKEN) => {
            this.setState({
                token: JSON.parse(TOKEN).access_token,
            });
        });

    }

    async getAccessToken() {
        const access_token = await AsyncStorage.getItem(ACCESS_TOKEN);
        return access_token;
    }

    goBack = () => {
        const { __state } = this.state
        // if (__state == 1) {
            //TODO why pop was necessary?
            this.props.navigation.goBack()
        // } 
        // else {
        //     this.setState({
        //         feedback_disLike: false,
        //         feedback_like: false,
        //         feedbackSent: false,
        //         apiResult: '',
        //         imgResponse: '',
        //         __state: 1
        //     })
        // }
    }

    SelectPhoto = async () => {

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                console.log(response);
                const source = { uri: response.uri };
                this.setState({
                    imgResponse: response,
                    imgUri: response.uri
                },() => this.findBreed()
                )}
        });
    };

    cancelPhoto = () => {
        this.setState({
            imgResponse: '',
            imgUri: '',
            apiResult:undefined
        })
    }


    closeErrorModal = () => {
        this.setState({ showErrorModal: false })
    }

    findBreed = async () => {
        const { imgResponse, imgUri, token } = this.state
        // console.log('imge breed ', imgResponse);
        let path = imgResponse.uri;
        if (Platform.OS === "ios") {
        path = "~" + path.substring(path.indexOf("/Documents"));
        }
        if (!imgResponse.fileName) imgResponse.fileName = path.split("/").pop();
        if (imgResponse) {
            this.setState({ searching: true, })
            const formData = new FormData()
            formData.append('server_key', server_key);
            formData.append('breedPhotos', {
                name: imgResponse?.fileName,
                data: imgResponse?.data,
                type: imgResponse?.type,
                uri: Platform.OS === 'ios' ?
                    imgResponse?.uri.replace('file://', '')
                    : imgResponse?.uri,
            })
         const response = await petMyPalApiService.breed_detection(token, formData).catch((err) => {
                console.log('err', err)
            })
            const { data } = response
            const result = data?.response
            if (data.status == 200) {
                if (data.response.pet !== 'NULL') {
                    let res_obj = {}
                    Object.entries(result.results).sort((a, b) => b[1] - a[1]).map((item, i) => {
                        if (item[1] > 0) {
                            let key = `key${i}`
                            let value = `value${i}`
                            res_obj[key] = item[0]
                            res_obj[value] = item[1]
                        }
                    })

                    this.setState({
                        searching: false,
                        apiResult: data,
                        breedResult: res_obj,
                        __state: 2
                    })
                } else if (data.response.pet == 'Horse') {
                    this.setState({
                        searching: false,
                        __state: 2,
                    })
                } else {
                    this.setState({
                        searching: false,
                        showErrorModal: true,
                        errMsg: 'Oops, no pet found in the picture. upload a different picture.',
                    })
                }
            } else {
                console.log('data?.errors',data?.errors)
                this.setState({
                    showErrorModal: true,
                    searching: false,
                    errMsg: Capitalize(data?.errors)
                })
            }

        } else {
            this.setState({
                showErrorModal: true,
                errMsg: 'Please upload image first.',
            })
        }

    }

    handle_Like_Feedback = () => {
        const { apiResult, feedback_like, feedback_disLike } = this.state
        if (!feedback_disLike && !feedback_like) {
            this.setState({ feedback_like: true, feedback_disLike: false })

            setTimeout(() => {
                this.setState({
                    errMsg: 'Thank you for your feedback,we will improve our system.',
                    showErrorModal: true,
                })
            }, 1000);
        }

    }
    handle_dis_Like_Feedback = () => {
        const { apiResult, feedback_like, feedback_disLike } = this.state

        if (!feedback_disLike && !feedback_like) {
            this.setState({ feedback_disLike: true, feedback_like: false })
        }
    }

    handleFeedback = async () => {
        const { apiResult, breedName, token } = this.state
        let err = false
        if (!breedName || !breedName.trim().length > 0) {
            err = true
            this.setState({
                breedNameError: true
            })
        } else {
            this.setState({ sending: true })
            const formData = new FormData()
            formData.append('server_key', server_key);
            formData.append('breed_name', breedName);
            formData.append('breed_image', apiResult.image_path)

            console.log('data sending feedback', formData)
            const response = await petMyPalApiService.breed_detection_feedback(token, formData).catch((err) => {
                console.log('err while send feedback', err)
            })
            console.log('feedback response', response)

            const { data } = response
            if (data.status == 200) {
                this.setState({
                    errMsg: data?.message,
                    showErrorModal: true,
                    feedbackSent: true
                })
            }
            console.log('feedback response', data)
        }

    }


    render() {
        const {
            imgUri,
            imgResponse,
            result,
            showErrorModal,
            errMsg,
            apiResult,
            breedResult,
            searching,
            feedback_like,
            feedback_disLike,
            breedName,
            breedNameError,
            sending,
            feedbackSent,
        } = this.state

        return (
            <Container>
                <PMPHeader
                    ImageLeftIcon={true}
                    LeftPress={() => this.goBack()}
                    centerText={`Sandy's Lab`}
                />

                <Content>

                    <View style={styles.imgView}>
                        <Image
                            source={breed_banner}
                            style={styles.imgStyle}
                            resizeMode={'contain'}
                        />
                    </View>
                    {/* <View style={styles.contentView}>
                        <Text style={[styles.boldText,{textAlign:'center',marginBottom:3,}]}>Welcome to Sandy's Lab.</Text>
                        <Text style={styles.textStyle}>Let PetMyPal identify your Cat and Dog Breed.</Text>
                    </View> */}
                    
                    {/* {!apiResult ? */}
                        <View style={{ marginHorizontal: 20 }}>
                            {/* <Text style={[styles.uploadImg]}>Upload Image</Text> */}
                            {imgUri ?

                                <TouchableOpacity 
                                 onPress={() => this.SelectPhoto()}
                                 style={styles.breedImgView}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            zIndex: 1,
                                            alignSelf: 'flex-end',
                                            backgroundColor:"white",
                                            height:35,
                                            width:35,
                                            borderRadius:35/2,
                                            justifyContent:"center",
                                            alignItems:'center',
                                            top:5,
                                            right:5,
                                        }}>
                                        <Icon
                                            onPress={
                                            searching ? ()=>{} :
                                            () => this.cancelPhoto()
                                           }
                                            name={'close'}
                                            type={'AntDesign'}
                                            style={styles.closeIcon}
                                        />
                                    </View>
                                    <Image
                                        source={{ uri: imgUri }}
                                        style={styles.imgStyle}
                                    />
                                </TouchableOpacity>
                                :
                            <View>
                                <TouchableOpacity
                                    onPress={() => this.SelectPhoto()}
                                    style={styles.emp_breedImgView}
                                >
                                    <Icon
                                        name={'camera'}
                                        type={'SimpleLineIcons'}
                                        style={{ color: TEXT_INPUT_LABEL }}
                                    />
                                </TouchableOpacity>
                                <View style={styles.instructionsView}>
                                <Text style={[styles.boldText]} >Instructions</Text>
                                
                                <View style={styles.instructionTextView}>
                                    <Text style={styles.countText}>1.</Text>
                                    <Text style={styles.instructionText}>Make sure the image is clear.</Text>
                                </View>

                                <View style={styles.instructionTextView}>
                                    <Text style={styles.countText}>2.</Text>
                                    <Text style={styles.instructionText}>The image size must not exceed 20MB.</Text>
                                </View>

                                <View style={styles.instructionTextView}>
                                    <Text style={styles.countText}>3.</Text>
                                    <Text style={styles.instructionText}>Your feedback is always welcome to improve Sandy’s Lab.</Text>
                                </View>
                                
                                </View>
                            </View>
                     
                            }

                            {searching ?
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 20,
                                }}>
                                    <CustomLoader/>
                                </View>
                                : null
                            }
                        </View>
                        {/* : */}
                        {apiResult ?
                        <View style={styles.resultContainer}>
                            <View style={styles.resultView}>
                                <View style={styles.results}>
                                    <Text style={styles.heading}>{`${apiResult.response.pet} Detected`}</Text>
                                    {apiResult.response.pet === 'Horse' ?
                                        <View>
                                            <Text style={styles.typeHeading}>{`Breed detector coming soon!`}</Text>
                                        </View> :
                                        <View>
                                            <View style={styles.resultsFigure}>
                                            <Text style={styles.typeHeading}>{breedResult.key0}</Text>
                                            <Text style={styles.percentage}>{`${breedResult.value0}%`}</Text>
                                            </View>
                                            {breedResult.value1 > 0 ?
                                                <View style={styles.resultsFigure}>
                                                    <Text style={[styles.typeHeading, { marginTop: 10 }]}>{breedResult.key1}</Text>
                                                    <Text style={styles.percentage}>{`${breedResult.value1}%`}</Text>
                                                </View> : null
                                            }

                                            {breedResult.value2 ?

                                                <View style={styles.resultsFigure}>
                                                    <Text style={[styles.typeHeading, { marginTop: 10 }]}>{breedResult.key2}</Text>
                                                    <Text style={styles.percentage}>{`${breedResult.value2}%`}</Text>
                                                </View> : null
                                            }

                                        </View>
                                    }
                                </View>
                                {/* <View style={styles.res_Img}>
                                    <Image
                                        source={{ uri: imgResponse.uri }}
                                        resizeMode={'contain'}
                                        style={{ width: null, height: null, flex: 1 }}
                                    />
                                </View> */}

                            </View>
                            


                            <View style={styles.feedbackView}>
                                <View style={styles.textView}>
                                    <Text style={styles.feedbackText}>Share your experience on Sandy`s Breed identifier</Text>
                                </View>
                                <View style={styles.likeDislikeView}>
                                    <View style={styles.likeDislikeInnerView}>
                                        <View style={styles.likeView}>
                                        <Icon
                                            onPress={() => this.handle_Like_Feedback()}
                                            name={feedback_like ? 'like1' : 'like2'}
                                            type={'AntDesign'}
                                            style={{ color: darkSky, fontSize: 25 }}
                                        />
                                        </View>
                                        <View style={{...styles.likeView,marginLeft:25}}>
                                        <Icon
                                            onPress={() => this.handle_dis_Like_Feedback()}
                                            name={feedback_disLike ? 'dislike1' : 'dislike2'}
                                            type={'AntDesign'}
                                            style={{ color: darkSky, fontSize: 25,top:1  }}
                                        />
                                        </View>
                                    </View>
                                </View>

                            </View>


                            {feedback_disLike ?
                                feedbackSent ? null :
                                    <View>
                                        <View
                                            style={styles.dislikefeedback}
                                        >
                                            <Text style={styles.feedbackTextStyle}>Help us locate the breed. Your feedback will improve our Artificial Intelligence System.</Text>
                                            <TextField
                                                label={'Breed Name'}
                                                placeholder={'Enter Breed Name'}
                                                value={breedName}
                                                onChangeText={(text) => this.setState({ breedName: text, breedNameError: false, })}
                                                error={breedNameError}
                                                containerStyle={{ marginTop: 20 }}
                                            />
                                        </View>

                                        <View style={{
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginHorizontal: 20,
                                            marginBottom: 20,
                                        }}>
                                            {sending ?
                                                <CustomLoader
                                                    loaderContainer={{ left: 30 }}
                                                />
                                                :
                                                <SkyBlueBtn
                                                    onPress={() => this.handleFeedback()}
                                                    title={'Save'}
                                                    disabled={breedNameError}
                                                    btnContainerStyle={styles.fintBreedBtn}

                                                />
                                            }
                                            <SkyBlueBtn
                                                title={'Cancel'}
                                                onPress={() => this.setState({ feedback_like: false, feedback_disLike: false })}
                                                btnContainerStyle={styles.retryBtn}
                                                titleStyle={styles.titleStyle}
                                            />
                                        </View>
                                    </View> : null
                            }

                            <TouchableOpacity
                             onPress={() => this.goBack()}
                             >
                                <View style={
                                    feedback_disLike ?
                                        [styles.moreBreedView_dislike] :
                                        [styles.moreBreedView]
                                }>
                                    <Icon
                                        name={'chevron-back'}
                                        type={'Ionicons'}
                                        style={styles.backArrow}
                                    />
                                    <Text style={styles.morebreeText}>Find more breeds</Text>
                                </View>
                            </TouchableOpacity>
                           
                        </View> 
                        : null
                         }
                    {/* } */}

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

export default BreedIdentifier
