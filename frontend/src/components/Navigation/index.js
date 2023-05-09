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
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div>
        <OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
        <OpenModalButton buttonText="Sign up" modalComponent={<SignupFormModal/>} />
      </div>
    );
  }

  return (
    <div>
      <NavLink exact to="/"><img src='https://cdn.icon-icons.com/icons2/1055/PNG/128/7-percent-cat_icon-icons.com_76683.png' /></NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}


export default Navigation;
