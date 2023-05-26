import { useEffect, useState } from 'react';

export const useIsFocused = (currentSlideIndex, slideIndex) => {
  const [isFocused, setIsFocused] = useState(currentSlideIndex === slideIndex);

  useEffect(() => {
    setIsFocused(currentSlideIndex === slideIndex);
  }, [currentSlideIndex, slideIndex]);

  return isFocused;
};

