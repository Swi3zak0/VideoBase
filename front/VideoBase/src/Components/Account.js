import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const UPLOAD_AVATAR = gql`
  mutation updateAvatar($avatar: Upload!) {
    updateAvatar(avatar: $avatar) {
      profile {
        avatar
      }
    }
  }
`;

function Account() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(null);
  const [updateAvatar] = useMutation(UPLOAD_AVATAR);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));

      await updateAvatar({ variables: { avatar: file } });
    }
  };

  return (
    <div className="change-form">
      <Form>
        <h2>{t("myAccount")}</h2>
        <FormGroup>
          <FormLabel>{t("username")}</FormLabel>
          <FormControl
            name="username"
            type="text"
            placeholder={username}
            disabled
          />
          <FormLabel>{t("email")}</FormLabel>
          <FormControl name="email" type="text" placeholder={email} disabled />
          <FormLabel>{t("avatarLabel")}</FormLabel>
          <div className="avatar">
            <img src={avatar} alt="avatar" />
          </div>
          <FormControl
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <br />
          <Button variant="dark">{t("change")}</Button>
        </FormGroup>
      </Form>
    </div>
  );
}

export default Account;
