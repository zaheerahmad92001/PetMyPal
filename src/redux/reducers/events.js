import { eventsTypes } from "../actions/types";
const initialState = {
  events: { pastEvents: [], InterestedEvents: [], InvitedEvents: [], GoingEvents: [], allEvents: [], myEvents: [] },
  createEventLoader: false,
  eventNewsFeed:[],
  eventNewsFeedLoader:false,
  moreData:false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case eventsTypes.CREATE_EVENT_LOADER:
      return {
        ...state, createEventLoader: true
      }
    case eventsTypes.CREATE_EVENT_SUCCESSFUL: {
      const { event } = action;
      return {
        events: event,
        createEventLoader: false
      };
    }
    case eventsTypes.CREATE_EVENT_FAIL:
      return {
        ...state, createEventLoader: false
      }
    case eventsTypes.EVENT_NEWS_FEED:
      return{...state,eventNewsFeedLoader:true,moreData:action.moreData}
    case eventsTypes.EVENT_NEWS_FEED_SUCCESSFUL:
      if(action.payload){
        if (action.payload?.length == 0) {
            EventEmitter.emit('endEventNewsFeed', true)
            return { ...state, eventNewsFeed: state.eventNewsFeed ?? [], eventNewsFeedLoader: false,moreData:false }
        } else {
            let modifyData = [];
            const data = action.payload;
            data?.length > 0 && data.forEach(item => {
                modifyData.push({ ...item, reactionVisible: false })
            });
            var updatedNewsFeed = action.dataType == 'firstTimeLoadData' ? modifyData : state?.eventNewsFeed?.concat(modifyData);
            EventEmitter.emit('eventNewsFeed', updatedNewsFeed)
            return { ...state, eventNewsFeed: updatedNewsFeed, eventNewsFeedLoader: false,moreData:false  }
        }}
        else   return { ...state, eventNewsFeed: state?.eventNewsFeed ?? [], eventNewsFeedLoader: false,moreData:false }
    case eventsTypes.EVENT_NEWS_FEED_FAIL:
      return {...state, eventNewsFeedLoader:false}


    default: {
      return state;
    }
  }
};
