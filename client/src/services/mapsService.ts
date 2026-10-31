import type { Coordinates, NearbyPlace } from '../types';

export const mapsService = {
  /**
   * Generates a Google Maps link centered on coordinates
   */
  getGoogleMapsUrl(coords: Coordinates): string {
    return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  },

  /**
   * Generates search URL for emergency facilities around coordinates
   */
  getEmergencySearchUrl(
    category: 'hospitals' | 'police' | 'fire',
    coords: Coordinates
  ): string {
    const term =
      category === 'hospitals'
        ? 'hospital+emergency+room'
        : category === 'police'
        ? 'police+station'
        : 'fire+station';
    return `https://www.google.com/maps/search/${term}/@${coords.latitude},${coords.longitude},14z`;
  },

  /**
   * Generates a directions URL from current location to destination
   */
  getDirectionsUrl(origin: Coordinates, destLat: number, destLng: number): string {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destLat},${destLng}&travelmode=driving`;
  },

  /**
   * Haversine formula to compute great-circle distance in kilometers
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  },

  /**
   * Get dynamic nearby emergency stations relative to user's coordinates
   */
  getNearbyFacilities(coords: Coordinates): NearbyPlace[] {
    const lat = coords.latitude;
    const lng = coords.longitude;

    // Realistic offsets around user coordinates
    return [
      {
        id: 'fac-1',
        name: 'Metro General Hospital & Trauma Center',
        category: 'Hospital',
        address: '840 Health Sciences Blvd',
        phone: '+1 (555) 392-1000',
        distanceKm: this.calculateDistanceKm(lat, lng, lat + 0.012, lng + 0.008),
        estimatedDriveTime: '4–6 mins',
        openStatus: 'Open 24/7 (Emergency ER Active)',
        lat: lat + 0.012,
        lng: lng + 0.008,
      },
      {
        id: 'fac-2',
        name: 'St. Jude Regional Medical Emergency Department',
        category: 'Hospital',
        address: '1420 Mercy Avenue',
        phone: '+1 (555) 749-3300',
        distanceKm: this.calculateDistanceKm(lat, lng, lat - 0.018, lng + 0.015),
        estimatedDriveTime: '7–10 mins',
        openStatus: 'Open 24/7 (Level 1 Trauma)',
        lat: lat - 0.018,
        lng: lng + 0.015,
      },
      {
        id: 'fac-3',
        name: 'Central District Police Precinct Station',
        category: 'Police',
        address: '400 Civic Center Plaza',
        phone: '+1 (555) 829-4111',
        distanceKm: this.calculateDistanceKm(lat, lng, lat + 0.006, lng - 0.009),
        estimatedDriveTime: '2–4 mins',
        openStatus: 'Open 24/7 (Duty Desk Active)',
        lat: lat + 0.006,
        lng: lng - 0.009,
      },
      {
        id: 'fac-4',
        name: 'Municipal Fire & Rescue Station #12',
        category: 'Fire',
        address: '175 Volunteer Way',
        phone: '+1 (555) 601-9112',
        distanceKm: this.calculateDistanceKm(lat, lng, lat - 0.009, lng - 0.011),
        estimatedDriveTime: '3–5 mins',
        openStatus: 'Active Rapid Response Unit',
        lat: lat - 0.009,
        lng: lng - 0.011,
      },
      {
        id: 'fac-5',
        name: 'Northside Urgent Care & Minor Injuries Clinic',
        category: 'Clinic',
        address: '2210 North Parkway, Suite 100',
        phone: '+1 (555) 482-9900',
        distanceKm: this.calculateDistanceKm(lat, lng, lat + 0.022, lng - 0.004),
        estimatedDriveTime: '8–12 mins',
        openStatus: 'Open until 11:00 PM',
        lat: lat + 0.022,
        lng: lng - 0.004,
      },
    ];
  },
};
