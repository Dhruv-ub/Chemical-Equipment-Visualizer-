import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const LoginPage = () => {
    let { loginUser } = useContext(AuthContext);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue to Chemical Visualizer</p>
                </div>
                <form className="auth-form" onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="form-input"
                            placeholder="Enter your username"
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Sign In
                    </button>

                    <div className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-link">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
