import actions from '../actions';

export default function (state = null, action) {
  console.log(action);
  switch (action.type) {
    case actions.FETCH_CURRENT_USER.SUCCESS:
      return fetchCurrentUserReducer(state, action);
    case actions.FETCH_CURRENT_USER.FAILURE:
      return false;
    default:
      return state;
  }
}

export const fetchCurrentUserReducer = (state = {}, { payload }) => {
  console.log('ohai', state, payload);
  return ((payload) ? payload[0] : false);
};

