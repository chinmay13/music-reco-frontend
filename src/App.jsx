import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import { AuthProvider } from "./context/AuthContext";
import MoodSnapPage from "./pages/MoodSnapPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/moodSnap" element={<MoodSnapPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
