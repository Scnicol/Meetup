import React from 'react';
import { getEventsByGroupId } from '../../store/events';
import { getEvents } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EventsList from './EventsList';
import './Events.css'


function Events({ groupId }) {
    const history = useHistory();
    const dispatch = useDispatch();
    console.log('events.index.js')
    useEffect(() => {
        console.log('inside the useEffect Get Events dispatch')
        dispatch(getEvents());
    }, [dispatch]);
    const events = Object.values(useSelector(state => { return state.events }));
    
    if (events.length === 0) return (
        null
    );

    return (
        <main>
            <div className='horizontal-alignment navigation-links'>
            <NavLink className='selected-link' to={`/events`} >
                <h2>Events</h2>
            </NavLink>
            <NavLink className='unselected-link' to={`/groups`}>
                <h2>Groups</h2>
            </NavLink>
            </div>
            <caption className='horizontal-alignment'>Events in Meetup</caption>
            <EventsList events={events} />
        </main>
    )

}
export default Events;
