import React from 'react';
import { useMutation, gql } from '@apollo/client';
import StarRating from '../components/StarRating/StarRating';

// Define the GraphQL mutation
const SUBMIT_RATING = gql`
  mutation SubmitRating($userId: ID!, $itemId: ID!, $rating: Int!) {
    submitRating(userId: $userId, itemId: $itemId, rating: $rating) {
      success
      message
      averageRating
    }
  }
`;

// Define the props for the RateItem component
interface RateItemProps {
  userId: string;
  itemId: string;
  currentAverageRating: number;
}

const RateItem: React.FC<RateItemProps> = ({ userId, itemId, currentAverageRating }) => {
  const [submitRating, { data, loading, error }] = useMutation(SUBMIT_RATING, {
    // Optionally update the cache or refetch queries here
    // refetchQueries: [{ query: GET_ITEM_RATING, variables: { itemId } }],
  });

  const handleRatingChange = (rating: number) => {
    submitRating({
      variables: {
        userId,
        itemId,
        rating,
      },
    });
  };

  return (
    <div>
      <h2>Rate This Item</h2>
      <StarRating initialRating={currentAverageRating} onRatingChange={handleRatingChange} />
      {loading && <p>Submitting your rating...</p>}
      {error && <p>Error submitting rating: {error.message}</p>}
      {data && data.submitRating.success && <p>{data.submitRating.message}</p>}
      {data && data.submitRating.averageRating && (
        <p>Average Rating: {data.submitRating.averageRating.toFixed(2)} Stars</p>
      )}
    </div>
  );
};

export default RateItem;