import types from './types';

export const savePets = pets => ({
  type: types.SAVE_PETS,
  pets,
});

export const pet_Profile=(data)=>({
  type:types.PET_PROFILE,
  payload:data

})

// export const pet_Birthday=(data)=>({
//   type:types.PET_BIRTHDAY,
//   payload:data
// })
