import React, { useState, useContext } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { API_BASE_URL } from "../api";
import { AuthContext } from "../context/AuthContext";

const RecommendationsPage = () => {
  const { user } = useContext(AuthContext);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedMood, setDetectedMood] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [era, setEra] = useState("old");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  // Detect mood using the captured image.
  const handleDetectMood = async () => {
    if (!capturedImage) return;
    try {
      // Convert the data URL (capturedImage) to a Blob.
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("image", blob, "captured.jpg");
      const detectRes = await fetch(`${API_BASE_URL}/detect_mood`, {
        method: "POST",
        body: formData,
      });
      const data = await detectRes.json();
      setDetectedMood(data.detected_emotion);
      setSelectedMood(data.detected_emotion); // Auto-select if detected.
    } catch (err) {
      console.error(err);
      setError("Error detecting mood");
    }
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE_URL}/recommendations?username=${encodeURIComponent(
        user.username
      )}&mood=${encodeURIComponent(selectedMood)}&era=${encodeURIComponent(
        era
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
      setError("Error fetching recommendations");
    }
  };

  return (
    <div>
      <h2>Get Recommendations</h2>
      <div>
        <h3>Capture Image (Optional)</h3>
        <WebcamCapture onCapture={setCapturedImage} />
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "320px", marginTop: "10px" }}
          />
        )}
        <button onClick={handleDetectMood}>Detect Mood from Image</button>
        {detectedMood && <p>Detected Mood: {detectedMood}</p>}
      </div>
      <div>
        <h3>Or Select Mood Manually:</h3>
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
        >
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="calm">Calm</option>
        </select>
      </div>
      <div>
        <h3>Select Era:</h3>
        <select value={era} onChange={(e) => setEra(e.target.value)}>
          <option value="old">Old</option>
          <option value="mid">Mid</option>
          <option value="new">New</option>
        </select>
      </div>
      <button onClick={handleGetRecommendations}>Get Recommendations</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {recommendations.length > 0 && (
        <div>
          <h3>Recommendations:</h3>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
