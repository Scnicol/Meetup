import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails } from '../../store/groups';


const GroupDetail = () => {
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
            Group Name: {group.name}
        </div>
    )
}

export default GroupDetail;
