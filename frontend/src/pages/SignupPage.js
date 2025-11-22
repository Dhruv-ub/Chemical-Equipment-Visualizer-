import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const SignupPage = () => {
    let { registerUser } = useContext(AuthContext);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join Chemical Visualizer today</p>
                </div>
                <form className="auth-form" onSubmit={registerUser}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="form-input"
                            placeholder="Choose a username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            className="form-input"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            className="form-input"
                            placeholder="Last Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="form-input"
                            placeholder="Create a password"
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Sign Up
                    </button>

                    <div className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
