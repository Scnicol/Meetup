import React from 'react';
import { NavLink } from 'react-router-dom';

function EventsList({ events }) {

    //Arrays for past and future events
    let pastEventsArr = [];
    let upcomingEventsArr = [];

    //Sorting Event by Date
    const sortedEventsbyDate = events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate)
    });

    const currentDate = new Date();
    sortedEventsbyDate.forEach((event) => {
        if (new Date(event.startDate) < currentDate) pastEventsArr.push(event)
        else upcomingEventsArr.push(event)
    });

    const EventsSection = ({events}) => {

        return (
            <ul>
                {events.map((event) => (
                    <div key={event.id}>
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

    return (
        <div>
            <h2>{upcomingEventsArr.length ? 'Upcoming Events' : 'No Upcoming Events'}</h2>
            <EventsSection events={upcomingEventsArr} />
            <h2>{pastEventsArr.length ? 'Past Events' : 'No Past Events'}</h2>
            <EventsSection events={pastEventsArr} />
        </div>
    )
}

export default EventsList;
