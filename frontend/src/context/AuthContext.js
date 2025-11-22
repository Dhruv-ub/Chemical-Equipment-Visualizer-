import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);

    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    let getUserProfile = async (tokens) => {
        try {
            let response = await fetch(`${API_URL}/profile/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokens.access
                }
            });
            if (response.status === 200) {
                let data = await response.json();
                setUser(data);
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            logoutUser();
        }
    }

    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
        });
        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            localStorage.setItem('authTokens', JSON.stringify(data));
            await getUserProfile(data);
            navigate('/');
        } else {
            alert('Something went wrong!');
        }
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    }

    let registerUser = async (e) => {
        e.preventDefault();
        let response = await fetch(`${API_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': e.target.username.value,
                'password': e.target.password.value,
                'email': e.target.email.value,
                'first_name': e.target.first_name.value,
                'last_name': e.target.last_name.value
            })
        });

        if (response.status === 201) {
            navigate('/login');
        } else {
            alert('Something went wrong!');
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser
    }

    useEffect(() => {
        if (authTokens && !user) {
            getUserProfile(authTokens);
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authTokens, user, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
