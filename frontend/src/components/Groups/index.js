import React from 'react';
import { getGroups } from '../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Groups() {
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
                    <li key={group.id}>{group.name}</li>
                ))}
            </ul>
        </main>
    )
}

export default Groups;
