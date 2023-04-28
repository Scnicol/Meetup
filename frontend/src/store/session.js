//import the csrfFetch in order to get the token
import { csrfFetch } from './csrf'

//______ACTION_TYPES______________
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

//_________ACTIONS_________________

const setUser = (user) => {
    return {
      type: SET_USER,
      payload: user,
    };
  };

  const removeUser = () => {
    return {
      type: REMOVE_USER,
    };
  };


//________THUNK_ACTIONS_____________
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const data = await response.json();
    //console.log(data)
    dispatch(setUser(data));
    return response;
  };

  export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    //console.log(data, 'DATA inside the restoreUser Thunk')
    dispatch(setUser(data.user));
    return response;
  };

  export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data));
    return data;
  };

  export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };

//______CREATE_INTITAL_STATE_________
const initialState = {
    user: null
}

//______SESSION_REDUCER_______________
const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case SET_USER:
        newState = Object.assign({}, state);
        newState.user = action.payload;
        return newState;
      case REMOVE_USER:
        newState = Object.assign({}, state);
        newState.user = null;
        return newState;
      default:
        return state;
    }
  };

export default sessionReducer;
