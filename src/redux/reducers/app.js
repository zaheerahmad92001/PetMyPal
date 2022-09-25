import { APP } from '../actions/types';

const initialState = {
    root: null,
    starting: true,
    ready: false,
    inactive: false,
    background: false,
    db: null
};


export default function app(state = initialState, action) {
    switch (action.type) {
      
        case APP.START:
            return {
                ...state,
                root: action.root
            };
        case APP.INIT:
            return {
                ...state,
                ready: false,
                starting: true
            };
        case APP.READY:
            return {
                ...state,
                ready: true,
                starting: false
            };
        default:
            return state;
    }
}
