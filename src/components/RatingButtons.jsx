import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VideoRatings() {
  const { videoId } = useParams();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/videos/${videoId}/ratings`);
        if (!res.ok) throw new Error("Failed to fetch ratings");

        const data = await res.json();
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [videoId]); 

  async function handleLike() {
    try {
      const res = await fetch(`/api/videos/${videoId}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like");
      setLikes(likes + 1);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDislike() {
    try {
      const res = await fetch(`/api/videos/${videoId}/dislike`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to dislike");
      setDislikes(dislikes + 1);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex gap-4 mt-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleLike}
      >
        👍 {likes}
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleDislike}
      >
        👎 {dislikes}
      </button>
    </div>
  );
}
