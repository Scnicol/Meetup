import { useState, useEffect } from 'react';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventDetails } from '../../store/events';
import { getGroups } from '../../store/groups';
import { deleteEvent } from '../../store/events';
import { formattedDateTime, imageDisplay } from '../../helperFunctions';
import OpenModalButton from '../OpenModalButton';
import EventDeleteModal from './EventDeleteModal';



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

    return (
        <div>
            <NavLink to={`/events`}>
                {'<events'}
            </NavLink>

            <div>
                <h1>{event.name}</h1>
                <caption className='horizontal-alignment'>Hosted by: {session.user.firstName} {session.user.lastName}</caption>
                <div className='info-container'>
                    <div>
                        <img src={imageDisplay(event.EventImages)} />
                    </div>
                    <div>
                        <div>
                            <img src={imageDisplay(group.previewImage)} />
                            <h3>{group.name}</h3>
                            <p>{group.private ? "Private" : "Public"}</p>
                        </div>
                        <div>
                            <img className='clock-image' src='https://cdn-icons-png.flaticon.com/512/4305/4305432.png' />
                            <p>
                                Start {formattedDateTime(event.startDate)}
                            </p>
                            <p>End {formattedDateTime(event.endDate)}</p>
                            <p>${event.price}</p>
                            <p>{event.type}</p>
                            <button className='secondary' onClick={(() => alert('Feature coming soon'))}>Update Event</button>
                            <OpenModalButton
                                className='secondary'
                                buttonText="Delete"
                                modalComponent={<EventDeleteModal eventId={eventId} />}
                            />
                        </div>
                    </div>
                    <div>
                        <h2>Details</h2>
                        <p>{event.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventDetails;
