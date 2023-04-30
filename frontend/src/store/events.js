
//__________ACTION_TYPES____________
const LOAD = 'events/LOAD'


//___________ACTIONS_________________
const load = (list) => ({
    type: LOAD,
    list
});

//__________THUNK_ACTIONS______________
export const getEvents = () => async dispatch => {
    const response = await fetch(`/api/events`);

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list.Events));
        return list;
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

//________EVENTS_REDUCER_________________
const eventReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case LOAD:
            action.list.forEach(event => {
                newState[event.id] = event;
            });
            return {
                ...newState,
                ...state,
            }
        default:
            return state;
    }
}

export default eventReducer;
