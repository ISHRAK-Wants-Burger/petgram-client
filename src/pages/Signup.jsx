import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Signup() {
  const nameRef = useRef();
  const dobRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      // Collect extra fields
      const name = nameRef?.current?.value.trim();
      const dob = dobRef?.current?.value;
      const email = emailRef?.current?.value;
      const password = passRef?.current?.value;

      await signup(email, password, { name, dob });

      Swal.fire({
        title: "New user created, Welcome!",
        icon: "success",
        draggable: true
      });
      navigate('/');
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setError('Failed to create an account');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-cyan-100 shadow mt-56 rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up Now!</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input ref={nameRef} type="text" placeholder="Full Name" required
          className="w-full p-2 border rounded bg-white" />
        <input ref={dobRef} type="date" placeholder="Date of Birth" required
          className="w-full p-2 border rounded bg-white" />
        <input ref={emailRef} type="email" placeholder="Email" required
          className="w-full p-2 border rounded bg-white" />
        <input ref={passRef} type="password" placeholder="Password" required
          className="w-full p-2 border rounded bg-white" />
        <button type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-800 text-white rounded">
          SignUp
        </button>

        <p>Already have an account? <Link className='text-cyan-600 hover:text-cyan-900 hover:underline' to='/login'>Login now!</Link></p>
      </form>
    </div>
  );
}
