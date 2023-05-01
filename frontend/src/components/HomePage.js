import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NavLink, Route, useParams } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();

    return (
        <main>
            <h1>
                MEETUP
            </h1>
            <NavLink to={`/groups`}>
                See all groups
            </NavLink>
            <NavLink to={`/events`}>
                Find an event
            </NavLink>
            <NavLink to={`/groups/new`}>
                Create a group
            </NavLink>
        </main>
    )
}

export default HomePage;
