import React from "react";

export function useIsOnline(callback) {
  const [isOnline, setOnline] = React.useState();

  const dataRef = React.useRef(null);
  dataRef.current = { callback };

  React.useEffect(() => {
    function handleOnline(event) {
      setOnline(true);
      if (dataRef.current.callback) {
        dataRef.current.callback(true, event);
      }
    }

    function handleOffline(event) {
      setOnline(true);
      if (dataRef.current.callback) {
        dataRef.current.callback(false, event);
      }
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export default useIsOnline;
