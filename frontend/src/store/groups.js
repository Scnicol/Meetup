import { csrfFetch } from "./csrf"
//__________ACTION_TYPES____________
const LOAD = 'groups/LOAD'
const CREATE_GROUP = 'groups/CREATE_GROUP'
const UPDATE_GROUP = 'groups/UPDATE_GROUP'
const DELETE_GROUP = 'groups/DELETE_GROUP'
const GET_GROUP = 'groups/GET_GROUP'


//___________ACTIONS_________________
const load = (list) => ({
    type: LOAD,
    list,
});

const getGroup = (group) => ({
    type: GET_GROUP,
    group,
})

const newGroup = (group) => ({
    type: CREATE_GROUP,
    group,
})

const changeGroup = (group) => ({
    type: UPDATE_GROUP,
    group
})

const removeGroup = (groupId) => ({
    type: DELETE_GROUP,
    groupId,
})

//__________THUNK_ACTIONS______________
export const getGroups = () => async dispatch => {
    const response = await fetch(`/api/groups`);

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list.Groups));
        return list;
    }
}

export const getGroupDetails = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`);

    if (response.ok) {
        const group = await response.json();
        dispatch(getGroup(group));
        return group;
    }
}

export const createGroup = (payload, imageUrl) => async dispatch => {

    console.log(payload, imageUrl)
    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let group;
    if (response.ok) {
        group = await response.json();
        dispatch(newGroup(group));

        if (imageUrl) {
            const url = {url: imageUrl};
            await csrfFetch(`/api/groups/${group.id}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(url)
            });
        }

        return group;
    }



}

export const updateGroup = (data) => async dispatch => {

    const response = await csrfFetch(`/api/groups/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(changeGroup(group));
        return group;
    }
}

export const deleteGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const deletedGroup = await response.json();
        dispatch(removeGroup(groupId));
        return deletedGroup;
    }
}


//__________CREATE_INITIAL_STATE__________
const initialState = {};

//________GROUPS_REDUCER_________________
const groupReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case LOAD:
            action.list.forEach(group => {
                newState[group.id] = group;
            });
            return {
                ...newState,
                ...state,
            };
        //Todo: refactor code to fit with get_group because they are the same
        case CREATE_GROUP:
            newState = { ...state, [action.group.id]: action.group }
            return newState;
        case UPDATE_GROUP:
            newState = {
                ...state, [action.group.id]: {
                    ...state[action.group.id],
                    ...action.group
                }
            }
            return newState;
        //Todo: refactor code to fit with create_group because they are the same
        case GET_GROUP:
            newState = { ...state, [action.group.id]: action.group }
            return newState;
        case DELETE_GROUP:
            newState = { ...state };
            delete newState[action.groupId];
            return newState;

        default:
            return state;
    }
}

export default groupReducer;
