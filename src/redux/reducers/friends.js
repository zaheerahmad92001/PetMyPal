const initialState = {
  friends: {},
};

export default (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_FRIENDS': {
      const {friends} = action;
      return {
        friends: friends,
      };
    }
    default: {
      return state;
    }
  }
};
