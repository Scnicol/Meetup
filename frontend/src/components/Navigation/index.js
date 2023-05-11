import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div>
        <div className='dropdown-button'>
          <ProfileButton user={sessionUser} />
        </div>
        <div>
          <NavLink className={'new-group-position'} to='/groups/new'>
            Start a new Group
          </NavLink>
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div>
        <OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
        <OpenModalButton buttonText="Sign up" modalComponent={<SignupFormModal />} />
      </div>
    );
  }

  return (
    <div>
      <div className="horizontal-alignment nav-container">
        <NavLink className='horizontal-centered home-button' exact to="/">
          <img className='cat-image' src='https://cdn.icon-icons.com/icons2/1055/PNG/128/7-percent-cat_icon-icons.com_76683.png' />
          <h3>Meetup</h3>
        </NavLink>

        {isLoaded && sessionLinks}
      </div>
      <hr />
    </div>
  );
}


export default Navigation;
