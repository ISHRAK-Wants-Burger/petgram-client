// src/components/CommentForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function CommentForm({ videoId, onCommentAdded }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!currentUser) {
      alert('Please log in to post a comment.');
      return;
    }

    setSending(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to post comment');
      }

      setText('');
      if (typeof onCommentAdded === 'function') onCommentAdded();
    } catch (err) {
      console.error('CommentForm.submit error:', err);
      alert('Failed to post comment: ' + (err.message || 'Unknown error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="3"
        className="w-full p-2 border rounded"
        placeholder="Write a comment..."
      />
      <div className="text-right mt-2">
        <button disabled={sending} className="px-3 py-1 bg-blue-600 text-white rounded">
          {sending ? 'Posting…' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
