import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollProps {
  // eslint-disable-next-line no-unused-vars
  fetchData: (page: number) => void;
}

const useInfiniteScroll = ({ fetchData }: UseInfiniteScrollProps) => {
  const [page, setPage] = useState<number>(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback((node: Element | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  return { lastItemRef };
};

export default useInfiniteScroll;
