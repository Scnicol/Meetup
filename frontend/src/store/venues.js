import { csrfFetch } from "./csrf";
//______________ACTION_TYPES________________
const LOAD_VENUES = 'venues/LOAD'


//_______________ACTIONS_____________________
const loadVenues = (venues) => ({
    type: LOAD_VENUES,
    venues
});

//_______________THUNK_ACTIONS_________________
export const getVenues = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/venues`);

    if (response.ok) {
        const venues = await response.json();
        dispatch(loadVenues(venues));
        return venues;
    }
}

//________________INITIAL_STATE__________________
const initialState = {};

//_____________VENUES_REDUCER___________________
const venueReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case LOAD_VENUES:
            action.venues.Venues.forEach(venue => {
                newState[venue.id] = venue
            });
            return {
                ...newState,
                ...state
            }
        default:
            return state;
    }
}

export default venueReducer;
