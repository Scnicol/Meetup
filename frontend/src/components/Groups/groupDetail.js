import { useState, useEffect } from 'react';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails, deleteGroup, updateGroup } from '../../store/groups';
import { getEventsByGroupId } from '../../store/events';
import Events from '../Events';


const GroupDetail = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user)
    const events = Object.values(useSelector(state => { return state.events }));
    //take the events that we want by the groupId being provided by the params and then map over those events

    useEffect(() => {
        dispatch(getEventsByGroupId(groupId));
        dispatch(getGroupDetails(groupId));
    }, [dispatch]);

    if (!group.name || !group.Organizer) {
        return null;
    }

    let upcomingEvents = 'Upcoming Events'
    if (events.length === 0) upcomingEvents = 'No Upcoming Events'

    const handleDelete = async (e) => {
        e.preventDefault();

        let group;
        group = await dispatch(deleteGroup(groupId));

        if (group) {
            history.push(`/groups`)
        }
    }

    function ActionButtons() {
        if(!user) return null;
        if (user.id === group.Organizer.id) {
            return (
                <div>
                    <button onClick={() => history.push(`/groups/${groupId}/events/new`)}>
                        Create Event
                    </button>
                    <button onClick={() => history.push(`/groups/${groupId}/edit`)}>
                        Update
                    </button>
                    <button onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            );
        }
        return (
            <button onClick={() => alert("Feature Coming Soon...")}>Join this Group</button>
        );
    }


    return (
        <div>
            <NavLink to={`/groups`}>
                {"<groups"}
            </NavLink>
            <div>
                <img src="img.png" />

                <h2>
                    Group Name: {group.name}
                </h2>
                <p>{group.city}, {group.state}</p>
                <p>
                    ## Events · {group.private ? 'Private' : 'Public'}
                </p>
                <p>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</p>
                <ActionButtons />
                <h2>Organizer</h2>
                <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                <h2>What we're about</h2>
                <p>{group.about}</p>
                <h2>{upcomingEvents}</h2>
                <ul>
                    <Events groupId={groupId} />
                </ul>
            </div>
        </div>
    )
}

export default GroupDetail;
