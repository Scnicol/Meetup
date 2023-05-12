import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { deleteEvent } from '../../store/events';


const EventDeleteModal = ({ eventId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();


    const handleDelete = async (e) => {
        e.preventDefault();

        await dispatch(deleteEvent(eventId)).then(closeModal);
        history.push(`/events`)

    }

    return (
        <div>
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this event?</h3>
            <button onClick={(handleDelete)}>
                {'Yes (Delete Event)'}
            </button>
            <button onClick={closeModal}>
                {'No (Keep Event)'}
            </button>
        </div>
    )
}

export default EventDeleteModal;
