import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="max-w-md mx-auto p-6 bg-cyan-100 shadow mt-56 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login Now!</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input ref={emailRef} type="email" placeholder="Email" required
          className="w-full p-2 border rounded bg-white" />
        <input ref={passRef} type="password" placeholder="Password" required
          className="w-full p-2 border rounded bg-white" />
        <button type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-800 text-white rounded">
          Login
        </button>
        
        <p>Don't have an account? <Link className='text-cyan-600 hover:text-cyan-900 hover:underline' to='/signup'>Signup now!</Link></p>
      </form>
    </div>
  );
}
