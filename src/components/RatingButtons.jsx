import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RatingButtons({ videoId }) {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // Load ratings from server
  const loadRatings = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}/ratings`);
      if (!res.ok) throw new Error("Failed to fetch ratings");

      const data = await res.json();
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
    } catch (err) {
      console.error(err);
    }
  }, [videoId]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  async function handleRating(type) {
    if (!currentUser) {
      alert("You must be logged in to rate videos.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to ${type}`);

      const data = await res.json();
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex gap-4 mt-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => handleRating("like")}
      >
        👍 {likes}
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => handleRating("dislike")}
      >
        👎 {dislikes}
      </button>
    </div>
  );
}
