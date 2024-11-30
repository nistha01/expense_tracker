import React, { useContext, useState } from 'react';
import './LoginSignUp.css';
import { AuthContext } from '../auth/AuthContext';

const LoginSignUp = () => {
  const { isLogin, setIsLogin, isUser, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleForm = () => {
    setUser(!isUser); // Toggle between Login and Sign-up forms
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlUp = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA';
    const urlIn = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA';

    const payload = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    if (isUser) {
      // Login Process
      const loginData = await postCalltoGetToken(urlIn, payload, 'POST');
      if (!loginData || !loginData.idToken) {
        setIsLogin(false);
        alert('Login Failed');
        return;
      }
      setIsLogin(true);
      
    } else {
      // Sign-up Process
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const signupData = await postCalltoGetToken(urlUp, payload, 'POST');
      if (signupData && signupData.idToken) {
        setIsLogin(true);
        
        setUser(true); // After sign-up, switch to login mode
      } else {
        alert('Sign-up Failed');
      }
    }
  };

  async function postCalltoGetToken(url, payload, method) {
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
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>{isUser ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isUser && (
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="btn submit-btn">
            {isUser ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button onClick={toggleForm} className="btn toggle-btn">
          {isUser ? 'New User' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;
