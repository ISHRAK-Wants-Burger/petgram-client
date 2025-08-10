import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const emailRef = useRef();
  const passRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      await login(emailRef.current.value, passRef.current.value);

      Swal.fire({
        title: "logged in!",
        icon: "success",
        draggable: true
      });

      navigate('/');
    } catch {
      setError('Failed to sign in');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow mt-10 rounded">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input ref={emailRef} type="email" placeholder="Email" required
          className="w-full p-2 border rounded" />
        <input ref={passRef} type="password" placeholder="Password" required
          className="w-full p-2 border rounded" />
        <button type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded">
          Log In
        </button>
      </form>
    </div>
  );
}
