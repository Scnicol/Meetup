import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { deleteGroup } from '../../store/groups';


const GroupDeleteModal = ({ groupId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();


    const handleDelete = async (e) => {
        e.preventDefault();

        await dispatch(deleteGroup(groupId)).then(closeModal);
        history.push(`/groups`)

    }

    return (
        <div>
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this group?</h3>
            <button onClick={(handleDelete)}>
                {'Yes (Delete Group)'}
            </button>
            <button onClick={closeModal}>
                {'No (Keep Group)'}
            </button>
        </div>
    )
}

export default GroupDeleteModal;
