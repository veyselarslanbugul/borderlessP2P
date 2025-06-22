interface ReputationBarProps {
  rating: number;
  maxRating?: number;
}

const ReputationBar = ({ rating, maxRating = 5 }: ReputationBarProps) => {
  // Ensure rating is between 0 and maxRating
  const normalizedRating = Math.min(Math.max(0, rating), maxRating);
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => (
          <span 
            key={index} 
            className={`text-2xl ${
              index < normalizedRating 
                ? 'text-yellow-400' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="ml-2 text-gray-700 dark:text-gray-300">
        {normalizedRating}/{maxRating}
      </span>
    </div>
  );
};

export default ReputationBar; 