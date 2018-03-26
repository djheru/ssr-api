import actions from '../actions';

export default function (state = null, action) {
  switch (action.type) {
    case actions.FETCH_TODOS.SUCCESS:
      return fetchTodosReducer(action);
    default:
      return state;
  }
}

export const fetchTodosReducer = ({ payload = [] }) => payload;
