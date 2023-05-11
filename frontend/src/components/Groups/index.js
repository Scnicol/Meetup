import React from 'react';
import { getGroups } from '../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEvents } from '../../store/events';
import { imageDisplay } from '../../helperFunctions';
import './group.css'

function Groups() {

    const dispatch = useDispatch();

    const groups = Object.values(useSelector(state => { return state.groups }));
    const events = Object.values(useSelector(state => state.events));

    useEffect(() => {
        dispatch(getEvents());
        dispatch(getGroups());
    }, [dispatch]);

    if (!groups) {
        return (
            <h2>Loading Groups</h2>
        )
    }

    return (
        <main>
            <div className='horizontal-alignment navigation-links'>
            <NavLink className='unselected-link' to={`/events`} >
                <h2>
                    Events
                </h2>
            </NavLink>
            <NavLink className='selected-link' to={`/groups`}>
                <h2>
                    Groups
                </h2>
            </NavLink>
            </div>
            <caption className='horizontal-alignment'>Groups in Meetup</caption>
            <ul>
                {groups.map((group) => {

                    const groupEvents = events.filter(event => event.Group.id == group.id);

                    return (
                        <NavLink to={`/groups/${group.id}`} key={group.id}>
                            <div>
                                <h2>
                                    {group.name}
                                </h2>
                                <img
                                className='image-styling'
                                    src={imageDisplay(group.previewImage)}
                                />
                                <h3>
                                    {group.city}, {group.state}
                                </h3>
                                <p>
                                    About: {group.about}
                                </p>
                                <h3>
                                    {groupEvents.length} Events · {group.private ? 'Private' : 'Public'}
                                </h3>
                            </div>
                            <hr />
                        </NavLink>
                    )
                })}

            </ul>
        </main>
    )
}

export default Groups;
