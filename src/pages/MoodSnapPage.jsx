import React, { useState, useRef, useCallback } from "react";
import {
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import Webcam from "react-webcam";
import { BsCamera } from "react-icons/bs"; // Camera icon
import "./MoodSnapPage.css";
import NavigationBar from "../components/NavigationBar";
import { FaCamera } from "react-icons/fa";
import { API_BASE_URL } from "../api";

const MoodSnapPage = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  // Capture image from webcam
  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  // Retake image (switch back to live camera)
  const handleRetake = () => {
    setCapturedImage(null);
  };

  function dataURLtoBlob(dataurl) {
    const [header, base64Data] = dataurl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Invalid data URL");
    }
    const mime = mimeMatch[1];
    const bstr = atob(base64Data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Detect emotion (placeholder function)
  const handleDetectEmotion = () => {
    if (!capturedImage) {
      alert("Please capture an image first.");
      return;
    }

    try {
      // Convert the captured image (data URL) to a Blob
      const imageBlob = dataURLtoBlob(capturedImage);
      console.log("imageBlob--", imageBlob);
      // Create FormData and append the image Blob
      const formData = new FormData();
      formData.append("image", imageBlob, "captured.jpg");

      // Set up request options for fetch
      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      // Call the detect mood endpoint
      fetch(`${API_BASE_URL}/detect_mood`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("Emotion Detection Result:", result);
          alert(`Detected mood: ${result}`);
        })
        .catch((error) => {
          console.error("Error detecting emotion:", error);
          alert("An error occurred while detecting emotion.");
        });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process captured image.");
    }
  };

  // Get recommendations (placeholder function)
  const handleGetRecommendations = () => {
    alert("Fetching music recommendations...");
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Top Navigation Bar */}
      <NavigationBar />

      <Container fluid className="py-4">
        <Row>
          {/* Left Column: Polaroid Frame */}
          <Col md={6} className="d-flex justify-content-center mb-4">
            <div className="polaroid-frame">
              <div className="image-container">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="captured-img"
                  />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="live-webcam"
                  />
                )}
              </div>
              <div className="polaroid-buttons">
                <Button variant="secondary" onClick={handleRetake}>
                  Retake
                </Button>
                <Button variant="primary" onClick={handleCapture}>
                  <FaCamera />
                </Button>
                <Button variant="warning" onClick={handleDetectEmotion}>
                  Detect Emotion
                </Button>
              </div>
            </div>
          </Col>

          {/* Right Column: Questions & Answers */}
          <Col md={6}>
            <h3 className="mb-4">Mood & Music Questions</h3>

            <div className="mb-4">
              <p>
                <strong>1. How are you feeling today?</strong>
              </p>
              {/* Use a ButtonGroup or individual Buttons with spacing */}
              <ButtonGroup className="mb-2">
                <Button variant="outline-primary">Happy</Button>
                <Button variant="outline-primary">Sad</Button>
                <Button variant="outline-primary">Neutral</Button>
              </ButtonGroup>
            </div>

            <div className="mb-4">
              <p>
                <strong>2. What genre of music do you prefer?</strong>
              </p>
              <ButtonGroup className="mb-2">
                <Button variant="outline-primary">Pop</Button>
                <Button variant="outline-primary">Rock</Button>
                <Button variant="outline-primary">Jazz</Button>
              </ButtonGroup>
            </div>

            {/* Additional Questions... */}

            {/* Get Recommendations Button */}
            <div className="text-end mt-5">
              <Button
                variant="success"
                size="lg"
                onClick={handleGetRecommendations}
              >
                Get Recommendations
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MoodSnapPage;
