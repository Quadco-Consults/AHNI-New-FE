import { useCallback, useMemo, useRef, useEffect } from 'react';

// Debounce hook for search inputs and API calls
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Stable callback that doesn't change reference unless dependencies change
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  return useCallback(callback, deps);
};

// Memoized value that only recalculates when dependencies change
export const useStableMemo = <T>(
  factory: () => T,
  deps: any[]
): T => {
  return useMemo(factory, deps);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }

    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

// Virtual scrolling helper for large lists
export const useVirtualList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  return {
    visibleItems,
    setScrollTop,
    totalHeight: items.length * itemHeight,
  };
};

import { useState } from 'react';