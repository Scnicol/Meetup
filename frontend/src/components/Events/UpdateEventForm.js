import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateEvent } from '../../store/events';
import { getEventDetails } from '../../store/events';
import { getVenues } from '../../store/venues';
import EventForm from './EventForm';


function UpdateEventForm({ hideForm }) {

    const { eventId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEventDetails(eventId));
    }, [dispatch])

    const events = useSelector(state => state.events[eventId])
    console.log(events);
    if (!events) return (
        <h1>LOADING EVENT</h1>
    );

    //const event =



    function submitAction(events) {
        const newGroup = {...events, id: eventId}
        return updateEvent(newGroup);
    }


    return (
        <EventForm event={events} formType="Update" submitAction={submitAction} hideForm={hideForm}/>
    );
}

export default UpdateEventForm;
