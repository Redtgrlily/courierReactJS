import { FETCH_ORDERS_SUCCESS, FETCH_ORDERS_ERROR, COMPLETE_ORDER } from '../actions/index'

const orderReducer = (state=null, action) => {
  switch (action.type) {
    case FETCH_ORDERS_SUCCESS:
        return action.orders.data;
    case FETCH_ORDERS_ERROR:
        return state;
    case COMPLETE_ORDER:
        return state.map(function(order) {
            if (order._id === action.orderId) {
                order.completed = true;
                return order;
            }
            return order;
        })
    default:
        return state;
  }
}

module.exports = { orderReducer }
