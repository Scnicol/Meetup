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
            src="https://cdn.icon-icons.com/icons2/1055/PNG/128/7-percent-cat_icon-icons.com_76683.png"/>
            <h3>
                How Meetup works
            </h3>
            <p>how it works here</p>
            <NavLink to={`/groups`}>
                <img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/4-review-cat_icon-icons.com_76680.png'/>
                See all groups
            </NavLink>
            <NavLink to={`/events`}>
            <img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/3-search-cat_icon-icons.com_76679.png'/>
                Find an event
            </NavLink>
           <NavLink to={`/groups/new`} disabled={!user}>
           <img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/6-phone-cat_icon-icons.com_76682.png'/>
            Start a Group</NavLink>
           {/* Todo: What is this Join Meetup button supposed to do */}
           <button className='main'>Join Meetup</button>
        </main>
    )
}

export default HomePage;
