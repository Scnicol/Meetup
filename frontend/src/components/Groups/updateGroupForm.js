import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateGroup } from '../../store/groups';
import { getGroupDetails } from '../../store/groups';
import GroupForm from './GroupForm';


function UpdateGroupForm({ hideForm }) {

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupDetails(id))
    }, [dispatch])

    const group = useSelector(state => state.groups[id])

    if (!group) return null;

    function submitAction(group) {
        const newGroup = {...group, id: id}
        console.log(newGroup, 'newgroup inside submitAction')
        return updateGroup(newGroup);
    }
    

    return (
        <GroupForm group={group} formType="Update" submitAction={submitAction} hideForm={hideForm}/>
    );
}

export default UpdateGroupForm;
