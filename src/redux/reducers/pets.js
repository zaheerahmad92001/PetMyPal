import types from '../actions/types';

const intialState={
  pets:[],
  petsLoader:false,
  petProfile:'',
  // petBirthday:'',
}
export default (state = intialState, action) => {

  switch (action.type) {

    case types.FETCH_PETS:
      return{
        ...state,
        petsLoader:true
      }

    case types.SAVE_PETS: 
    let savePets=[];
    savePets = [{}, ...action.payload];
      return {
        ...state,
        pets:savePets,
        petsLoader:false
    }

    case types.PET_PROFILE :
      return{
        ...state,
        petProfile: action.payload
      }
    case types.GET_UPDATED_PET_DATA:
      
      let index = state.pets.findIndex((item) => item.user_id == action.payload.user_id);
      let updatedPets = state.pets;
      updatedPets[index] = action.payload;
      return { 
        ...state, 
        mypets: updatedPets
       }

  //  case types.PET_BIRTHDAY :
  //  return{
  //      ...state,
  //      petBirthday:action.payload 
  //  }

    default: {
      return state;
    }
  }
};
