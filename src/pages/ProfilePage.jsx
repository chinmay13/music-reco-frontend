import React, { useState, useContext } from "react";
import { API_BASE_URL } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const moodOptions = {
  happy: ["Pop", "Rock", "Dance"],
  sad: ["Blues", "Classical", "Acoustic"],
  calm: ["Ambient", "Chill", "Jazz"],
};

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState({
    happy: [],
    sad: [],
    calm: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenreChange = (mood, genre) => {
    setSelectedGenres((prev) => {
      let newGenres = prev[mood];
      if (newGenres.includes(genre)) {
        newGenres = newGenres.filter((g) => g !== genre);
      } else {
        if (newGenres.length < 3) {
          newGenres = [...newGenres, genre];
        } else {
          alert(`You can only select up to 3 genres for ${mood}`);
          return prev;
        }
      }
      return { ...prev, [mood]: newGenres };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          moods: selectedGenres,
        }),
      });
      const data = await res.json();
      setUser({ ...user, isProfileComplete: true });
      navigate("/recommendations");
    } catch (err) {
      console.error(err);
      setError("Error updating profile");
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <p>Select up to 3 genres for each mood:</p>
      <form onSubmit={handleSubmit}>
        {Object.keys(moodOptions).map((mood) => (
          <div key={mood}>
            <h3>{mood.charAt(0).toUpperCase() + mood.slice(1)}</h3>
            {moodOptions[mood].map((genre) => (
              <label key={genre} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres[mood].includes(genre)}
                  onChange={() => handleGenreChange(mood, genre)}
                />
                {genre}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Update Profile</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProfilePage;
