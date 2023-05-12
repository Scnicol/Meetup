import { useState, useEffect } from 'react';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails, deleteGroup, updateGroup } from '../../store/groups';
import { getEventsByGroupId } from '../../store/events';
import Events from '../Events';
import EventsList from '../Events/EventsList';
import { imageDisplay } from '../../helperFunctions';


const GroupDetail = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId]);
    const user = useSelector(state => state.session.user)
    const events = Object.values(useSelector(state => { return state.events }));
    const groupEvents = events.filter(event => event.groupId == groupId);

    useEffect(() => {
        dispatch(getEventsByGroupId(groupId));
        dispatch(getGroupDetails(groupId));
    }, [dispatch]);


    if (!group || !group.name || !group.Organizer) {
        return null;
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        let group;
        group = await dispatch(deleteGroup(groupId));

        if (group) {
            history.push(`/groups`)
        }
    }

    function ActionButtons() {
        if (!user) return null;
        if (user.id === group.Organizer.id) {
            return (
                <div>
                    <button className='secondary' onClick={() => history.push(`/groups/${groupId}/events/new`)}>
                        Create Event
                    </button>
                    <button className='secondary' onClick={() => history.push(`/groups/${groupId}/edit`)}>
                        Update
                    </button>
                    {/*TODO Delete should open a modal which them confirms if you want to delete, not delete the group with this button */}
                    <button className='secondary' onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            );
        }
        return (
            <button className='main' onClick={() => alert("Feature Coming Soon...")}>Join this Group</button>
        );
    }

    return (
        <div>
            <NavLink to={`/groups`}>
                {"<groups"}
            </NavLink>
            <div>
                <img src={imageDisplay(group?.GroupImages)} />

                <h2>
                    Group Name: {group.name}
                </h2>
                <p>{group.city}, {group.state}</p>
                <p>
                    {groupEvents.length} Events · {group.private ? 'Private' : 'Public'}
                </p>
                <p>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</p>
                <ActionButtons />
                <h2>Organizer</h2>
                <p>{group.Organizer.firstName} {group.Organizer.lastName}</p>
                <h2>What we're about</h2>
                <p>{group.about}</p>
                <EventsList events={groupEvents}/>
            </div>
        </div>
    )
}

export default GroupDetail;
