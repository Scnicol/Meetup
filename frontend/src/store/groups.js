
//__________ACTION_TYPES____________
const LOAD = 'groups/LOAD'
const CREATE_GROUP = 'groups/CREATE_GROUP'
const UPDATE_GROUP = 'groups/UPDATE_GROUP'
const DELETE_GROUP = 'groups/DELETE_GROUP'


//___________ACTIONS_________________
const load = (list) => ({
    type: LOAD,
    list,
});

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

export const createGroup = (payload) => async dispatch => {
    const response = await fetch(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const group = await response.json();
        dispatch(newGroup(payload));
        return group;
    }
}

export const updateGroup = data => async dispatch => {
    const response = await fetch(`/api/groups/${data.id}`, {
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


//__________CREATE_INITIAL_STATE__________
const initialState = {};

//_____________LIST_SORTER________________
// const sortList = (list) => {
//     return list.sort((groupA, groupB) => {
//         return groupA.
//     })
// }

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
            }
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
        default:
            return state;
    }
}

export default groupReducer;
