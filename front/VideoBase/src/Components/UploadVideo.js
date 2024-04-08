import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const getFileName = () => {
  localStorage.getItem("file.name");
};

function UploadVideo() {
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile && newFile.type.startsWith("video/")) {
      setFile(newFile);
      localStorage.setItem("fileName", newFile.name);
      localStorage.setItem(
        "fileData",
        JSON.stringify({ name: newFile.name, type: newFile.type })
      );
    } else {
      alert(t("fileSelectAlert"));
    }
  };

  const handleSelectFiles = (event) => {
    const newFile = event.target.files[0];
    if (newFile && newFile.type.startsWith("video/")) {
      setFile(newFile);
      localStorage.setItem("fileName", newFile.name);
      localStorage.setItem(
        "fileData",
        JSON.stringify({ name: newFile.name, type: newFile.type })
      );
    } else {
      alert(t("fileSelectAlert"));
    }
  };
  useEffect(() => {
    const fileData = localStorage.getItem("fileData");
    if (fileData) {
      const parsedFileData = JSON.parse(fileData);
      setFile({
        name: parsedFileData.name,
        type: parsedFileData.type,
      });
    }
  }, []);
  const handleRemoveFile = () => {
    setFile(null);
    localStorage.removeItem("fileData");
  };

  return (
    <div className="standard-form">
      <Form>
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
              accept=".mp4, .mov, .wmv, .avi"
              hidden
              ref={inputRef}
            />
          </Card.Body>
        </Card>
        <Button
          className="button"
          variant="dark"
          type="submit"
          onClick={() => navigate("/addVideo")}
          disabled={!file}
        >
          {t("upload")}
        </Button>
        <Form.Control
          plaintext
          readOnly
          defaultValue={file ? file.name : null}
        />
        <Button
          variant={file ? "danger" : "outline-danger"}
          disabled={!file}
          onClick={handleRemoveFile}
        >
          {t("removeFile")}
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideo;
