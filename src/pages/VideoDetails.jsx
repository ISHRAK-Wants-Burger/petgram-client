import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import RatingButtons from '../components/RatingButtons';




export default function VideoDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/videos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setVideo(data);
      } else {
        // handle 404 / error...
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Uploaded: {new Date(video.createdAt).toLocaleString()}</p>

      <div className="mb-4">
        <video src={video.url} controls className="w-full rounded" />
      </div>

      <div className="mb-6 flex items-center space-x-2">
        <RatingButtons videoId={id} />
        <Link to={`/creator/${video.creatorId}`} className="text-sm text-blue-600">View Creator</Link>
      </div>

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <CommentList videoId={id} />
      {currentUser ? <CommentForm videoId={id} /> : <p><Link to="/login">Log in</Link> to comment.</p>}
    </div>
  );
}
