import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin, setGmail } from '../auth/authSlice'; 
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isUser: true, 
  });
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlUp = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA';
    const urlIn = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA';

    const payload = {
      email: state.email,
      password: state.password,
      returnSecureToken: true,
    };
    if (state.isUser) {
      const loginData = await postCalltoGetToken(urlIn, payload, 'POST');
      if (!loginData || !loginData.idToken) {
        dispatch(setLogin(false)); 
        alert('Login Failed');
        return;
      }
      dispatch(setLogin(true)); 
      dispatch(setGmail(state.email)); 
      localStorage.setItem('authToken', loginData.idToken);
      localStorage.setItem('email', state.email); 
    } else {
      if (state.password !== state.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const signupData = await postCalltoGetToken(urlUp, payload, 'POST');
      if (signupData && signupData.idToken) {
        dispatch(setLogin(true)); 
        localStorage.setItem('authToken', signupData.idToken);
        localStorage.setItem('email', state.email);
        dispatch(setGmail(state.email)); 
      } else {
        alert('Sign-up Failed');
      }
    }
  };

  const postCalltoGetToken = async (url, payload, method) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      alert(error.message);
      return null;
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>{state.isUser ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              required
            />
          </div>
          {!state.isUser && (
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={state.confirmPassword}
                onChange={(e) => setState({ ...state, confirmPassword: e.target.value })}
                required
              />
            </div>
          )}
          <button type="submit" className="btn submit-btn">
            {state.isUser ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;
