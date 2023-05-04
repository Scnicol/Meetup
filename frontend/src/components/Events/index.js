import React from 'react';
import { getEventsByGroupId } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Events({id}) {
    const dispatch = useDispatch();
    const events = Object.values(useSelector(state => { return state.events }));
    const groupEvents = events.filter(event => event.groupId == id);

    useEffect(() => {
        dispatch(getEventsByGroupId(id));
    }, [dispatch]);

    return (
        <main>
            <ul>
                {groupEvents.map((event) => (
                    <div>
                        <p>{event.startDate.slice(0, 10)}</p>
                        {/* <NavLink to={`/`} */}
                        <h3>{event.name}</h3>
                        <p>{event.Venue.city}, {event.Venue.state}</p>
                        <p>{event.description}</p>
                    </div>
                ))}
            </ul>
        </main>
    )
}

export default Events;
