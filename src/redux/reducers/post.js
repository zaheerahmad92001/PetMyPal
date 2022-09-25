import types from '../actions/types';

const initialState = {
  id:'',
  beforePostId:undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case types.SAVE_POST_ID: {
      return {
        id: action.id,
      };
    }

    case types.BEFORE_POST_ID:{
        return {
          ...state,
          beforePostId: action.payload
        };
    }

    default: {
      return state;
    }
  }
};
