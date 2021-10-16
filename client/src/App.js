import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import axiosInstance from "./utils/axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState();
  const [error, setError] = useState();
  const submitHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", selectedFiles[0]);
    axiosInstance
      .post("/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round(100 * (data.loaded / data.total)));
        },
      })
      .catch((error) => {
        const code = error?.response?.data?.code;
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading");
            break;
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 1MB!");
            break;
          case "INVALID_TYPE":
            setError(
              "This file type is not supported. Only .png, .jpg, and .jpeg files are allowed"
            );
            break;
          default:
            setError("Sorry, something went wrong");
            break;
        }
      });
  };
  return (
    <Container>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select a File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && progress && (
              <ProgressBar now={progress} label={`${progress}%`} />
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
