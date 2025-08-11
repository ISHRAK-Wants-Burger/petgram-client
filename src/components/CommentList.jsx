// src/components/CommentList.jsx
import React, { useEffect, useState } from 'react';

export default function CommentList({ videoId, refreshKey = 0 }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${videoId}/comments`);
        if (!res.ok) throw new Error('Failed to load comments');
        const data = await res.json();
        if (mounted) setComments(data);
      } catch (err) {
        console.error('CommentList.load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [videoId, refreshKey]); // re-run when videoId or refreshKey changes

  if (loading) return <p>Loading comments…</p>;
  if (!comments || comments.length === 0) return <p>No comments yet.</p>;

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c._id || c.id} className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">
            {c.uid || c.user || 'Anonymous'} · {new Date(c.createdAt).toLocaleString()}
          </div>
          <div className="mt-1">{c.text}</div>
        </li>
      ))}
    </ul>
  );
}
