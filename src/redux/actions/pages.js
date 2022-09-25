import {pagesTypes} from '../actions/types';
export const deletePageAction=(page_id)=>{
    return{
    type:pagesTypes.DELETE_PAGE,
    payload:page_id
}}