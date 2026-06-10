import { useState, useCallback } from 'react';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface GeolocationState {
  coords: GeolocationCoords | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
  });

  const getCurrentLocation = useCallback((): Promise<GeolocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by your browser';
        setState({ coords: null, loading: false, error });
        reject(new Error(error));
        return;
      }

      setState({ coords: null, loading: true, error: null });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeolocationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setState({ coords, loading: false, error: null });
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }

          setState({ coords: null, loading: false, error: errorMessage });
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    ...state,
    getCurrentLocation,
  };
};
