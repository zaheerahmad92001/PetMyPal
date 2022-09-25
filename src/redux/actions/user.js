import types from './types';

export const userEdit = (user) => ({
  /******zaheer ahmad change */
  type: types.USER_EDIT,
  payload:user
  // user,
});

export const userSave = user => ({
  /******zaheer ahmad change */
  type: types.USER_SAVE,
  payload:user
  // user,
});

export const saveWorkSpace = workspace => ({
  type: types.USER_WORKSPACE,
  workspace,
});

export const userRemove = () => ({
  type: types.REMOVE_USER,
});
export const showConfetti=()=>({
  type:types.SHOW_CONFETTI

})
export const followFollower=(data)=>({
  type:types.FOLLOWS_FOLLOWERS,
  payload:data

});

export const updatepPostShareCount=(id)=>{
  // console.log('updateShareCount call ', id)
  return{
    type:types.UPDATE_POST_SHARE_COUNT,
    payload:id
  }

}
export const persistToken=(token)=>{
  return{
  type:types.PERSIST_TOKEN,
  payload:token
  }
 
}






