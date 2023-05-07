import React from 'react';
import { NavLink } from 'react-router-dom';

function EventsList({ events }) {

    return (
        <ul>
            {events.map((event) => (
                <div>
                    <NavLink to={`/events/${parseInt(event.id)}`}>
                        <h3>{event.name}</h3>
                    </NavLink>
                    <p>{event.startDate}</p>
                    <p>{event.Venue.city}, {event.Venue.state}</p>
                    <p>{event.description}</p>
                </div>
            ))}
        </ul>
    )
}

export default EventsList;
