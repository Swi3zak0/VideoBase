import { useQuery, gql } from "@apollo/client";

const VERIFY_TOKEN_QUERY = gql`
  query MyQuery {
    checkToken
  }
`;

const CheckToken = () => {
  useQuery(VERIFY_TOKEN_QUERY, {
    fetchPolicy: "network-only",
  });
};

export default CheckToken;
