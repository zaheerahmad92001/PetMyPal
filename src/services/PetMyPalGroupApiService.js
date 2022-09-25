import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import { Alert } from 'react-native';
import { groupTypes } from '../redux/actions/types';
import { SERVER, server_key } from '../constants/server';




class PetMyPalGroupApiService {
    constructor() {
        this.instance = apisauce.create({
            // baseURL: 'https://ladoo.petmypal.com/api/',
            baseURL: `${SERVER}/api/`,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            timeout: 300000
        });
    }
    getPetOwnerGroups = (access_token, user_id, groupType) => {
        return async dispatch => {
            dispatch({ type: groupTypes.OWNER_GROUPS })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', groupType);
            formData.append('user_id', user_id);
            this.instance.post(`get-my-groups?access_token=${access_token}`, formData).then(response => dispatch({ type: groupTypes.OWNER_GROUPS_SUCCESSFULL, payload: response?.data }))


        }

    }
    getOwnerJoinedGroups = (access_token, user_id, groupType) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', groupType);
            formData.append('user_id', user_id);
            formData.append('limit', 40)
            this.instance.post(`get-my-groups?access_token=${access_token}`, formData).then(response => dispatch({ type: groupTypes.OWNER_JOINED_GROUP_SUCCESSFUL, payload: response?.data }))

        }
    }
    getPetOwnerRecommendGroups = (access_token, user_id, groupType) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', groupType);
            formData.append('user_id', user_id);
            this.instance.post(`fetch-recommended?access_token=${access_token}`, formData).then(response => dispatch({ type: groupTypes.OWNER_RECOMMEND_GROUPS_SUCCESSFUL, payload: response?.data }))

        }
    }
    getPetOwnerGroupNewsFeed = (access_token, group_id, groupType, moreData, dataType) => {
        let beforePostId=null
        let after_post_id= null
    
        return async (dispatch, getState) => {
        let groupNewsFeed =  getState()?.groups?.groupNewsFeed

            if(moreData){
                let postType = groupNewsFeed[groupNewsFeed?.length - 1].postType
                if(postType=='advertisement' || postType=='custom_post'){
                    after_post_id =groupNewsFeed[groupNewsFeed?.length - 2].post_id
                }else{
                    after_post_id =groupNewsFeed[groupNewsFeed?.length - 1].post_id
                }
                beforePostId = getState()?.groups?.before_post_id

            }

            dispatch({ type: groupTypes.OWNER_GROUP_NEWSFEED, moreData })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', groupType);
            formData.append('limit', dataType == 'firstTimeLoadData' ? 9 : 9);
            formData.append('id', group_id);
            moreData ? formData.append('after_post_id',after_post_id): null;
            moreData && beforePostId !=0 ? formData.append('before_post_id',beforePostId):null;

            this.instance.post(`posts?access_token=${access_token}`, formData).then((response) =>{
                let beforeId = undefined
                let result = response?.data?.data
                    if(result[0]?.before_post_id!=0){
                        beforeId = result[0].before_post_id
                    }else if(beforePostId && beforePostId !=0 ){ // redux value
                        beforeId =beforePostId;
                    }else{
                        beforeId = getState()?.user?.newsFeed[0]?.post_id
                    }
              dispatch({type: groupTypes.OWNER_GROUP_NEWSFEED_SUCCESSFUL,payload: response?.data?.data, dataType,beforeId:beforeId })
            }).catch((e) => dispatch({ type: groupTypes.OWNER_GROUP_NEWSFEED_FAIL}))
        }
    }

    postReaction = (access_token, postId, reaction) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('post_id', postId);
            formData.append('action', 'reaction');
            formData.append('reaction', reaction);
            this.instance.post(`post-actions?access_token=${access_token}`, formData)

        }
    }
    joinGroup = (access_token, group_id) => {

        return async (dispatch, getState) => {
            dispatch({ type: groupTypes.JOIN_GROUP })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('group_id', group_id);

            return this.instance.post(`join-group?access_token=${access_token}`, formData).then(response => {
                if (response?.data.api_status == 200) {
                    dispatch({ type: groupTypes.FILTER_JOINED_GROUP, payload: group_id })
                    dispatch(this.getOwnerJoinedGroups(access_token, getState()?.user?.user?.user_data?.user_id, 'joined_groups'));
                    return response
                }
            })


        }
    }
    deleteOwnerGroup = (access_token, group_id, password) => {
        return async (dispatch, getState) => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('group_id', group_id);
            formData.append('password', password);
            return this.instance.post(`delete_group?access_token=${access_token}`, formData)
        }
    }
    createPetOwnerGroup = (access_token, formData) => {
        return async () => {
            return this.instance.post(`create-group?access_token=${access_token}`, formData)

        }

    }
    updateOwnerGroupData = (access_token, formData) => {

        return async () => {
            return this.instance.post(`update-group-data?access_token=${access_token}`, formData)

        }

    }
    addFriendInList = async (access_token, formData) => {
        return await this.instance.post(`add-following-in-group?access_token=${access_token}`, formData)
    }

    getFriendList = async (access_token, formData) => {
        return await this.instance.post(`get-followings-not-in-group?access_token=${access_token}`, formData)

    }
    getMembers = async (token, formData) => {

        return await this.instance.post(`groups?access_token=${token}`, formData)


    }
    getPetCategory = () => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key)
            try {
                var response = this.instance.post(`get-pet-types?`, formData);
                response = await response;
                dispatch({type:groupTypes?.GET_PET_CATEGORY,payload: response?.data?.pet_types});
                return response;

            } catch (error) {
                console.log('Something went wrong while fetching pet category!', error)
            }

        }
    }
}
var petMyPalGroupApiService = new PetMyPalGroupApiService();
export {
    petMyPalGroupApiService,

}