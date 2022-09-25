import types from '../actions/types';
const intialState = {
    is_T_Gifted: '',
    product: '',
    cartData: '',
    orderNature: '',
    isFree_order: '',
}

export default (state = intialState, action) => {
    switch (action.type) {
        case types.GIFT_TAG:
            return {
                ...state,
                is_T_Gifted: action.payload
            }
        case types.PRODUCT:
            return {
                ...state,
                product: action.payload
            }
        case types.CART_DATA:
            return {
                ...state,
                cartData: action.payload
            }
        case types.ORDER_NATURE:
            return {
                ...state,
                orderNature: action.payload
            }
        case types.IS_FREE_ORDER:
            return {
                ...state,
                isFree_order: action.payload
            }

        default: {
            return state;
        }
    }
};