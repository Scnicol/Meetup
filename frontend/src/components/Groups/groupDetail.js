import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails, deleteGroup, updateGroup } from '../../store/groups';
import { getEventsByGroupId } from '../../store/events';
import Events from '../Events';


const GroupDetail = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const group = useSelector(state => state.groups[id]);
    const user = useSelector(state => state.session.user)
    const events = Object.values(useSelector(state => { return state.events }));
    //take the events that we want by the groupId being provided by the params and then map over those events

    useEffect(() => {
        dispatch(getEventsByGroupId(id))
        dispatch(getGroupDetails(id));
    }, [dispatch]);

    if (!group) {
        return null;
    }

    let upcomingEvents = 'Upcoming Events'
    if (events.length === 0) upcomingEvents = 'No Upcoming Events'



    return (
        <div>
            <h2>
                Group Name: {group.name}
            </h2>
            <button onClick={() => history.push(`/groups/${id}/events/new`)}>
                Create Event
            </button>
            <button onClick={() => history.push(`/groups/${id}/edit`)}>
                Update
            </button>
            <button onClick={() => dispatch(deleteGroup(id))}>
                Delete
            </button>
            <h2>Organizer</h2>
            <p>{user.username} User</p>
            <h2>What we're about</h2>
            <p>{group.about}</p>
            <h2>{upcomingEvents}</h2>
            <ul>
                {events.map(event => (
                    <Events
                    id={id}
                    key={event.id}/>
                ))}
            </ul>
        </div>
    )
}

export default GroupDetail;
