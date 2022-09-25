import { groupTypes } from '../actions/types';
import EventEmitter from '../../services/eventemitter';
const initalState = {
    ownerGroups: [],
    joinedGroups: [],
    recommendGroups: [],
    groupsLoader: false,
    groupNewsFeedLoader: false,
    groupNewsFeed: [],
    ownerLikeGroup: false,
    joinedGroupLoader: false,
    isJoined: false,
    createGroupLoader: false,
    moreData: false,
    petCategoryArray: [],
    before_post_id:null

}
export default (state = initalState, action) => {
    switch (action.type) {

        case groupTypes.OWNER_GROUPS:
            return {
                ...state,
                groupsLoader: true
            }

        case groupTypes.OWNER_GROUPS_SUCCESSFULL:
            return {
                ...state,
                ownerGroups: action.payload?.data ?? [],
                groupsLoader: false
            }

        case groupTypes.OWNER_JOINED_GROUP_SUCCESSFUL:
            return {
                ...state,
                joinedGroups: action.payload?.data ?? [],
                joinedGroupLoader: false,
                groupsLoader: false
            }
        case groupTypes.OWNER_RECOMMEND_GROUPS_SUCCESSFUL:
            return {
                ...state,
                recommendGroups: action.payload?.data ?? [],
                groupsLoader: false
            }
        case groupTypes.OWNER_GROUP_NEWSFEED:
            return {
                ...state,
                groupNewsFeedLoader: true,
                moreData: action.moreData
            }

        case groupTypes.OWNER_GROUP_NEWSFEED_SUCCESSFUL:
            let modifyData = [];
            const data = action?.payload;
            if (data) {
                if (data?.length == 0) {
                    EventEmitter.emit('endgroupNewsFeed', true)
                    return { 
                        ...state, 
                        groupNewsFeed: state?.groupNewsFeed ?? [],
                        groupNewsFeedLoader: false, 
                        moreData: false ,
                        before_post_id:action.beforeId
                    }
                }
                if(data?.length == 1 && state.moreData ){  /// when reached end every time custom/advertisement post received
                    let postType = data.postType
                    if (postType == 'advertisement' || postType == 'custom_post') {
                        return { 
                            ...state, 
                            groupNewsFeed: state?.groupNewsFeed,
                            groupNewsFeedLoader: false, 
                            moreData: false , 
                            before_post_id:action.beforeId 
                        }
                    }

                    data?.length > 0 && data.forEach(item => { modifyData.push({ ...item, reactionVisible: false })});
                    var updatedNewsFeed = action.dataType == 'firstTimeLoadData' ? modifyData : state?.groupNewsFeed?.concat(modifyData);
                    EventEmitter.emit('groupNewsFeed', updatedNewsFeed)
                    return { 
                        ...state, 
                        groupNewsFeed: updatedNewsFeed, 
                        groupNewsFeedLoader: false, 
                        moreData: false ,
                        before_post_id:action.beforeId
                    }
                    
                }else {
                    data?.length > 0 && data.forEach(item => { modifyData.push({ ...item, reactionVisible: false })});
                    var updatedNewsFeed = action.dataType == 'firstTimeLoadData' ? modifyData : state?.groupNewsFeed?.concat(modifyData);
                    EventEmitter.emit('groupNewsFeed', updatedNewsFeed)
                    return { 
                        ...state, 
                        groupNewsFeed: updatedNewsFeed, 
                        groupNewsFeedLoader: false, 
                        moreData: false ,
                        before_post_id:action.beforeId
                    }
                }
            }
            else return {
                ...state,
                groupNewsFeed: state?.groupNewsFeed ?? [],
                groupNewsFeedLoader: false,
                moreData: false
            }

        case groupTypes.OWNER_GROUP_NEWSFEED_FAIL:
            return {
                ...state,
                groupNewsFeedLoader: false
            }
        case groupTypes.JOIN_GROUP:
            return {
                ...state,
                joinedGroupLoader: true
            }
        case groupTypes.FILTER_JOINED_GROUP:
            return {
                ...state,
                recommendGroups: state.recommendGroups.filter(item => item.id != action.payload)
            }
        case groupTypes.DELETE_GROUP:
            return {
                ...state,
                ownerGroups: state.ownerGroups.filter(item => item.group_id != action.payload)
            }
        case groupTypes.GET_PET_CATEGORY:
            let tempArray = [];
            action.payload.forEach(((item) => { 
                tempArray.push({
                    value: item.id,
                    label: item.name
                })
            }))
            return {
                ...state,
                petCategoryArray: tempArray
            }

        default:
            return state;



    }
}