import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import { Hourglass } from 'react-spinners-css';




export default function Upload() {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a video file.');
      return;
    }
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    setLoading(true);

    try {
      const token = await currentUser.getIdToken();
      const res = await axios.post(
        'http://localhost:5000/api/videos/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your video has been uploaded",
        showConfirmButton: false,
        timer: 1500
      });
      setMessage(`Upload successful: ${res.data.url}`);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.error(err);
      setMessage('Upload failed.');
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 mt-14">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Video</h1>
      {message && <p className="text-center mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        {loading ? <>
          <Hourglass /> <Hourglass /> <Hourglass /> <Hourglass className="mb-4" />
        </>
          :
          <>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >Upload</button>
            
          </>}

      </form>
    </div>
  );
}
