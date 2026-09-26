import { useState } from 'react';

interface LocationState {
  coordinates: [number, number] | null; // [lng, lat]
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    loading: false,
    error: null,
    permissionDenied: false,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
        permissionDenied: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: [position.coords.longitude, position.coords.latitude],
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },
      (err) => {
        let msg = 'Failed to get location.';
        let isDenied = false;
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was not provided.';
          isDenied = true;
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'The request to get location timed out.';
        }

        setState({
          coordinates: null,
          loading: false,
          error: msg,
          permissionDenied: isDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const clearLocation = () => {
    setState({
      coordinates: null,
      loading: false,
      error: null,
      permissionDenied: false,
    });
  };

  const setManualCoordinates = (lng: number, lat: number) => {
    setState({
      coordinates: [lng, lat],
      loading: false,
      error: null,
      permissionDenied: false,
    });
  };

  return {
    ...state,
    requestLocation,
    clearLocation,
    setManualCoordinates,
  };
}
