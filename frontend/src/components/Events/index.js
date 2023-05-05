import React from 'react';
import { getEventsByGroupId } from '../../store/events';
import { getEvents } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Events({ groupId }) {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);
    const events = Object.values(useSelector(state => { return state.events }));

    if (events.length === 0) return (
        <h1>LOADING EVENTS</h1>
    )

    if (groupId) {
        const groupEvents = events.filter(event => event.groupId == groupId);
        return (
            <main>
                <ul>
                    {groupEvents.map((event) => (
                        <div>
                            <p>{event.startDate.slice(0, 10)}</p>
                            <NavLink to={`/events/${parseInt(event.id)}`}>
                                <h3>{event.name}</h3>
                            </NavLink>
                            <p>{event.Venue.city}, {event.Venue.state}</p>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </ul>
            </main>
        )
    } else {
        return (
            <main>
                <NavLink to={`/events`} >
                    Events
                </NavLink>
                <NavLink to={`/groups`}>
                    Groups
                </NavLink>
                <ul>
                    {events.map((event) =>
                        <div>
                            <p>{event.startDate.slice(0, 10)}</p>
                            <NavLink to={`/events/${parseInt(event.id)}`}>
                                <h3>{event.name}</h3>
                            </NavLink>
                            <p>{event.Venue.city}, {event.Venue.state}</p>
                            <p>{event.description}</p>
                        </div>
                    )}
                </ul>
            </main>
        )
    }
}
export default Events;
