import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  Coordinates,
  EmergencyCategory,
  EmergencyContact,
  EmergencyRequest,
  EmergencyUrgency,
} from '../types';
import { locationService } from '../services/locationService';
import { emergencyAPI, contactAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface EmergencyContextType {
  coords: Coordinates;
  isLocating: boolean;
  locationError: string | null;
  refreshLocation: () => Promise<Coordinates>;
  activeSOS: EmergencyRequest | null;
  sosHistory: EmergencyRequest[];
  contacts: EmergencyContact[];
  triggerSOS: (
    type?: EmergencyCategory,
    urgency?: EmergencyUrgency,
    details?: string
  ) => Promise<EmergencyRequest>;
  cancelSOS: (requestId: string) => Promise<void>;
  resolveSOS: (requestId: string) => Promise<void>;
  reloadHistory: () => Promise<void>;
  reloadContacts: () => Promise<void>;
}

const DEFAULT_COORDS: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 15,
  address: 'San Francisco, CA (Default Coordinate)',
  timestamp: Date.now(),
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [coords, setCoords] = useState<Coordinates>(DEFAULT_COORDS);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeSOS, setActiveSOS] = useState<EmergencyRequest | null>(null);
  const [sosHistory, setSosHistory] = useState<EmergencyRequest[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  // Refresh current location using browser geolocation API
  const refreshLocation = useCallback(async (): Promise<Coordinates> => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const res = await locationService.getCurrentLocation();
      setCoords(res.coords);
      if (res.error) {
        setLocationError(res.error);
      }
      return res.coords;
    } catch (err: any) {
      setLocationError(err?.message || 'Failed to detect device location');
      return coords;
    } finally {
      setIsLocating(false);
    }
  }, [coords]);

  // Initial location fetch
  useEffect(() => {
    refreshLocation();
  }, []);

  // Load user's emergency requests from MERN backend
  const reloadHistory = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await emergencyAPI.getAll();
      if (res.success && Array.isArray(res.emergencies)) {
        const mapped: EmergencyRequest[] = res.emergencies.map((e: any) => ({
          id: e.id || e._id,
          userId: e.userId,
          userName: userProfile?.fullName || 'User',
          userPhone: userProfile?.phoneNumber || '',
          type: (e.type as EmergencyCategory) || 'Medical',
          urgency: 'Critical',
          status: e.status === 'Cancelled' ? 'cancelled' : e.status === 'Resolved' ? 'resolved' : 'active',
          location: {
            latitude: e.latitude,
            longitude: e.longitude,
            accuracy: e.accuracy || 15,
            address: e.address || '',
          },
          timestamp: e.createdAt || new Date().toISOString(),
          additionalDetails: e.description,
          disclaimer:
            'Emergency request recorded in ResQNow MERN database. Emergency services are NOT automatically dispatched; use one-touch call buttons to dial 911 / 112.',
        }));
        setSosHistory(mapped);
        const active = mapped.find((item) => item.status === 'active');
        if (active) {
          setActiveSOS(active);
        }
      }
    } catch (err) {
      console.warn('Axios load emergency history failed:', err);
    }
  }, [currentUser, userProfile]);

  // Load user's emergency contacts from MERN backend
  const reloadContacts = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await contactAPI.getAll();
      if (res.success && Array.isArray(res.contacts)) {
        const mapped: EmergencyContact[] = res.contacts.map((c: any) => ({
          id: c.id || c._id,
          name: c.name,
          relationship: c.relationship,
          phoneNumber: c.phone,
          isPrimary: Boolean(c.isPrimary),
          createdAt: c.createdAt,
        }));
        setContacts(mapped);
      }
    } catch (err) {
      console.warn('Axios load contacts failed:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      reloadHistory();
      reloadContacts();
    }
  }, [currentUser, reloadHistory, reloadContacts]);

  // Trigger SOS Flow via MERN backend Express REST API
  const triggerSOS = async (
    type: EmergencyCategory = 'Medical',
    urgency: EmergencyUrgency = 'Critical',
    details: string = ''
  ): Promise<EmergencyRequest> => {
    // 1. Fetch fresh GPS location from device
    const currentPos = await refreshLocation();

    const userId = currentUser ? currentUser.uid : 'guest-user';
    const userName = userProfile?.fullName || 'Anonymous User';
    const userPhone = userProfile?.phoneNumber || 'Not provided';

    try {
      // 2. POST to Express API -> saves to MongoDB
      const res = await emergencyAPI.create({
        type,
        description: details || `Emergency SOS for ${type}`,
        latitude: currentPos.latitude,
        longitude: currentPos.longitude,
        accuracy: currentPos.accuracy,
        address: currentPos.address,
      });

      const serverEmergency = res.emergency || {};
      const newRequest: EmergencyRequest = {
        id: serverEmergency.id || serverEmergency._id || `sos-${Date.now()}`,
        userId,
        userName,
        userPhone,
        type,
        urgency,
        status: 'active',
        location: currentPos,
        timestamp: serverEmergency.createdAt || new Date().toISOString(),
        additionalDetails: details,
        notifiedContactsCount: contacts.length,
        disclaimer:
          'Emergency request created in ResQNow MongoDB. Direct civil dispatch is not initiated automatically. Use the direct buttons to dial 911 / 112.',
      };

      setActiveSOS(newRequest);
      setSosHistory((prev) => [newRequest, ...prev]);
      return newRequest;
    } catch (err: any) {
      console.error('Express emergency creation error, using local fallback:', err);
      const fallbackRequest: EmergencyRequest = {
        id: `sos-${Date.now()}`,
        userId,
        userName,
        userPhone,
        type,
        urgency,
        status: 'active',
        location: currentPos,
        timestamp: new Date().toISOString(),
        additionalDetails: details,
        notifiedContactsCount: contacts.length,
        disclaimer:
          'Emergency request recorded locally. Contact 911 / 112 directly.',
      };
      setActiveSOS(fallbackRequest);
      setSosHistory((prev) => [fallbackRequest, ...prev]);
      return fallbackRequest;
    }
  };

  const cancelSOS = async (requestId: string): Promise<void> => {
    try {
      await emergencyAPI.update(requestId, { status: 'Cancelled' });
    } catch (err) {
      console.warn('Axios cancel SOS error:', err);
    }
    if (activeSOS?.id === requestId) {
      setActiveSOS(null);
    }
    setSosHistory((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'cancelled' } : r))
    );
  };

  const resolveSOS = async (requestId: string): Promise<void> => {
    try {
      await emergencyAPI.update(requestId, { status: 'Resolved' });
    } catch (err) {
      console.warn('Axios resolve SOS error:', err);
    }
    if (activeSOS?.id === requestId) {
      setActiveSOS(null);
    }
    setSosHistory((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'resolved' } : r))
    );
  };

  return (
    <EmergencyContext.Provider
      value={{
        coords,
        isLocating,
        locationError,
        refreshLocation,
        activeSOS,
        sosHistory,
        contacts,
        triggerSOS,
        cancelSOS,
        resolveSOS,
        reloadHistory,
        reloadContacts,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

export default EmergencyContext;
