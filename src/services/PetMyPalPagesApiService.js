import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import { Alert } from 'react-native';
import { pagesTypes } from '../redux/actions/types';
import { SERVER, server_key } from '../constants/server';




class PetMyPalPagesApiService {
    constructor() {
        this.instance = apisauce.create({
            baseURL: `${SERVER}/api/`,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            timeout: 300000
        });
    }


    getPetOwnerPages = (access_token, user_id, pageType) => {
        return async dispatch => {
            dispatch({ type: pagesTypes.OWNER_PAGES })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', pageType);
            formData.append('user_id', user_id);
            this.instance.post(`get-my-pages?access_token=${access_token}`, formData).then(response => dispatch({ type: pagesTypes.OWNER_PAGES_SUCCESSFULL, payload: response?.data }))
        }


    }
    getOwnerLikedPages = (access_token, user_id, pageType) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', pageType);
            formData.append('user_id', user_id);
            this.instance.post(`get-my-pages?access_token=${access_token}`, formData).then(response => dispatch({ type: pagesTypes.OWNER_LIKED_PAGES, payload: response?.data }))

        }
    }
    getPetOwnerRecommendPages = (access_token, user_id, pageType) => {
        return async dispatch => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', pageType);
            formData.append('user_id', user_id);
            this.instance.post(`fetch-recommended?access_token=${access_token}`, formData).then(response => dispatch({ type: pagesTypes.OWNER_RECOMMEND_PAGES, payload: response?.data }))

        }
    }
    petOwnerLikePage = (access_token, page_id) => {
        return async (dispatch, getState) => {
            dispatch({ type: pagesTypes.OWNER_LIKE_PAGE })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('page_id', page_id);
            this.instance.post(`like-page?access_token=${access_token}`, formData).then(response => {
                if(response?.data?.api_status==200){
                dispatch({ type: pagesTypes.OWNER_LIKE_PAGE_SUCCESSFUL, payload: response?.data, page_id: page_id });
                
               // dispatch(this.getPetOwnerRecommendPages(access_token, getState().user?.user?.user_data?.user_id, 'pages'));
                dispatch(this.getOwnerLikedPages(access_token, getState().user?.user?.user_data?.user_id, 'liked_pages'));
                }
            });


        }
    }
    petOwnerPageNewsFeed = (page_id, access_token, type, moreData, dataType) => {
        return async (dispatch, getState) => {
            dispatch({ type: pagesTypes.OWNER_PAGE_NEWSFEED,moreData })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', type);
            formData.append('id', page_id);
            formData.append('limit', dataType == 'firstTimeLoadData' ? 40 : 20);
            moreData ? formData.append('after_post_id', getState()?.pages?.pageNewsFeed[getState()?.pages?.pageNewsFeed.length - 1].post_id) : null;
            this.instance.post(`posts?access_token=${access_token}`, formData).then(response => dispatch({ type: pagesTypes.OWNER_PAGE_NEWSFEED_SUCCESSFUL, payload: response?.data?.data, dataType })).catch(e => dispatch({ type: pagesTypes.OWNER_PAGE_NEWSFEED_FAIL }))
        }
    }
    petOwnerCreatePage = (name, URL, about,selectPet, access_token, navigation) => {
      
        return async (dispatch, getState) => {
            dispatch({ type: pagesTypes.CREATE_PAGE })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('page_name', name);
            formData.append('page_url', URL);
            formData.append('page_category',selectPet)
            formData.append('about', about);
            // console.log("form data",formData);
            this.instance.post(`create-page?access_token=${access_token}`, formData).then(response => {
                // console.log(response)
                if (response?.data?.api_status == 200) {
                    Alert.alert(
                        '',
                        'Page has been Created',
                        [
                            {
                                text: 'OK',
                                onPress: () => { dispatch(this.getPetOwnerPages(access_token, getState()?.user?.user?.user_data?.user_id, 'my_pages')); dispatch({ type: pagesTypes.CREATE_PAGE_SUCCESSFUL }); navigation.goBack() }
                            },
                        ],
                        { cancelable: false },
                    );

                }
                else {

                    Alert.alert(
                        '',
                        response?.data?.errors?.error_text,
                        [{ text: 'OK', onPress: () => dispatch({ type: pagesTypes.CREATE_PAGE_FAIL }) }],
                        { cancelable: false },
                    );
                }
            }).catch(e => console.log(e))

        }
    }
    deleteOwnerPage = (access_token, page_id, password) => {
        return async (dispatch, getState) => {
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('page_id', page_id);
            formData.append('password', password);
            return this.instance.post(`delete_page?access_token=${access_token}`, formData)
        }
    }
    updateOwnerPageData = (access_token, formData) => {
        return async (dispatch) => {
            return this.instance.post(`update-page-data?access_token=${access_token}`, formData)

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
}


var petMyPalPagesApiService = new PetMyPalPagesApiService();
export {
    petMyPalPagesApiService,

}