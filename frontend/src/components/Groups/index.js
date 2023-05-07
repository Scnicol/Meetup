import React from 'react';
import { getGroups } from '../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Groups() {
    //Going to add a delete group dispatch here for specific group

    const dispatch = useDispatch();
    const { groupId } = useParams();
    const groups = Object.values(useSelector(state => { return state.groups }));
    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch]);

    if (!groups) {
        return (
            <h2>Loading Groups</h2>
        )
    }

    return (
        <main>
            <NavLink to={`/events`} >
                <h2>
                    Events
                </h2>
            </NavLink>
            <NavLink to={`/groups`}>
                <h2>
                    Groups
                </h2>
            </NavLink>
            <h1>Groups in Meetup</h1>
            <ul>
                {groups.map((group) => (

                    <NavLink to={`/groups/${group.id}`} key={group.id}>
                        <div>
                            <h2>
                                Name: {group.name}
                            </h2>
                            <img
                                src={group.previewImage?.[0]?.url ?? "img.png"}
                            />
                            <h3>
                                {group.city}, {group.state}
                            </h3>
                            <p>
                                About: {group.about}
                            </p>
                            <h3>
                                ## Events · {group.private ? 'Private' : 'Public'}
                            </h3>
                        </div>
                        <hr/>
                    </NavLink>
                ))}

            </ul>
        </main>
    )
}

export default Groups;
