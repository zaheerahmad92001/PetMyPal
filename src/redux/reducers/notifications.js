import produce from 'immer';
const initialState = {
  chatListlUnread: [],
  chatList: [],
  conversation: [],
  reciveMessage: [],
  totalUnreadNotifications: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LAST_NOTIFICATION_UPDATE': {
      return {
        ...state,
        totalUnreadNotifications: state.totalUnreadNotifications + 1
      };
    }
    case 'NOTIFICATION_REMOVE': {
      return {
        ...state,
        totalUnreadNotifications: 0
      };
    }
    default: {
      return state;
    }
  }
};
