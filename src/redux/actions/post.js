import types from './types';

export const savePostId = id => ({
  type: types.SAVE_POST_ID,
  id,
});

export const saveBeforePostId=(data)=>({
  type:types.BEFORE_POST_ID,
  payload:data
})
