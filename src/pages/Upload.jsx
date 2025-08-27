import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import { Hourglass } from 'react-spinners-css';

export default function Upload() {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [genre, setGenre] = useState('cat'); // Default genre
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState('');


  // Fetch all users' data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/users');  // Call the backend API


        const currentUserEmail = currentUser?.email;
        const user = res?.data?.users?.find((user) => user.email === currentUserEmail);
        setCurrentUserData(user); // Set the current user's data
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();  // Call the function to fetch users on component mount
  }, [currentUser]);  // Empty dependency array so it runs only once on mount

 

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a video file.');
      return;
    }

     const gg = currentUserData?.name;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('uploaderName', currentUserData?.name);
    formData.append('genre', genre);

    console.log('current user',gg);



    setLoading(true);

    try {
      const token = await currentUser.getIdToken();
      const res = await axios.post(
        'http://localhost:5000/api/videos/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your video has been uploaded',
        showConfirmButton: false,
        timer: 1500,
      });
      setMessage(`Upload successful: ${res.data.url}`);
      setLoading(false);

      // Clear the form fields after successful upload
      setFile(null);
      setTitle('');
      setGenre('cat'); // Reset to default genre
      setMessage('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
      console.error(err);
      setMessage('Upload failed.');
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 mt-14">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Video</h1>
      {message && <p className="text-center mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e?.target?.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e?.target?.value)}
            className="w-full p-2 border rounded"
          >
            <option disabled value=" ">choose</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="lion">Lion</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        {loading ? (
          <>
            <Hourglass />
            <Hourglass />
            <Hourglass />
            <Hourglass className="mb-4" />
          </>
        ) : (
          <>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Upload
            </button>
          </>
        )}
      </form>

      {/* Display fetched current user data */}
      <div className="mt-6">
        {currentUserData ? (
          <div className="border p-2 rounded mb-2">
            <p><strong>Name:</strong> {currentUserData?.name}</p>
            <p><strong>Email:</strong> {currentUserData?.email}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

    </div>
  );
}
