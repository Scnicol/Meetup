import { csrfFetch } from "./csrf"

//__________ACTION_TYPES____________
const LOAD_EVENTS = 'events/LOAD'
const CREATE_EVENT = 'Events/CREATE_Event'
const UPDATE_EVENT = 'Events/UPDATE_Event'
const DELETE_EVENT = 'Events/DELETE_Event'
const GET_EVENT = 'Events/GET_Event'
const GET_EVENTS_BY_GROUPID = 'Events/GET_EVENT_BY_GROUPID'


//___________ACTIONS_________________
const loadEvents = (list) => ({
    type: LOAD_EVENTS,
    list
});

const getEvent = (event) => ({
    type: GET_EVENT,
    event,
})

const newEvent = (event) => ({
    type: CREATE_EVENT,
    event,
})

const changeEvent = (event) => ({
    type: UPDATE_EVENT,
    event
})

const removeEvent = (eventId) => ({
    type: DELETE_EVENT,
    eventId,
})

const eventByGroupId = (events) => ({

    type: GET_EVENTS_BY_GROUPID,
    events,
})

//__________THUNK_ACTIONS______________
export const getEvents = () => async dispatch => {
    const response = await fetch(`/api/events`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadEvents(list.Events));
        return list;
    }
}

export const getEventsByGroupId = (groupId) => async dispatch => {
    const response = await fetch(`/api/groups/${groupId}/events`);
    if (response.ok) {
        const events = await response.json();
        dispatch(eventByGroupId(events));
        return events;
    }
}

export const getEventDetails = (eventId) => async (dispatch) => {
    const response = await fetch(`/api/events/${eventId}`);

    if (response.ok) {
        const event = await response.json();
        dispatch(getEvent(event));
        return event;
    }
}

export const createEvent = (payload, groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const event = await response.json();
        dispatch(newEvent(event));
        return event;
    }
}


export const updateEvent = (data) => async dispatch => {
    const response = await csrfFetch(`/api/events/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const Event = await response.json();
        dispatch(changeEvent(Event));
        return Event;
    }
}

export const deleteEvent = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const deletedEvent = await response.json();
        dispatch(removeEvent(eventId));
        return deletedEvent;
    }
}

//__________CREATE_INITIAL_STATE__________
const initialState = {};

//________EVENTS_REDUCER_________________
const eventReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case LOAD_EVENTS:
            action.list.forEach(event => {
                newState[event.id] = event;
            });
            return {
                ...newState,
            }
        case CREATE_EVENT:
            newState = { ...state, [action.event.id]: action.event }
            return newState;
        case UPDATE_EVENT:
            newState = {
                ...state, [action.event.id]: {
                    ...state[action.event.id],
                    ...action.event
                }
            }
            return newState;
        case GET_EVENT:
            newState = { ...state, [action.event.id]: action.event }
            return newState;
        case GET_EVENTS_BY_GROUPID:

            action.events.Events.forEach(event => {
                newState[event.id] = event;
            });
            return {
                ...newState,
                ...state
            }
        case DELETE_EVENT:
            newState = { ...state };
            delete newState[action.eventId];
            return newState;
        default:
            return state;
    }
}

export default eventReducer;
