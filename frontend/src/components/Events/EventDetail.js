import { useState, useEffect } from 'react';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventDetails } from '../../store/events';
import { getGroups } from '../../store/groups';
import { deleteEvent } from '../../store/events';
import { formattedDateTime, imageDisplay } from '../../helperFunctions';



const EventDetails = () => {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector(state => state.events[eventId]);
    const session = useSelector(state => state.session);
    const group = useSelector(state => state.groups[event?.groupId]);

    useEffect(() => {
        dispatch(getEventDetails(eventId));
        dispatch(getGroups())
    }, [dispatch]);

    if (!event || !group) return (
        <h1>No Events</h1>
    );

    const handleDelete = async (e) => {
        e.preventDefault();

        let event;
        event = await dispatch(deleteEvent(eventId));

        if (event) {
            history.push(`/groups/${event.groupId}`)
        }
    }
    console.log(group);

    return (
        <div>
            <NavLink to={`/events`}>
                {'<events'}
            </NavLink>
            <div>
                <img src={imageDisplay(group.previewImage)} />
                <h3>{group.name}</h3>
                <p>{group.private ? "Private" : "Public"}</p>
            </div>
            <div>
                <h1>{event.name}</h1>
                <img src={imageDisplay(event.EventImages)} />
                <p>Hosted by: {session.user.firstName} {session.user.lastName}</p>
                <div>
                    <p>
                        <img src='https://cdn-icons-png.flaticon.com/512/4305/4305432.png' />
                        Start {formattedDateTime(event.startDate)}
                    </p>
                    <p>End {formattedDateTime(event.endDate)}</p>
                </div>
                <p>${event.price}</p>
                <p>{event.type}</p>
                <h2>Details</h2>
                <p>{event.description}</p>
                <button className='' onClick={(() => alert('Feature coming soon'))}>Update Event</button>
                <button className='' onClick={handleDelete}>
                    Delete Event
                </button>
            </div>
        </div>
    )
}

export default EventDetails;
