import React from 'react';
import { getEventsByGroupId } from '../../store/events';
import { getEvents } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EventsList from './EventsList';


function Events({ groupId }) {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);
    const events = Object.values(useSelector(state => { return state.events }));

    if (events.length === 0) return (
        null
    );

    return (
        <main>
            <NavLink to={`/events`} >
                Events
            </NavLink>
            <NavLink to={`/groups`}>
                Groups
            </NavLink>
            <EventsList events={events} />
        </main>
    )

}
export default Events;
