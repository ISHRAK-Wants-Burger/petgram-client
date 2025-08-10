import React, { useEffect, useState } from 'react';

export default function CommentList({ videoId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}/comments`);
      if (res.ok) setComments(await res.json());
    }
    load();
  }, [videoId]);

  if (!comments.length) return <p>No comments yet.</p>;
  return (
    <ul className="space-y-3">
      {comments.map(c => (
        <li key={c._id} className="bg-white p-3 rounded shadow-sm">
          <div className="text-sm text-gray-600">{c.uid} · {new Date(c.createdAt).toLocaleString()}</div>
          <div className="mt-1">{c.text}</div>
        </li>
      ))}
    </ul>
  );
}
