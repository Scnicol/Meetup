import './LoginForm.css';
import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useModal } from '../../context/Modal';

function LoginFormModal() {

  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  if (sessionUser) return (
    <Redirect to="/" />
  );

  const loginUser = (credential, password) => {
    console.log(credential, password, "credential and password")
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data.errors, 'Data errors')
        if (data && data.errors) setErrors([data.errors.message]);
      });
  }

  const loginDemoUser = () => {
    return loginUser('Demo-lition', 'password');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    return loginUser(credential, password);
  }



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={credential.length == 0 || password.length == 0}>Log In</button>
      </form>
      <button onClick={loginDemoUser}>
        Login as DemoUser
      </button>
    </div>
  );
}

export default LoginFormModal;
