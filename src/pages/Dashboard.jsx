import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("User not logged in");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/videos", {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch videos", await res.json());
          setLoading(false);
          return;
        }

        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  if (loading) return <p>Loading videos...</p>;




  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul className="mx-24 md:mx-80 grid grid-cols-1 gap-1 md:gap-2">
          {videos.map((video) => (
            <li key={video._id} className="border p-2 rounded mt-6">
              <h2 className="font-semibold">{video.title}</h2>
              <video
                src={video.url}
                controls
                className="w-full h-full md:h-[550px] rounded pb-7 md:pb-1"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
