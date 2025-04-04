import React, { useState, useRef, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Modal,
} from "react-bootstrap";
import Webcam from "react-webcam";
import "./MoodSnapPage.css";
import NavigationBar from "../components/NavigationBar";
import { FaCamera } from "react-icons/fa";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";


const MoodSnapPage = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedEmotion, setDetectedEmotion] = useState(""); 
  const [selectedEra, setSelectedEra] = useState("");
  const [withFriends, setWithFriends] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();


  const webcamRef = useRef(null);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  function dataURLtoBlob(dataurl) {
    const [header, base64Data] = dataurl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    if (!mimeMatch) throw new Error("Invalid data URL");
    const mime = mimeMatch[1];
    const bstr = atob(base64Data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  const handleDetectEmotion = () => {
    if (!capturedImage) {
      alert("Please capture an image first.");
      return;
    }

    try {
      const imageBlob = dataURLtoBlob(capturedImage);
      const formData = new FormData();
      formData.append("image", imageBlob, "captured.jpg");

      fetch(`${API_BASE_URL}/detect_mood`, {
        method: "POST",
        body: formData,
        redirect: "follow",
      })
        .then((res) => res.json())
        .then((result) => {
          const emotion = result["detected_emotion"];
          const capitalizedEmotion = emotion.charAt(0).toUpperCase() + emotion.slice(1);
          setDetectedEmotion(capitalizedEmotion);
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

  const handleGetRecommendations = () => {
    const mood = detectedEmotion;
    const era = selectedEra;
    const username = "kalps";

    fetch(`${API_BASE_URL}/recommendations?username=${username}&mood=${mood}&era=${era}`, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        const cleaned = (data || []).map((rec) => ({
          ...rec,
          artist: (rec.artists || rec.artists_detail || "")
            .replace(/^\['|'\]$/g, "")
            .replace(/', '/g, ", "),
        }));
        console.log("cleaned--",cleaned)
        navigate("/recommendations", { state: { recommendations: cleaned } });
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        alert("Could not fetch recommendations.");
      });
  };

  return (
    <div className="bg-light min-vh-100">
      {/* <NavigationBar /> */}
      <h1 className="my-5 text-center">Discover music that matches you</h1>
      <Container fluid className="mb-5 d-flex justify-content-center" style={{ marginTop: "4rem" }}>
        <Row className="w-100" style={{ maxWidth: "1200px" }}>
          <Col md={6} className="d-flex justify-content-center mb-4 h-auto">
            <div className="bg-white p-4 rounded" style={{ width: "100%", maxWidth: "450px", height: "550px" }}>
              <div className="mb-5" style={{ height: "400px", overflow: "hidden" }}>
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured" className="img-fluid w-100 h-100" style={{ objectFit: "cover" }} />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <Button variant="outline-primary" size="sm" onClick={handleRetake}>
                  Retake
                </Button>
                <Button variant="outline-primary" size="sm" onClick={handleCapture}>
                  <FaCamera />
                </Button>
                <Button variant="outline-primary" size="sm" onClick={handleDetectEmotion}>
                  Detect Emotion
                </Button>
              </div>
            </div>
          </Col>

          <Col md={6} className="mb-5 p-5 bg-white h-auto">
            <h3 className="mb-4 text-secondary">Mood & Music Questions</h3>

            <div className="mb-5">
              <p>
                <strong className="text-secondary">How are you feeling today?</strong>
                <span className="text-danger">*</span>
              </p>
              <ButtonGroup className="mt-1">
                <Button variant={detectedEmotion === "Happy" ? "primary" : "outline-primary"} onClick={() => setDetectedEmotion("Happy")}>
                  Happy
                </Button>
                <Button variant={detectedEmotion === "Sad" ? "primary" : "outline-primary"} onClick={() => setDetectedEmotion("Sad")}>
                  Sad
                </Button>
                <Button variant={detectedEmotion === "Neutral" ? "primary" : "outline-primary"} onClick={() => setDetectedEmotion("Neutral")}>
                  Neutral
                </Button>
              </ButtonGroup>
            </div>

            <div className="mb-5">
              <p>
                <strong className="text-secondary">Which era of songs would you like to listen to?</strong>
                <span className="text-danger">*</span>
              </p>
              <ButtonGroup className="mt-1">
                <Button variant={selectedEra === "old" ? "primary" : "outline-primary"} onClick={() => setSelectedEra("old")}>
                  Old
                </Button>
                <Button variant={selectedEra === "mid" ? "primary" : "outline-primary"} onClick={() => setSelectedEra("mid")}>
                  Mid
                </Button>
                <Button variant={selectedEra === "new" ? "primary" : "outline-primary"} onClick={() => setSelectedEra("new")}>
                  New
                </Button>
              </ButtonGroup>
            </div>

            <div className="mb-5">
              <p>
                <strong className="text-secondary">Is today one of those “main character energy” days?</strong>
                <span className="text-danger">*</span>
              </p>
              <ButtonGroup className="mt-1">
                <Button variant={withFriends === true ? "primary" : "outline-primary"} onClick={() => setWithFriends(true)}>
                  Yes
                </Button>
                <Button variant={withFriends === false ? "primary" : "outline-primary"} onClick={() => setWithFriends(false)}>
                  No
                </Button>
              </ButtonGroup>
            </div>

            <div className="text-center mt-5">
              <Button variant="primary" size="lg" className="mt-4" onClick={handleGetRecommendations}>
                Get Recommendations
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal for recommendations */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>🎶 Your Music Recommendations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {recommendations.length > 0 ? (
            <ul className="list-unstyled">
               {recommendations.map((rec, index) => (
                <li key={index} className="mb-4">
                  <strong>Artist:</strong>{" "}
                  {JSON.parse((rec.artists || rec.artists_detail || "").replace(/'/g, '"')).join(", ")} <br />
                  {/* <strong>Artist:</strong> {JSON.parse(rec.artists || rec.artists_detail)?.join(", ")} <br /> */}
                  <strong>Year:</strong> {rec.year || rec.year_detail}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recommendations found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MoodSnapPage;
