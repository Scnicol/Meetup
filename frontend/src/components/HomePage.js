import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './homePage.css';

import { NavLink, Link ,Route, useParams } from 'react-router-dom';

const HomePage = () => {
     const user = useSelector(state => state.session.user);

    return (
        <main>
            <h2>
                The people patform- Where interests become friendships
            </h2>
            <p>Intro Text</p>
            <img
            src="Img.png"/>
            <h3>
                How Meetup works
            </h3>
            <p>how it works here</p>
            <NavLink to={`/groups`}>
                See all groups
            </NavLink>
            <NavLink to={`/events`}>
                Find an event
            </NavLink>
           <NavLink to={`/groups/new`} disabled={!user}>Start a Group</NavLink>
        </main>
    )
}

export default HomePage;
