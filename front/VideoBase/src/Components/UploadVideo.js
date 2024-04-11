import React, { useState, useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";

const ADD_VIDEO_MUTATION = gql`
  mutation Mutation($video: Upload!) {
    createVideo(video: $video) {
      video
      success
      error
    }
  }
`;

function UploadVideo() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const [fileStatus, setFileStatus] = useState("");

  const [upload] = useMutation(ADD_VIDEO_MUTATION, {
    onCompleted: (data) => {
      if (data.createVideo.success) {
        setFileStatus("success");
      } else {
        setFileStatus("Błąd dodawania filmu!");
      }
    },
    onError: (error) => {
      console.error("Mutacja GraphQL zwróciła błąd: ", error);
    },
  });

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(file);
    if (file) {
      await upload({
        variables: { video: file },
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile) {
      setFile(newFile);
    } else {
      alert(t("fileSelectAlert"));
    }
  };

  const handleSelectFiles = (event) => {
    event.preventDefault();
    const newFile = event.target.files[0];
    if (newFile) {
      setFile(newFile);
    } else {
      alert(t("fileSelectAlert"));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
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
              accept="video/*"
            />
          </Card.Body>
        </Card>
        <Button
          className="button"
          variant="dark"
          type="submit"
          disabled={!file}
        >
          {t("upload")}
        </Button>
        {file && <Form.Control plaintext readOnly defaultValue={file.name} />}
        <Button
          variant={file ? "danger" : "outline-danger"}
          disabled={!file}
          onClick={handleRemoveFile}
        >
          {t("removeFile")}
        </Button>
        {fileStatus && <p>{fileStatus}</p>}
      </Form>
    </div>
  );
}

export default UploadVideo;
