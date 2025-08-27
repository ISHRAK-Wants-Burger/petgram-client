import { useEffect, useState, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [showMyVideos, setShowMyVideos] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState([]);

  // Fetch videos once
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const auth = getAuth();
        const user = auth?.currentUser;

        if (!user) {
          console.error("User not logged in");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/videos", {
          headers: {
            "Content-Type": "application/json",
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
        setFilteredVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Debounced filtering
  const filterVideos = useCallback(() => {
    let filtered = [...videos];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // My videos filter
    const auth = getAuth();
    const currentUserId = auth?.currentUser?.uid;
    if (showMyVideos && currentUserId) {
      filtered = filtered.filter((video) => video?.creatorId === currentUserId);
    }

    // Sort
    filtered.sort((a, b) =>
      sortNewest
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    setFilteredVideos(filtered);
  }, [videos, searchTerm, showMyVideos, sortNewest]);

  useEffect(() => {
    const handler = setTimeout(() => {
      filterVideos();
    }, 300); // debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm, showMyVideos, sortNewest, filterVideos]);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div className="p-4">
      <div className="mt-14 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">PETGRAM</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        {/* Sort button */}
        <button
          onClick={() => setSortNewest((prev) => !prev)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          {sortNewest ? "Sort: Newest" : "Sort: Oldest"}
        </button>

        {/* My Videos toggle */}
        <button
          onClick={() => setShowMyVideos((prev) => !prev)}
          className={`px-3 py-1 rounded ${showMyVideos ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          {showMyVideos ? "Showing: My Videos" : "Show My Videos"}
        </button>
      </div>

      {filteredVideos?.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul className="mx-24 md:mx-80 grid grid-cols-1 gap-1 md:gap-2 mb-5">
          {filteredVideos.map((video) => (
            <li key={video?._id} className="border p-2 rounded mt-6 ">
              <h2 className="font-bold my-1 md:my-3 text-lg">
                <Link to={`/video/${video?._id}`} className="text-cyan-500 hover:underline ">
                  {video.title}
                </Link>
              </h2>

              <h2 className="font-bold mb-2 text-slate-800">Genre: <span className="bg-slate-300 rounded p-1">{video?.genre}</span></h2>

              <Link to={`/video/${video?._id}`}>
                <video src={video?.url} controls className="w-full rounded" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-gray-900 text-white p-5 grid grid-cols-1 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl">Petgram</h2>
          <p className="text-cyan-600">A social platform for your Pet</p>
        </div>
        <div className="">
          <p className="text-lg">Social Media Links</p>
          <Link to="https://www.facebook.com/"><p>Facebook</p></Link>
          <Link to="https://www.youtube.com/"><p>Youtube</p></Link>
          <p>Instagram</p>
          <p>X: Twitter</p>
        </div>
        <div>
          <p>Privacy Policy</p>
          <p>Career</p>
          <p>Contact Us</p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  );
}
