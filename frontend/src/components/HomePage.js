import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './homePage.css';
import OpenModalButton from './OpenModalButton';
import SignupFormModal from './SignupFormModal';

import { NavLink, Link, Route, useParams } from 'react-router-dom';

const HomePage = () => {
    const user = useSelector(state => state.session.user);

    return (
        <main className='vertical-center main-container'>
            <div className="horizontal-alignment">
                <div>
                    <h2>
                        The people patform- Where interests become friendships
                    </h2>
                    <p>Intro Text</p>
                </div>
                <img
                    src="https://cdn.icon-icons.com/icons2/1055/PNG/128/7-percent-cat_icon-icons.com_76683.png" />
            </div>
            <div className="vertical-center">
                <h3>
                    How Meetup works
                </h3>
                <p>how it works here</p>
            </div>
            <div className="horizontal-alignment cat-spacing" >
                <NavLink className='vertical-center' to={`/groups`}>
                    <img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/4-review-cat_icon-icons.com_76680.png' />
                    See all groups
                </NavLink>
                <NavLink className='vertical-center' to={`/events`}>
                    <img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/3-search-cat_icon-icons.com_76679.png' />
                    Find an event
                </NavLink>
                <NavLink className='vertical-center' to={`/groups/new`} disabled={!user}>
                    <img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/6-phone-cat_icon-icons.com_76682.png' />
                    Start a Group</NavLink>
            </div>
            {!user &&
                <div>
                    <OpenModalButton
                        className={'main'}
                        buttonText="Join Meetup"
                        modalComponent={<SignupFormModal />}
                    />
                </div>
            }
        </main>
    )
}

export default HomePage;
