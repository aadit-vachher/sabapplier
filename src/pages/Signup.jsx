import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }


    setEmail('');
    setPassword('');
    setConfirmPassword('');


    navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>📝 Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
          <button type="submit">Create Account</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
