//import the csrfFetch in order to get the token
import { csrfFetch } from './csrf'

//______ACTION_TYPES______________
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

//_________ACTIONS_________________

const setUser = (user) => {
    console.log('inside the setUser action', user)
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
    console.log('inside the Thunk login')
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const data = await response.json();
    console.log(data, 'DATA--------------------');
    dispatch(setUser(data));
    return data;
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
        console.log('inside SET_USER', action.payload)
        newState = Object.assign({}, state);
        console.log(newState, 'the newState inside SET_USER')
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
