import types from '../actions/types';

const initialState = {
  loggedIn: false,
  isFetching: false,
  hasError: false,
  errorMessage: '',
  userInfo:false,
  user: null,
  confirmResult:null,
  starting:false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_START: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.LOGIN_EDIT: {
      const { user } = action;
      return {
        ...state,
        userInfo: true,
        user,
      };
    }
    case types.APP_INIT:
    return {
      ...state,
      starting: true,
    };
    case types.LOGIN_FINISHED: {
      const { user } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        user,
      };
    }

    case types.LOGIN_ERROR: {
        const { error } = action;
        return {
          ...state,
          isFetching: false,
          loggedIn: false,
          hasError: true,
          user: null,
          errorMessage: error.message,
        };
      }
      
    case types.LOGIN_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
        hasError: true,
        userInfo:false,
        user: null,
        errorMessage: error.message,
      };
    }
    case types.LOGOUT_START: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case types.SAVE_USER: {
      const { user } = action;
      return {
        ...state,
        user
      }
    }

    case types.LOGOUT_FINISHED: {
      return {
        ...initialState,
        loggedIn: false,
        isFetching: false,
        hasError: false,
        errorMessage: '',
        userInfo:false,
        user: null,
        confirmResult:null,
        starting:false
      };
    }
    case types.LOGOUT_ERROR: {
      const { error } = action;
      return {
        ...state,
        isFetching: false,
        hasError: true,

        errorMessage: error,
      };
    }
    default: {
      return state;
    }
  }
};