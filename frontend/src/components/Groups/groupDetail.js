import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails, deleteGroup, updateGroup } from '../../store/groups';


const GroupDetail = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const group = useSelector(state => state.groups[id]);
    useEffect(() => {
        dispatch(getGroupDetails(id))
    }, [dispatch]);

    if (!group) {
        return null;
    }

    return (
        <div>
            <h2>
                Group Name: {group.name}
            </h2>
            <button onClick={() => history.push(`/groups/${id}/edit`)}>
                Update
            </button>
            <button onClick={() => dispatch(deleteGroup(id))}>
                Delete
            </button>
        </div>
    )
}

export default GroupDetail;
