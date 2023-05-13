import { useState, useEffect } from 'react';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventDetails } from '../../store/events';
import { getGroups } from '../../store/groups';
import { deleteEvent } from '../../store/events';
import { formattedDateTime, imageDisplay } from '../../helperFunctions';
import { getGroupDetails } from '../../store/groups';
import OpenModalButton from '../OpenModalButton';
import EventDeleteModal from './EventDeleteModal';



const EventDetails = () => {
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector(state => state.events[eventId]);
    const session = useSelector(state => state.session);
    const group = useSelector(state => state.groups[event?.groupId]);

    useEffect(() => {
        if (isLoading) {
            dispatch(getGroupDetails(event.groupId))
        }
    }, [isLoading] )

    useEffect(() => {
        dispatch(getEventDetails(eventId)).then(() => setIsLoading(true));
    }, [dispatch]);




    if (!event || !group) return (
        <h1>No Events</h1>
    );

    console.log(group.GroupImages[0].url)
    return (
        <div>
            <NavLink to={`/events`}>
                {'<events'}
            </NavLink>

            <div>
                <h1>{event.name}</h1>
                <caption className='horizontal-alignment'>Hosted by: {group.Organizer.firstName} {group.Organizer.lastName}</caption>
                <div className='container-events'>
                    <div>
                        <img className='image-styling-detail' src={imageDisplay(event.EventImages)} />
                    </div>
                    <div>
                        <div className='container-events info-container'>
                            <div >
                                <img className='group-image-styling' src={imageDisplay(group.GroupImages)} />
                            </div>
                            <div>
                                <h3>{group.name}</h3>
                                <p>{group.private ? "Private" : "Public"}</p>
                            </div>
                        </div>
                        <div className='info-container description-styling'>
                            <img className='clock-image' src='https://cdn-icons-png.flaticon.com/512/4305/4305432.png' />
                            <div>
                                <p>
                                    Start {formattedDateTime(event.startDate)}
                                </p>
                                <p>
                                    End {formattedDateTime(event.endDate)}
                                </p>
                            </div>
                            <p>${event.price}</p>
                            <p>{event.type}</p>
                            <button className='secondary description-styling' onClick={(() => alert('Feature coming soon'))}>Update Event</button>
                            <OpenModalButton
                                className='secondary description-styling'
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
