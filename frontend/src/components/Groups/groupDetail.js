import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails, deleteGroup, updateGroup } from '../../store/groups';
import { getEventsByGroupId } from '../../store/events';
import Events from '../Events';


const GroupDetail = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { groupId } = useParams();
    console.log(groupId);
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user)
    const events = Object.values(useSelector(state => { return state.events }));
    //take the events that we want by the groupId being provided by the params and then map over those events

    useEffect(() => {
        dispatch(getEventsByGroupId(groupId));
        dispatch(getGroupDetails(groupId));
    }, [dispatch]);

    if (!group) {
        return null;
    }

    let upcomingEvents = 'Upcoming Events'
    if (events.length === 0) upcomingEvents = 'No Upcoming Events'

    const handleDelete = async(e) => {
        e.preventDefault();

        let group;
        group = await dispatch(deleteGroup(groupId));

        if (group) {
            history.push(`/groups`)
        }
    }

    //Todo add a history or link to your events being mapped to send yourself to the Event Details
    return (
        <div>
            <h2>
                Group Name: {group.name}
            </h2>
            <button onClick={() => history.push(`/groups/${groupId}/events/new`)}>
                Create Event
            </button>
            <button onClick={() => history.push(`/groups/${groupId}/edit`)}>
                Update
            </button>
            <button onClick={handleDelete}>
                Delete
            </button>
            <h2>Organizer</h2>
            <p>{user.username}</p>
            <h2>What we're about</h2>
            <p>{group.about}</p>
            <h2>{upcomingEvents}</h2>
            <ul>
                <Events groupId={groupId} />
            </ul>
        </div>
    )
}

export default GroupDetail;
