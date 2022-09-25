import produce from 'immer';
const initialState = {
  chatList: [],
  conversation: [],
  reciveMessage: [],
  chatListlUnread: [],
  totalUnread: 0,
};

export default (state = initialState, action) => {
  
  switch (action.type) {
    case 'LAST_MESSAGE_UPDATE': {
            var chatArray = state.chatListlUnread;
            var chatListArray = state.chatList;
            const isLargeNumber2 = element =>
            element?.user_id == action?.payload?.notif?.data?.user_id;
          let isNumber2 = state.chatList.findIndex(isLargeNumber2);
          if (isNumber2 > -1) {
            chatListArray = produce(state.chatList, draftState => {
              draftState[isNumber2].count = draftState[isNumber2].count ? draftState[isNumber2].count + 1: 1
            });
          }
            if (state.chatListlUnread.length > 0) {
              const isLargeNumber = element =>
                element?.data?.user_id == action?.payload?.notif?.data?.user_id;
              let isNumber = state.chatListlUnread.findIndex(isLargeNumber);
              if (isNumber < 0) {
                let obj = action.payload.notif;
                obj.count = 1;
                chatArray = produce(state.chatListlUnread, draftState => {
                  draftState.push(obj);
                });
              } else {
                let obj = action.payload.notif;
                chatArray = produce(state.chatListlUnread, draftState => {
                  obj.count = draftState[isNumber].count + 1;
                  draftState[isNumber] = obj;
                });
              }
            } else {
              let obj = action.payload.notif;
              obj.count = 1;
              chatArray = produce(state.chatListlUnread, draftState => {
                draftState.push(obj);
              });
            }
            return {
              ...state,
              totalUnread: state.totalUnread + 1,
              chatListlUnread: chatArray,
              chatList: chatListArray
            };
          }
          case 'SEEN_MESSAGE_UPDATE': {
            var chatArray = state.chatListlUnread;
            var chatListArray = state.chatList;
            var getCount = 0;
              const isLargeNumber = element =>
                element?.data?.user_id == action?.payload;
              let isNumber = state.chatListlUnread.findIndex(isLargeNumber);
              if (isNumber > -1) {
                chatArray = produce(state.chatListlUnread, draftState => {
                  getCount = draftState[isNumber].count
                  draftState.splice(isNumber, 1);
                });
              }
              const isLargeNumber2 = element =>
              element?.user_id == action?.payload;
            let isNumber2 = state.chatList.findIndex(isLargeNumber2);
            if (isNumber2 > -1) {
              chatListArray = produce(state.chatList, draftState => {
                draftState[isNumber2].count = 0
              });
            }
            return {
              ...state,
              totalUnread: state.totalUnread - getCount,
              chatListlUnread: chatArray,
              chatList: chatListArray
            };
          }
           case 'CHATLIST': {
              chatArray = produce(action.payload, draftState => {
                if(state.chatListlUnread.length > 0){
                  draftState.map((item) =>{
                    state.chatListlUnread.map((subitem) =>{
                      if(item.user_id == subitem.data.user_id){
                        item.count = subitem.count
                      }
                    })
                  })
                }else{
                  draftState
                }
               
              });
             return {
               ...state,
              chatList: chatArray,
             };
           }
           case 'CONVERSATION': {
             return {
               ...state,
              conversation: action.payload.sort((a, b) => b.createdAt - a.createdAt),
             };
           }
       
           case 'SEND_MESSAGE': {
             return {
               ...state,
              conversation: action.payload.sort((a, b) => b.createdAt - a.createdAt),
             };
           }
           case 'MESSAGE_RECIVE': {
             return {
               ...state,
               reciveMessage: [],
              conversation: action.payload.sort((a, b) => b.createdAt - a.createdAt),
             };
           }
           case 'RECIVE_MESSAGE': {
             return {
               ...state,
              reciveMessage: action.payload,
             };
           }
    default: {
      return state;
    }
  }
};
