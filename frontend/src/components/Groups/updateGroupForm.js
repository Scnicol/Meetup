import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateGroup } from '../../store/groups';
import { getGroupDetails } from '../../store/groups';
import GroupForm from './GroupForm';


function UpdateGroupForm({ hideForm }) {

    const { groupId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupDetails(groupId))
    }, [dispatch])

    const group = useSelector(state => state.groups[groupId])

    if (!group) return null;


    return (
        <GroupForm group={group} formTitle="Update this" formSubmit="Update" submitAction={updateGroup} hideForm={hideForm}/>
    );
}

export default UpdateGroupForm;
