import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function CommentForm({ videoId }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { currentUser } = useAuth();

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText('');
        // simple refresh: reload comment list by emitting event, or use a state-lifted callback — easiest: location.reload() or re-fetch parent
        window.location.reload();
      } else {
        const body = await res.json();
        alert(body.error || 'Comment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Comment failed');
    } finally { setSending(false); }
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows="3" className="w-full p-2 border rounded" placeholder="Write a comment..." />
      <div className="text-right mt-2">
        <button disabled={sending} className="px-3 py-1 bg-blue-600 text-white rounded">{sending ? 'Posting…' : 'Post Comment'}</button>
      </div>
    </form>
  );
}
