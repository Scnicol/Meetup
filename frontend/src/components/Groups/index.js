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

    return (
        <main>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>Name: {group.name}
                        <p>
                            About: {group.about}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    )
}

export default Groups;
