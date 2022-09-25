import _ from 'lodash';
import types from '../actions/types';
import EventEmitter from '../../services/eventemitter';


const initialState = {
  user: null,
  workspace: null,
  confet: true,
  newsFeed: [],
  moreNewsFeed: false,
  newsFeedloader: false,
  stories: [],
  friendSuggestion: [],
  createPostLoader: false,
  follow_followers: null,
  token: undefined,
  before_post_id: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.USER_EDIT: {
      return {
        ...state,
        user: action.payload
      };
    }
    case types.USER_SAVE: {
      const { user } = action;
      return {
        ...state,
        user,
      };
    }

    case types.USER_WORKSPACE: {
      const { workspace } = action;
      return {
        ...state,
        workspace,
      };
    }

    case types.REMOVE_USER: {
      return {
        user: null,
      };
    }
    case types.FOLLOWS_FOLLOWERS: {
      return {
        ...state,
        follow_followers: action.payload
      }
    }
    case types.PERSIST_TOKEN:
      return { ...state, token: action.payload }

    case types.SHOW_CONFETTI:
      return { confet: false }

    case types.NEWS_FEED:
      return {
        ...state, newsFeedloader: true
      }

    case types.NEWS_FEED_SUCCESSFUL:
      let modifyData = [];
      const data = action?.payload;

      if (data?.length == 0) {
        EventEmitter.emit('endNewsFeed', true)
        return { ...state, newsFeed: state?.newsFeed ?? [], newsFeedloader: false, before_post_id: action.beforeId }
      }
      if (data?.length == 1) {  /// when reached end every time custom/advertisement post received
        let postType = action.payload.postType
        if (postType == 'advertisement' || postType == 'custom_post') {
          return {
            ...state,
            newsFeed: state?.newsFeed,
            newsFeedloader: false,
            before_post_id: action.beforeId
          }
        }

        data?.forEach(item => {
          modifyData.push({ ...item, reactionVisible: false, });
        });
        var updatedNewsFeed = action.dataType == 'firstTimeLoadData' ? modifyData : state.newsFeed.concat(modifyData);
        EventEmitter.emit('updateNewsFeed', updatedNewsFeed)
        return {
          ...state,
          newsFeed: updatedNewsFeed,
          newsFeedloader: false,
          before_post_id: action.beforeId
        }

      }
      
      data.length > 0 && data?.forEach(item => {
        modifyData.push({ ...item, reactionVisible: false, });
      });
      var updatedNewsFeed = action.dataType == 'firstTimeLoadData' ? modifyData : state.newsFeed.concat(modifyData);
      EventEmitter.emit('updateNewsFeed', updatedNewsFeed)
      return {
        ...state,
        newsFeed: updatedNewsFeed,
        newsFeedloader: false,
        before_post_id: action.beforeId
      }

    case types.UPDATE_POST_SHARE_COUNT:
      var updateNewsFeed = state.newsFeed
      updateNewsFeed.forEach((item) => {

        if (item.post_id == action.payload) {
          if (item?.shared_info?.post_share) {
            item.shared_info.post_share = Number(item.shared_info.post_share) + 1
          }
          else {
            item.post_share = Number(item.post_share) + 1
          }
        }

      });

      EventEmitter.emit('updateNewsFeed', updateNewsFeed)
      return { ...state, newsFeed: updateNewsFeed }
    case types.NEWS_FEED_FAIL:
      return { ...state, newsFeedloader: false }
    case types.OWNER_STORIES:
      return { ...state, stories: action.payload }
    case types.OWNER_FRIEND_SUGGESTION:
      return { ...state, friendSuggestion: action.payload }
    case types.CREATE_NEW_POST:
      return { ...state, createPostLoader: true }
    case types.CREATE_NEW_POST_SUCCESSFUL:
      return { ...state, createPostLoader: false }
    case types.CREATE_NEW_POST_FAIL:
      return { ...state, createPostLoader: false }

    default: {
      return state;
    }
  }
};
