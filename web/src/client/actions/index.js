const actions = {};

actions.FETCH_CURRENT_USER = {
  REQUEST: 'fetch-current-user-request',
  SUCCESS: 'fetch-current-user-success',
  FAILURE: 'fetch-current-user-failure'
};
export const fetchCurrentUser = () => async (dispatch, getState, httpClient) => {
  try {
    const type = actions.FETCH_CURRENT_USER.SUCCESS;
    const { data: payload } = await httpClient.get('/user');
    dispatch({ type, payload });
  } catch (e) {
    dispatch({
      type: actions.FETCH_CURRENT_USER.FAILURE,
      payload: e
    });
  }
};

actions.FETCH_TODOS = {
  REQUEST: 'fetch-todos-request',
  SUCCESS: 'fetch-todos-success',
  FAILURE: 'fetch-todos-failure'
};
export const fetchTodos = () => async (dispatch, getState, httpClient) => {
  try {
    const type = actions.FETCH_TODOS.SUCCESS;
    const { data: payload } = await httpClient.get('/todo');
    dispatch({ type, payload });
  } catch (e) {
    dispatch({
      type: actions.FETCH_TODOS.FAILURE,
      payload: e
    });
  }
};

export default actions;
