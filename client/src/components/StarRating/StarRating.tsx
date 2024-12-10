import { useState } from 'react';
import './StarRating.css';

interface StarRatingProps {
  initialRating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating = ({ initialRating, onRatingChange }: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
    onRatingChange(value);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <span
            key={value}
            className={`star ${value <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;