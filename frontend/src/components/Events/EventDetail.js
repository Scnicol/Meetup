import { useState, useEffect } from 'react';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventDetails } from '../../store/events';
import { getGroupDetails } from '../../store/groups';
import { getGroups } from '../../store/groups';


const EventDetails = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const events = Object.values(useSelector(state => state.events));
    const session = useSelector(state => state.session)
    const groups = Object.values(useSelector(state => state.groups))
    console.log(events, 'EVENTS')


    const filteredEvent = events.filter(event => event.id == eventId);
    const event = filteredEvent[0];
    console.log(event, 'EVENT')

    //Ask if there is a better way of doing this, it seems like a lot of code for just finding the group the event belongs to

    useEffect(() => {
        dispatch(getEventDetails(eventId));
        dispatch(getGroups())
    }, [dispatch])

    if (events.length == 0 || groups.length == 0) return (
        <h1>LOADING EVENT</h1>
    );

    const groupId = event.groupId;
    const group = groups.filter(group => group.id == groupId)
    const eventsGroup = group[0];

    //Ask how to get access to the useState for the value of isPrivate

    return (
        <div>
            <NavLink to={`/events`}>
                Back to Events
            </NavLink>
            <h1>{event.name}</h1>
            <p>Hosted by {session.user.firstName} {session.user.lastName}</p>
            <p>{eventsGroup.name} {}</p>
            <p>Start {event.startDate} End {event.endDate}</p>
            <p>{event.price}$</p>
            <p>{event.type}</p>
            <h2>Details</h2>
            <p>{event.description}</p>
        </div>
    )
}

export default EventDetails;
