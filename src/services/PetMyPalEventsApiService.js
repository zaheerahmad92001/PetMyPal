import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import { eventsTypes } from '../redux/actions/types';
import { SERVER, server_key } from '../constants/server';
import {petMyPalApiService} from './PetMyPalApiService';
const {petOwnerNewsFeed} = petMyPalApiService;

class PetMyPalEventsApiService {
    constructor() {
        this.instance = apisauce.create({
            // baseURL: 'https://ladoo.petmypal.com/api/',
            baseURL: `${SERVER}/api/`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'accept': 'application/json',
            },
            timeout: 300000
        });
    }
    deleteEvent = (access_token, formData, navigation) => {
        return async dispatch => {
            // dispatch({ type: eventsTypes.CREATE_EVENT_LOADER })
           return this.instance.post(`events?access_token=${access_token}`, formData).then((response) => {
                dispatch(this.getAllEvents(access_token, navigation, 0));
                return response
            })
            // .catch((e) =>
            //     dispatch({ type: eventsTypes.CREATE_EVENT_FAIL })
            // )


        }

    }

    eventNewsFeed=()=>{
        return (dispatch, getState) => {
           

            dispatch({ type: eventsTypes.EVENT_NEWS_FEED, moreData })
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('type', type);
            // formData.append('limit', dataType == 'firstTimeLoadData' ? 9 : 9);
            formData.append('limit', dataType == 'firstTimeLoadData' ? 40 : 20);
            moreData ? formData.append('after_post_id', getState()?.events?.eventNewsFeed[getState()?.events?.eventNewsFeed?.length - 2]?.post_id) : null;
            this.instance.post(`posts?access_token=${access_token}`, formData).then(async (response) => {
                dispatch({ type: eventsTypes.EVENT_NEWS_FEED_SUCCESSFUL, payload: response?.data?.data, dataType })
            }).catch({ type: eventsTypes.EVENT_NEWS_FEED_FAIL })
        };
    }

    createEvent = (access_token, formData, navigation) => {
        return async dispatch => {
            dispatch({ type: eventsTypes.CREATE_EVENT_LOADER })
            this.instance.post(`create-event?access_token=${access_token}`, formData).then((response) => {
                const {data} = response
                dispatch(this.getAllEvents(access_token, navigation, 1));
            }).catch((e) =>
                dispatch({ type: eventsTypes.CREATE_EVENT_FAIL })
            )


        }
    }
    editEvent = (access_token, formData, navigation) => {
        return async dispatch => {
            dispatch({ type: eventsTypes.CREATE_EVENT_LOADER })
            this.instance.post(`events?access_token=${access_token}`, formData).then((response) => {
                dispatch(this.getAllEvents(access_token, navigation, 2));
            }).catch((e) =>
                dispatch({ type: eventsTypes.CREATE_EVENT_FAIL })
            )

        }

    }
    getAllEvents = (access_token, navigation, stack) => {
        return async dispatch => {
            dispatch(petOwnerNewsFeed(access_token, 'get_news_feed', false, 'firstTimeLoadData'))
            const formData = new FormData();
            formData.append('server_key', server_key);
            formData.append('fetch', 'events,my_events,going_events,invited_events,interested_events,past_events');
            formData.append('limit', 10);
            this.instance.post(`get-events?access_token=${access_token}`, formData).then((response) => {
                const { data } = response;
                let obj = {
                    allEvents: data.events,
                    myEvents: data.my_events,
                    pastEvents: data?.past_events ?? [],
                    InterestedEvents: data.interested_events,
                    InvitedEvents: data.invited_events,
                    GoingEvents: data.going_events
                }
                dispatch({ type: eventsTypes.CREATE_EVENT_SUCCESSFUL, event: obj });
                navigation.pop(stack);
            }).catch((e) =>
                dispatch({ type: eventsTypes.CREATE_EVENT_FAIL })

            )



        }

    }
}

var petMyPalEventsApiService = new PetMyPalEventsApiService();
export {
    petMyPalEventsApiService,

}