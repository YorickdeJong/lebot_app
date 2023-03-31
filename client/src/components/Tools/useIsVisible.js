import { useState, useEffect } from 'react';
import { useIntersectionObserver } from 'react-native-intersection-observer';

function useIsVisible(ref) {
  const [isVisible, setIsVisible] = useState(false);
  
  const onIntersectionChange = (event) => {
      setIsVisible(event.isIntersecting);
  };

  const [observer, setObserver] = useIntersectionObserver(onIntersectionChange, {
      rootMargin: '0px',
      threshold: 1,
  });

  useEffect(() => {
    if (ref.current) {
      setObserver(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, observer, setObserver]);


  return isVisible;
}


export default useIsVisible;
