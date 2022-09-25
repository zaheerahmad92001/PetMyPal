import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import axios from 'axios';
import types from '../redux/actions/types';
import { SERVER, server_key } from '../constants/server';
import PMP from '../lib/model/pmp';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorModal from '../components/common/ErrorModal';



class PetMyPalApiService {
    constructor() {
        this.instance = apisauce.create({
            baseURL: `${SERVER}/api`,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            timeout: 300000
        });
    }

    setAuth = (userAuth) => this.instance.setHeader('Authorization', 'Bearer ' + userAuth);
    login = (data) => this.instance.post('auth', data);
    socialLogin = (data) => this.instance.post('social-login', data);
    createAccount = (data) => this.instance.post('create-account', data);
    createPet = (access_token, data) => this.instance.post(`create-pet?access_token=${access_token}`, data);
    getPetSubTypes = (data) => this.instance.post(`get-pet-sub-types`, data)
    // updateUserData = (data) => this.instance.post('update-user-data', data);
    updatePetData = (access_token, data) => this.instance.post(`update-pet-data?access_token=${access_token}`, data);
    updateUserData = (access_token, data) => this.instance.post(`update-user-data?access_token=${access_token}`, data);
    changePhoneNumber = (access_token, data) => this.instance.post(`update_user_phone?access_token=${access_token}`, data);
    followUser = (access_token, data) => this.instance.post(`follow-user?access_token=${access_token}`, data)
    followFollowing = (access_token, data) => this.instance.post(`get-friends?access_token=${access_token}`, data)
    getUserData = (access_token, data) => this.instance.post(`get-user-data?access_token=${access_token}`, data)
    recoverByEmail = (data) => this.instance.post(`send-reset-password-email`, data)
    changePassword = (access_token, data) => this.instance.post(`reset-password?access_token=${access_token}`, data)
    postComments = (access_token, data) => this.instance.post(`comments?access_token=${access_token}`, data)
    getUserPets = (access_token, data) => this.instance.post(`get-pets?access_token=${access_token}`, data)
    getUserNewsFeed = (access_token, data) => this.instance.post(`posts?access_token=${access_token}`, data)
    getPixxy = (access_token, data) => this.instance.post(`get-pixxy?access_token=${access_token}`, data)
    getPmpPixxy = (access_token, data) => this.instance.post(`get-pixxy-breads?access_token=${access_token}`, data)
    getWorldPixxy = (access_token, data, b_id, lost, deceased) => this.instance.post(`get-world-pixxy?access_token=${access_token}${b_id}${lost}${deceased}`, data)
    _postReaction = (access_token, data) => this.instance.post(`post-actions?access_token=${access_token}`, data)
    getTrends = (access_token, data) => this.instance.post(`get-tredings?access_token=${access_token}`, data)
    recover_account = (access_token, data) => this.instance.post(`recover-account?access_token=${access_token}`, data)
    activateUser = (access_token, data) => this.instance.post(`activate-user?access_token=${access_token}`, data)
    deleteStory = (access_token, data) => this.instance.post(`delete-story?access_token=${access_token}`, data)
    breed_detection = (access_token, data) => this.instance.post(`breed_detection?access_token=${access_token}`, data)
    breed_detection_feedback = (access_token, data) => this.instance.post(`breed_detection_response?access_token=${access_token}`, data)
    getSinglePost = (access_token, data) => this.instance.post(`get-post-data?access_token=${access_token}`, data)
    deletePost = (access_token, data) => this.instance.post(`posts?access_token=${access_token}`, data)
    updatePost = (access_token, data) => this.instance.post(`posts?access_token=${access_token}`, data)

    /********** e commerce Api ********/
    getProduct = (access_token, data) => this.instance.post(`get-product?access_token=${access_token}`, data)
    getTagPets = (access_token, data) => this.instance.post(`get-tag-pets?access_token=${access_token}`, data)
    getProduct_List = (access_token, data) => this.instance.post(`get-product-list?access_token=${access_token}`, data)
    getStates = (data) => this.instance.post(`get-states`, data)
    checkFreeOrder = (access_token, data) => this.instance.post(`check_user_free_order?access_token=${access_token}`, data)
    orderConfirm = (access_token, data) => this.instance.post(`add-order?access_token=${access_token}`, data)
    orderHistory = (access_token, data) => this.instance.post(`get-previous-orders?access_token=${access_token}`, data)

    LoadFAQ = (access_token, data) => this.instance.post(`get-faqs?access_token=${access_token}`, data)
    contactUs = (access_token, data) => this.instance.post(`contact-us?access_token=${access_token}`, data)


    petOwnerNewsFeed = (access_token, type, moreData, dataType) => {
        let before_post_id=null
        let after_post_id= null

        return (dispatch, getState) => {
            if(moreData){
                let postType = getState()?.user?.newsFeed[getState()?.user?.newsFeed?.length - 1].postType
                if(postType=='advertisement' || postType=='custom_post'){
                    after_post_id =getState()?.user?.newsFeed[getState()?.user?.newsFeed?.length - 2].post_id
                }else{
                    after_post_id =getState()?.user?.newsFeed[getState()?.user?.newsFeed?.length - 1].post_id
                }
                before_post_id = getState()?.user?.before_post_id
            }
            dispatch({ type: types.NEWS_FEED })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', type);
            formData.append('limit', dataType == 'firstTimeLoadData' ? 9 : 9);
            moreData ? formData.append('after_post_id', after_post_id) : null;
            moreData && before_post_id !=0 ? formData.append('before_post_id',before_post_id):null;

// console.log('data sending to server' , formData);

            this.instance.post(`posts?access_token=${access_token}`, formData).then(async (response) => {
                let beforeId = undefined
                let result = response?.data?.data
                    if(result[0]?.before_post_id!=0){
                        beforeId = result[0].before_post_id
                    }else if(getState()?.user?.before_post_id  && getState()?.user?.before_post_id !=0 ){
                        beforeId =getState()?.user?.before_post_id;
                        
                    }else{
                        beforeId = getState()?.user?.newsFeed[0]?.post_id

                    }
                dispatch({ type: types.NEWS_FEED_SUCCESSFUL, payload: response?.data?.data, dataType ,beforeId:beforeId })
                
            }).catch({ type: types.NEWS_FEED_FAIL })
        };
    }

    petOwnerData = (access_token, user_id) => {
        return dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('user_id', user_id);
            formData.append('fetch', 'user_data,family,liked_pages,joined_groups');
            this.instance.post(`get-user-data?access_token=${access_token}`, formData).then((response) => {
                dispatch({ type: types.USER_EDIT, payload: response?.data });
            }).catch((e) =>
                dispatch({ type: types.USER_EDIT_FAIL }))
        }
    }

    ownerpets = (access_token, NavigationService) => {
        return dispatch => {
            dispatch({ type: types.FETCH_PETS })
            const formData = new FormData();
            formData.append('server_key', server_key);
            this.instance.post(`get-user-pets?access_token=${access_token}`, formData).then(response => {
                if (response.data.api_status === 200) {
                    dispatch({ type: types.SAVE_PETS, payload: response.data.pets })
                } else {

                    PMP.logout().then(() => {
                        alert('Session Expired. Please Login to continue again');
                        console.log('get user api ', access_token, formData);
                        NavigationService.navigate('AuthNavigator');
                    });
                }
            })
        }
    }


    petOwnerCreateStory = async (access_token, images, story) => {

        const formData = new FormData();

        images.forEach((i, index) => {
            if (
                i?.uri?.includes('jpeg') ||
                i?.uri?.includes('jpg') ||
                i?.uri?.includes('gif') ||
                i?.uri?.includes('png')
            ) {
                formData.append('file[]', {
                    uri: i.uri,
                    type: 'image/jpeg',
                    name: `photo${index}.jpg`,
                });
            } else {
                formData.append('file[]', {
                    uri: i.uri,
                    name: 'video.mp4',
                    type: 'video/mp4',
                });
            }
        });

        formData.append('server_key', server_key);
        formData.append('file_type', 'image');
        story != '' && formData.append('story_title', story);
        return await this.instance.post(`create-story?access_token=${access_token}`, formData)

    }
    //get stories of pet owner *******
    petOwnerStories = (access_token) => {
        return dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('limit', 10);
            formData.append('offset', 0);
            this.instance.post(`get-user-stories?access_token=${access_token}`, formData).then(response => { dispatch({ type: types.OWNER_STORIES, payload: response.data.stories }) })

        }
    }
    petOwnerFriendSuggestion = (access_token) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('limit', 4);
            this.instance.post(`get-friend-suggestion?access_token=${access_token}`, formData).then(response => dispatch({ type: types.OWNER_FRIEND_SUGGESTION, payload: response?.data?.friends }))

        }
    }

    postReaction =  (access_token, postId, reaction) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('post_id', postId);
            formData.append('action', 'reaction');
            formData.append('reaction', reaction);
            this.instance.post(`post-actions?access_token=${access_token}`, formData).then((res)=>{
                console.log('post reaction res',res.data);
            })
        }
    }

    createNewPost = (token, formData, checkMultiPost) => {
        
        return async (dispatch) => {
            dispatch({ type: types.CREATE_NEW_POST })
            try {
                const response = await fetch(SERVER + `/app_api.php?application=phone&type=${checkMultiPost ? 'multi_post' : 'new_post'}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',

                    },
                })
                let responseJson = await response.json();
                responseJson = await responseJson;
                if (responseJson.api_status == 200) {
                    dispatch({ type: types.CREATE_NEW_POST_SUCCESSFUL })
                    // dispatch(this.petOwnerNewsFeed(token, 'get_news_feed', false, 'firstTimeLoadData'))  
                    return responseJson;
                }
            }
            catch (e) {
                alert(e)
                console.log('error in catch while add new Post ', e)
                dispatch({ type: types.CREATE_NEW_POST_FAIL })
            }
        }
    }
    saveNotificationSettings = (formData) => {
        return async dispatch => {
            var notificationInstance = axios.create({
                baseURL: `${SERVER}`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Access-Control-Allow-Origin': '*',
                },
                timeout: 500000
            });

            return notificationInstance.post('/app_api.php?application=phone&type=update_user_data', formData);


        }

    }
    savePrivacySettings = (formData) => {
        return async dispatch => {
            var privacyInstance = axios.create({
                baseURL: `${SERVER}`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Access-Control-Allow-Origin': '*',
                },
                timeout: 500000
            });

            return privacyInstance.post('/app_api.php?application=phone&type=update_user_data', formData);


        }

    }
    getBlockedusers = async (formData) => {
        var blockUsersInstance = axios.create({
            baseURL: `${SERVER}`,
            headers: {
                'Content-Type': 'multipart/form-data',
                // 'Access-Control-Allow-Origin': '*',
            },
            timeout: 500000
        });
        return await blockUsersInstance.post('app_api.php?application=phone&type=get_blocked_users', formData)

    }
    unBlockUser = async (formData) => {
        var unBlockUserInstance = axios.create({
            baseURL: `${SERVER}`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'accept': 'application/json',
            },
            timeout: 500000
        });
        return await unBlockUserInstance.post('app_api.php?application=phone&type=block_user', formData)

    }
    petActivity = async (access_token, user_id, pet_losted) => {

        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append("pet_losted", pet_losted);
        formData.append("user_id", user_id);
        return this.instance.post(`get-activities?access_token=${access_token}`, formData)


    }
    petFoundAction = (access_token, pet_id, NavigationService) => {
        try {
            return async dispatch => {
                const formData = new FormData();
                formData.append('server_key', server_key);
                formData.append('pet_id', pet_id);

                this.instance.post(`found-pet?access_token=${access_token}`, formData).then(res => {
                    if (res?.data?.status == 200) {
                        dispatch(this.ownerpets(access_token, NavigationService))
                    }
                })

            }
        }
        catch (e) {
            console.log(e)
        }
    }
    getPetDataAfterUpdate = (access_token, server_key, id) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('fetch', 'user_data');
            formData.append('user_id', id);

            return this.instance.post(`get-user-data?access_token=${access_token}`, formData).then(res => {
                if (res?.data?.api_status == 200) {
                    dispatch({ type: types.GET_UPDATED_PET_DATA, payload: res?.data?.user_data });

                }
                return res.data;
            })

        }



    }
    confirmRequest = async (access_token, server_key, id, type) => {
        // console.log('access_token, server_key, id, type',access_token,'hdbhd', server_key, id, type);
        const formData = new FormData();
        formData.append('server_key', server_key);
        formData.append('user_id', id);
        formData.append('request_action', type);
        return await this.instance.post(`follow-request-action?access_token=${access_token}`, formData).catch(e => {
            console.warn('friend accept request failed!')

        })

    }



}





var petMyPalApiService = new PetMyPalApiService();
export {
    petMyPalApiService,

}
