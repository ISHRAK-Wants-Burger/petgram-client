// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

export default function Navbar() {
  const { logout, currentUser, role, setRole } = useAuth();
  const navigate = useNavigate();
  const [promoting, setPromoting] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  }


  async function handlePromote() {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setPromoting(true);
    try {
      // get current token and call backend
      const token = await currentUser.getIdToken();
      const res = await fetch('http://localhost:5000/api/users/promote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // no body needed for self-promotion
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || body.message || 'Promotion failed');

      // Force refresh token so custom claims are updated on client
      await currentUser.getIdToken(true);

      // Read new claims
      const idTokenResult = await currentUser.getIdTokenResult(true);
      const newRole = idTokenResult.claims?.role || 'consumer';

      // Update client state (if your context provides setRole)
      if (typeof setRole === 'function') setRole(newRole);

      Swal.fire({
        title: "You have been promoted to creator!",
        icon: "success",
        draggable: true
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `romotion failed: ${err.message}`
      });
      console.error('Promotion error:', err);
    } finally {
      setPromoting(false);
    }
  }

  return (
    <div className='fixed top-0 left-0 w-full z-50'>
      <nav className="bg-gray-100 px-6 py-4 shadow flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <Link className="text-blue-600 hover:underline" to="/">Dashboard</Link>

          {/* Only show Upload if user is a creator */}
          {currentUser && role === 'creator' && (
            <Link className="text-blue-600 hover:underline" to="/upload">Upload</Link>
          )}
        </div>

        <div className="flex items-center space-x-3">

          {/* {currentUser && (
            <span className="text-sm px-2 py-1 rounded bg-white border">
              {role ? role.toUpperCase() : 'USER'}
            </span>
          )
          } */}
          {currentUser ?
            <>{currentUser && role !== 'creator' ?
              <span className="text-sm px-2 py-1 rounded bg-white border">
                User
              </span>
              :
              <span className="text-sm px-2 py-1 rounded bg-white border">
                Creator
              </span>
            }</>
            :
            <></>
          }

          {/* Become Creator button for non-creators */}
          {currentUser && role !== 'creator' && (
            <button
              onClick={handlePromote}
              disabled={promoting}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              title="Promote your account to creator"
            >
              {promoting ? 'Promoting…' : 'Become Creator'}
            </button>
          )}

          {/* Logout button */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}

          {/* If not logged in show login/signup */}
          {!currentUser && (
            <>
              <Link className="text-blue-600 hover:underline" to="/login">Log In</Link>
              <Link className="text-blue-600 hover:underline" to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
