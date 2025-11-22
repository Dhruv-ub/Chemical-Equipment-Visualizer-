import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
    let { user, logoutUser } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav style={{
            background: '#1e293b',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderBottom: '3px solid #3b82f6'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: '#3b82f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                    }}>
                        ⚗️
                    </div>
                    <span style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        letterSpacing: '-0.025em'
                    }}>
                        Chemical Visualizer
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {user ? (
                        <>
                            <NavLink
                                to="/"
                                style={({ isActive }) => ({
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    ...(isActive ? {
                                        background: '#3b82f6',
                                        color: 'white',
                                        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                                    } : {
                                        background: 'transparent',
                                        color: '#cbd5e1',
                                        border: '1px solid #475569'
                                    })
                                })}
                            >
                                🏠 Home
                            </NavLink>
                            <NavLink
                                to="/history"
                                style={({ isActive }) => ({
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    ...(isActive ? {
                                        background: '#3b82f6',
                                        color: 'white',
                                        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                                    } : {
                                        background: 'transparent',
                                        color: '#cbd5e1',
                                        border: '1px solid #475569'
                                    })
                                })}
                            >
                                📜 History
                            </NavLink>
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        transition: 'all 0.2s',
                                        boxShadow: isDropdownOpen ? '0 0 0 2px #cbd5e1' : 'none'
                                    }}
                                >
                                    👤
                                </button>
                                {isDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '120%',
                                        right: 0,
                                        background: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '0.5rem',
                                        padding: '0.5rem',
                                        minWidth: '160px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem',
                                        zIndex: 100
                                    }}>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            color: '#cbd5e1',
                                            borderBottom: '1px solid #475569',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {user.username}
                                        </div>
                                        <button
                                            onClick={() => {
                                                logoutUser();
                                                setIsDropdownOpen(false);
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'transparent',
                                                color: '#ef4444',
                                                border: 'none',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <span>🚪</span> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            style={({ isActive }) => ({
                                padding: '0.625rem 1.5rem',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                textDecoration: 'none',
                                display: 'inline-block',
                                ...(isActive ? {
                                    background: '#3b82f6',
                                    color: 'white',
                                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                                } : {
                                    background: 'transparent',
                                    color: '#cbd5e1',
                                    border: '1px solid #475569'
                                })
                            })}
                        >
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
