export type EmergencyCategory =
  | 'Medical'
  | 'Accident'
  | 'Fire'
  | 'Personal Safety'
  | 'Natural Disaster'
  | 'Other';

export type EmergencyUrgency = 'Critical' | 'High' | 'Medium' | 'Low';

export type RequestStatus = 'created' | 'acknowledging' | 'active' | 'resolved' | 'cancelled';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bloodType?: string;
  allergies?: string;
  emergencyNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
  address?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPrimary?: boolean;
  createdAt?: string;
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: EmergencyCategory;
  urgency: EmergencyUrgency;
  status: RequestStatus;
  location: Coordinates;
  timestamp: string;
  additionalDetails?: string;
  notifiedContactsCount?: number;
  disclaimer: string;
}

export interface IncidentReport {
  id: string;
  userId: string;
  type: EmergencyCategory;
  description: string;
  location: Coordinates;
  dateTime: string;
  imageBase64?: string;
  additionalNotes?: string;
  aiClassification?: {
    category: EmergencyCategory;
    urgency: EmergencyUrgency;
    summary: string;
    recommendedAction: string;
  };
  status: 'Submitted' | 'Under Review' | 'Archived';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}

export interface AIClassificationResult {
  category: EmergencyCategory;
  urgency: EmergencyUrgency;
  summary: string;
  recommendedAction: string;
  immediateChecklist: string[];
  isDemo?: boolean;
}

export interface AIImageAnalysisResult {
  observations: string;
  possibleCategory: string;
  safetyRecommendations: string[];
  cautionDisclaimer: string;
  isDemo?: boolean;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: 'Hospital' | 'Police' | 'Fire' | 'Clinic';
  address: string;
  phone: string;
  distanceKm: number;
  estimatedDriveTime: string;
  openStatus: string;
  lat: number;
  lng: number;
}
