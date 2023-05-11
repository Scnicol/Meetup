import React from 'react';
import { NavLink } from 'react-router-dom';
import { formattedDateTime, imageDisplay } from '../../helperFunctions';
import './Events.css'

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

    const EventsSection = ({ events }) => {

        return (
            <ul>
                {events.map((event) => (
                    <div key={event.id}>
                        <NavLink to={`/events/${parseInt(event.id)}`}>
                            <div className='horizontal-alignment image-info-spacing'>
                                <div className='image-info-spacing'>
                                    <img className='image-styling' src={imageDisplay(event.previewImage)} />
                                </div>
                                <div>
                                    <p>{formattedDateTime(event.startDate)}</p>
                                    <h3>{event.name}</h3>
                                    <p>{event.Venue.city}, {event.Venue.state}</p>

                                </div>
                            </div>
                            <div>
                                <p>{event.description}</p>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </ul>
        )
    }

    return (
        <div>
            <h3>{upcomingEventsArr.length ? `Upcoming Events (${upcomingEventsArr.length})` : 'No Upcoming Events'}</h3>
            <EventsSection events={upcomingEventsArr} />
            <h3>{pastEventsArr.length ? `Past Events (${pastEventsArr.length})` : 'No Past Events'}</h3>
            <EventsSection events={pastEventsArr} />
        </div>
    )
}

export default EventsList;
