import React from 'react';
import { getEvents } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Events() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const { eventId } = useParams();
    const events = Object.values(useSelector(state => { return state.events }));
    useEffect(() => {

        dispatch(getEvents());
    }, [dispatch]);

    return (
        <main>
            <ul>
                {events.map((event) => (
                    <li>{event.name}</li>
                ))}
            </ul>
        </main>
    )
}

export default Events;
