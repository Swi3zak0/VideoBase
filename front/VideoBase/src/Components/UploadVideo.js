import React, { useState, useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

function UploadVideo() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("video_file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-video/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data && response.data.url) {
        setUploadStatus("Video załadowane pomyślnie!");
        const videoUrl = response.data.url;
        navigate("/addVideo", { state: { videoUrl: videoUrl } });
      } else {
        setUploadStatus("Błąd: serwer nie zwrócił URL wideo.");
      }
    } catch (error) {
      setUploadStatus("Bład wgrywania video");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile) {
      setFile(newFile);
      localStorage.setItem("fileName", newFile.name);
    } else {
      alert(t("fileSelectAlert"));
    }
  };

  const handleSelectFiles = (event) => {
    event.preventDefault();
    const newFile = event.target.files[0];
    if (newFile) {
      setFile(newFile);
      localStorage.setItem("fileName", newFile.name);
    } else {
      alert(t("fileSelectAlert"));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    localStorage.removeItem("fileName");
  };

  return (
    <div className="standard-form">
      <Form onSubmit={handleSubmit}>
        <h1>{t("uploadVideo")}</h1>
        <Card className="drop-zone text-center p-2">
          <Card.Body onDrop={handleDrop} onDragOver={handleDragOver}>
            <h2>{t("dragAndDrop")}</h2>
            <h2>{t("or")}</h2>
            <Button
              className="button"
              variant="dark"
              onClick={() => inputRef.current.click()}
            >
              {t("selectVideo")}
            </Button>
            <input
              type="file"
              onChange={handleSelectFiles}
              hidden
              ref={inputRef}
              accept=".mp4, .mov, .avi, .wmv, .webm, .mkv"
            />
          </Card.Body>
        </Card>
        <Button
          className="button"
          variant="dark"
          type="submit"
          disabled={!file || isLoading}
        >
          {isLoading ? t("loading") : t("upload")}
        </Button>
        {file && (
          <Form.Control
            plaintext
            readOnly
            defaultValue={file.name}
            className="filename-form-label"
          />
        )}
        <Button
          variant={file ? "danger" : "outline-danger"}
          disabled={!file}
          onClick={handleRemoveFile}
        >
          {t("removeFile")}
        </Button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </Form>
    </div>
  );
}

export default UploadVideo;
