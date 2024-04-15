import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LOGOUT_MUTATION = gql`
  mutation MyMutation {
    deleteRefreshTokenCookie {
      deleted
    }
    deleteTokenCookie {
      deleted
    }
  }
`;
export const Logout = () => {
  const navigate = useNavigate();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    onCompleted() {
      localStorage.removeItem("username");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("fileName");
      navigate("/login");
    },
  });

  const logout = () => {
    logoutMutation();
  };
  return { logout };
};
