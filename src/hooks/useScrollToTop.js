import {useEffect} from 'react';

const useScrollToTop = effect => {
  useEffect (
    () => {
      window.scrollTo (0, 0);
    },
    [effect]
  );

  return;
};

export default useScrollToTop;
