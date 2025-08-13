// src/components/CommentList.jsx
import React, { useEffect, useState } from 'react';

export default function CommentList({ videoId, refreshKey = 0 }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Use relative URL, assuming frontend proxy or same origin
        const res = await fetch(`/api/videos/${videoId}/comments`);
        if (!res.ok) throw new Error('Failed to load comments');
        const data = await res.json();
        if (mounted) setComments(data);
      } catch (err) {
        console.error('CommentList.load error:', err);
        if (mounted) setError(err.message || 'Error loading comments');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (videoId) load();

    return () => {
      mounted = false;
    };
  }, [videoId, refreshKey]);

  if (loading) return <p>Loading comments…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!comments || comments.length === 0) return <p>No comments yet.</p>;

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c._id || c.id} className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">
            {c.userName || c.uid || 'Anonymous'} · {new Date(c.createdAt).toLocaleString()}
          </div>
          <div className="mt-1">{c.text}</div>
        </li>
      ))}
    </ul>
  );
}
