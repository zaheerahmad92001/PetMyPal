import { groupTypes } from '../actions/types';
export const deleteGroupAction = (group_id) => {
    return {
        type: groupTypes.DELETE_GROUP,
        payload: group_id
    }
}

export const getPetsCategoryAction = (response) => {
    return {
        type: groupTypes.GET_PET_CATEGORY,
        payload: response

    }
}