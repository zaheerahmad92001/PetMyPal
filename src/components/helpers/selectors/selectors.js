import { createSelector } from 'reselect';

export const rootCommon = (state) => state;

export const getPersistToken = createSelector(rootCommon, (data) => {

    return data.user.token;
});

export const getCreateEventLoader = createSelector(rootCommon, (data) => {
   
    return data.events.createEventLoader;
})