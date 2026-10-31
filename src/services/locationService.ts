import type { Coordinates } from '../types';

export interface LocationResult {
  coords: Coordinates;
  error?: string;
  isSimulated?: boolean;
}

// Fallback demo coordinates (San Francisco Civic Center)
const DEFAULT_FALLBACK_COORDS: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 25,
  address: 'San Francisco, CA (Default Demo Location)',
  timestamp: Date.now(),
};

export const locationService = {
  /**
   * Check if geolocation is supported in this environment
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'geolocation' in navigator;
  },

  /**
   * Request and obtain current GPS/Network coordinates
   */
  async getCurrentLocation(): Promise<LocationResult> {
    if (!this.isSupported()) {
      return {
        coords: DEFAULT_FALLBACK_COORDS,
        error: 'Browser geolocation is not supported on this device. Using demo coordinates.',
        isSimulated: true,
      };
    }

    return new Promise((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: Coordinates = {
            latitude: Number(position.coords.latitude.toFixed(6)),
            longitude: Number(position.coords.longitude.toFixed(6)),
            accuracy: Math.round(position.coords.accuracy),
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          };

          // Try reverse geocoding address
          coords.address = await this.reverseGeocode(coords.latitude, coords.longitude);

          resolve({ coords, isSimulated: false });
        },
        async (error) => {
          let userMessage = 'Unable to retrieve location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              userMessage =
                'Location permission was denied by browser settings. Please enable location permissions to share your live coordinates during emergencies.';
              break;
            case error.POSITION_UNAVAILABLE:
              userMessage = 'Location signal is currently unavailable from device sensors.';
              break;
            case error.TIMEOUT:
              userMessage = 'Location request timed out. Retrying with cached approximate position.';
              break;
          }

          resolve({
            coords: DEFAULT_FALLBACK_COORDS,
            error: userMessage,
            isSimulated: true,
          });
        },
        options
      );
    });
  },

  /**
   * Reverse geocode coordinates to a readable address
   */
  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const parts = data.display_name.split(', ');
          // Return shortened readable address
          return parts.slice(0, 3).join(', ');
        }
      }
    } catch {
      // Ignore network errors on reverse geocode
    }
    return `Lat: ${lat.toFixed(4)}, Long: ${lon.toFixed(4)}`;
  },

  /**
   * Watch location changes
   */
  watchPosition(
    onSuccess: (coords: Coordinates) => void,
    onError: (error: string) => void
  ): () => void {
    if (!this.isSupported()) {
      onError('Geolocation not supported');
      return () => {};
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        onSuccess({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
          timestamp: pos.timestamp,
        });
      },
      (err) => onError(err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  },
};
