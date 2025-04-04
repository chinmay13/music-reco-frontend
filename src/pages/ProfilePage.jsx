import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

// Example genres array (adjust as needed)
const genres = [
  "Rock",
  "Blues",
  "Pop",
  "Jazz",
  "Hip Hop",
  "Classical",
  "Electronic",
  "Country",
  "Reggae",
  "Folk",
  "Metal",
  "Soul",
];

const GenreSelector = () => {
  const [selectedGenres, setSelectedGenres] = useState({
    happy: [],
    sad: [],
    calm: [],
  });
  const navigate = useNavigate();

  // Function to handle genre selection for each mood
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

  // Function to handle submit and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const mood in selectedGenres) {
      const count = selectedGenres[mood].length;
      if (count < 1) {
        alert(`Please select at least one genre for ${mood}.`);
        return;
      }
      if (count > 3) {
        alert(`You can only select up to 3 genres for ${mood}.`);
        return;
      }
    }

    try {
      const username = localStorage.getItem("username");
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          moods: selectedGenres,
        }),
      });
      const data = await res.json();
      navigate("/moodSnap");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* <NavigationBar /> */}
      <Container className="my-5 d-flex align-items-center justify-content-center flex-column">
        <h1 className="mb-5">Build your profile</h1>

        {/* Section for sad mood */}
        <Container
          className=" p-4 rounded bg-light d-flex align-items-center justify-content-center flex-column"
          style={{ maxWidth: "800px" }}
        >
          <h3 className="mt-5">
            What music do you like when you're feeling sad?
            <span className="text-danger">*</span>
          </h3>
          <p className="text-center text-muted fst-italic">
            Please select atleast 1 and upto 3 genres
          </p>

          <Row
            className="mt-3 justify-content-center"
            style={{ marginBottom: "4rem" }}
          >
            {genres.map((genre, idx) => (
              <Col key={`sad-${idx}`} xs="auto" className="my-2">
                <Button
                  variant={
                    selectedGenres.sad.includes(genre)
                      ? "primary"
                      : "outline-primary"
                  }
                  style={{ borderRadius: "50px" }}
                  onClick={() => handleGenreChange("sad", genre)}
                >
                  {genre}
                </Button>
              </Col>
            ))}
          </Row>

          {/* Section for happy mood */}
          <h3 className="text-center">
            What music do you enjoy when you're feeling happy?{" "}
            <span className="text-danger">*</span>
          </h3>
          <p className="text-center text-muted fst-italic">
            Please select atleast 1 and upto 3 genres
          </p>

          <Row
            className="mt-3 justify-content-center"
            style={{ marginBottom: "4rem" }}
          >
            {genres.map((genre, idx) => (
              <Col key={`happy-${idx}`} xs="auto" className="my-2">
                <Button
                  variant={
                    selectedGenres.happy.includes(genre)
                      ? "success"
                      : "outline-success"
                  }
                  style={{ borderRadius: "50px" }}
                  onClick={() => handleGenreChange("happy", genre)}
                >
                  {genre}
                </Button>
              </Col>
            ))}
          </Row>

          {/* Section for calm mood */}
          <h3>
            What music helps you feel calm?{" "}
            <span className="text-danger">*</span>
          </h3>
          <p className="text-center text-muted fst-italic">
            Please select atleast 1 and upto 3 genres
          </p>
          <Row
            className="mt-3 justify-content-center"
            style={{ marginBottom: "4rem" }}
          >
            {genres.map((genre, idx) => (
              <Col key={`calm-${idx}`} xs="auto" className="my-2">
                <Button
                  variant={
                    selectedGenres.calm.includes(genre)
                      ? "info"
                      : "outline-info"
                  }
                  style={{ borderRadius: "50px" }}
                  onClick={() => handleGenreChange("calm", genre)}
                >
                  {genre}
                </Button>
              </Col>
            ))}
          </Row>

          <Button variant="primary mt-3 w-50" onClick={handleSubmit}>
            Update Profile
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default GenreSelector;
