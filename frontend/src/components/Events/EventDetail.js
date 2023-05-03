import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getEventDetails } from '../../store/events';

const EventDetails = ({ eventId }) => {
    const dispatch = useDispatch();
    dispatch(getEventDetails(eventId));

    
}

export default EventDetails;
