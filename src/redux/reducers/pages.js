import { pagesTypes } from '../actions/types';
import EventEmitter from '../../services/eventemitter';
const initalState = {
    ownerPages: [],
    likedPages: [],
    recommendPages: [],
    pagesLoader: false,
    pagesNewsFeedLoader: false,
    pageNewsFeed: [],
    ownerLikePage: false,
    likePageLoader: false,
    isLiked: false,
    createPageLoader: false,
    moreData:false

}

export default (state = initalState, action) => {
    switch (action.type) {
        case pagesTypes.OWNER_PAGES:
            return { ...state, pagesLoader: true }
        case pagesTypes.OWNER_PAGES_SUCCESSFULL:
            return { ...state, ownerPages: action.payload?.data??[],pagesLoader: false }
        case pagesTypes.OWNER_LIKED_PAGES:
            return { ...state, likedPages: action.payload?.data??[],pagesLoader: false }
        case pagesTypes.OWNER_RECOMMEND_PAGES:
            return { ...state, recommendPages: action.payload?.data??[], pagesLoader: false }
        case pagesTypes.OWNER_LIKE_PAGE:
            return { ...state, likePageLoader: true }
        case pagesTypes.OWNER_LIKE_PAGE_SUCCESSFUL:
            return { ...state, likePageLoader: false, isLiked: action.payload.like_status == 'liked' ? true : false, recommendPages: state.recommendPages.filter(item => item.id != action.page_id) }
        case pagesTypes.OWNER_PAGE_NEWSFEED:
            return { ...state, pagesNewsFeedLoader: true,moreData:action.moreData }
        case pagesTypes.OWNER_PAGE_NEWSFEED_SUCCESSFUL:
            if(action?.payload){
            if (action.payload.length == 0) {
                EventEmitter.emit('endPageNewsFeed', true)
                return { ...state, pageNewsFeed: state?.pageNewsFeed ?? [], pagesNewsFeedLoader: false,moreData:false }
            } else {
                let modifyData = [];
                const data = action.payload;
                data?.length > 0 && data.forEach(item => {
                    modifyData.push({ ...item, reactionVisible: false })
                });
                var updatedNewsFeed = action.dataType == 'firstTimeLoadData' ? modifyData : state?.pageNewsFeed?.concat(modifyData);
                EventEmitter.emit('pageNewsFeed', updatedNewsFeed)
                return { ...state, pageNewsFeed: updatedNewsFeed, pagesNewsFeedLoader: false,moreData:false }
            }

        }
       else return { ...state, pageNewsFeed: state?.pageNewsFeed ?? [], pagesNewsFeedLoader: false,moreData:false }
    
        case pagesTypes.OWNER_PAGE_NEWSFEED_FAIL:
            return { ...state, pagesNewsFeedLoader: false }
        case pagesTypes.DELETE_PAGE:
            return { ...state, ownerPages: state.ownerPages.filter(item => item.page_id != action.payload) }
        case pagesTypes.CREATE_PAGE:
            return { ...state, createPageLoader: true }
        case pagesTypes.CREATE_PAGE_SUCCESSFUL:
            return { ...state, createPageLoader: false }
        case pagesTypes.CREATE_PAGE_FAIL:
            return { ...state, createPageLoader: false }
        default:
            return state;

    }

}