import { useMutation, gql } from "@apollo/client";

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      success
    }
  }
`;

const DISLIKE_POST = gql`
  mutation DislikePost($postId: ID!) {
    dislikePost(postId: $postId) {
      success
    }
  }
`;

function usePostInteractions(refetch) {
  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error processing like:", error);
    },
  });

  const [dislikePost] = useMutation(DISLIKE_POST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error processing dislike:", error);
    },
  });

  const handleLike = (postId) => {
    likePost({ variables: { postId } });
  };

  const handleDislike = (postId) => {
    dislikePost({ variables: { postId } });
  };

  return {
    handleLike,
    handleDislike,
  };
}

export default usePostInteractions;
