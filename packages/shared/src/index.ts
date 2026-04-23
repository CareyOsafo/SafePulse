// SafePulse Shared Types and Constants
// Emergency Response System for Ghana

// ============================================================
// ENUMS
// ============================================================

export enum EmergencyType {
  MEDICAL = 'medical',
  FIRE = 'fire',
  SAFETY = 'safety',
  SECURITY = 'security',
}

export enum IncidentStatus {
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  ON_SCENE = 'on_scene',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
  CLOSED = 'closed',
}

export enum IncidentPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IntakeSource {
  APP = 'app',
  USSD = 'ussd',
  WEB = 'web',
  API = 'api',
}

export enum LocationSource {
  GPS = 'gps',
  NETWORK = 'network',
  LANDMARK = 'landmark',
  SAVED_PLACE = 'saved_place',
  MANUAL = 'manual',
}

export enum LocationConfidence {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNKNOWN = 'unknown',
}

export enum UnitType {
  AMBULANCE = 'ambulance',
  POLICE = 'police',
  FIRE = 'fire',
  SECURITY = 'security',
  MIXED = 'mixed',
}

export enum UnitStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ON_BREAK = 'on_break',
}

export enum AssignmentStatus {
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum KycStatus {
  NOT_STARTED = 'not_started',
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

export enum AppRole {
  CITIZEN = 'citizen',
  UNIT = 'unit',
  DISPATCHER = 'dispatcher',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
}

export enum NotificationChannel {
  PUSH = 'push',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETRYING = 'retrying',
}

export enum UssdSessionState {
  INIT = 'init',
  SELECT_TYPE = 'select_type',
  CONFIRM = 'confirm',
  SELECT_LOCATION = 'select_location',
  ENTER_LANDMARK = 'enter_landmark',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum IncidentEventType {
  CREATED = 'created',
  ACKNOWLEDGED = 'acknowledged',
  STATUS_CHANGED = 'status_changed',
  LOCATION_UPDATED = 'location_updated',
  UNIT_ASSIGNED = 'unit_assigned',
  UNIT_ACCEPTED = 'unit_accepted',
  UNIT_DECLINED = 'unit_declined',
  UNIT_EN_ROUTE = 'unit_en_route',
  UNIT_ON_SCENE = 'unit_on_scene',
  BACKUP_REQUESTED = 'backup_requested',
  ESCALATED = 'escalated',
  NOTE_ADDED = 'note_added',
  MESSAGE_SENT = 'message_sent',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
  MARKED_SAFE = 'marked_safe',
  CANT_LOCATE = 'cant_locate',
}

// ============================================================
// SOCKET.IO EVENT TYPES
// ============================================================

export const SocketEvents = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  // Incident Events
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_UPDATED: 'incident:updated',
  INCIDENT_ACKNOWLEDGED: 'incident:acknowledged',
  INCIDENT_RESOLVED: 'incident:resolved',
  INCIDENT_CANCELLED: 'incident:cancelled',

  // Location Events
  LOCATION_UPDATED: 'location:updated',
  UNIT_LOCATION_UPDATED: 'unit_location:updated',

  // Assignment Events
  ASSIGNMENT_OFFERED: 'assignment:offered',
  ASSIGNMENT_ACCEPTED: 'assignment:accepted',
  ASSIGNMENT_DECLINED: 'assignment:declined',
  ASSIGNMENT_EXPIRED: 'assignment:expired',
  ASSIGNMENT_CANCELLED: 'assignment:cancelled',

  // Unit Events
  UNIT_STATUS_CHANGED: 'unit:status_changed',
  UNIT_ONLINE: 'unit:online',
  UNIT_OFFLINE: 'unit:offline',

  // Notification Events
  DELIVERY_RESULT: 'delivery:result',

  // KYC Events
  KYC_STATUS_UPDATED: 'kyc:status_updated',

  // Dispatch Events
  ESCALATION_ALERT: 'escalation:alert',
  BACKUP_REQUESTED: 'backup:requested',
} as const;

export type SocketEventType = typeof SocketEvents[keyof typeof SocketEvents];

// ============================================================
// ROOM PATTERNS
// ============================================================

export const RoomPatterns = {
  agency: (agencyId: string) => `agency:${agencyId}`,
  unit: (unitId: string) => `unit:${unitId}`,
  incident: (incidentId: string) => `incident:${incidentId}`,
  user: (userId: string) => `user:${userId}`,
} as const;

// ============================================================
// BULLMQ QUEUE NAMES
// ============================================================

export const QueueNames = {
  DISPATCH: 'dispatch',
  NOTIFICATIONS: 'notifications',
  CLEANUP: 'cleanup',
} as const;

export const JobNames = {
  // Dispatch Jobs
  OFFER_TIMEOUT: 'dispatch.offer_timeout',
  ESCALATE: 'dispatch.escalate',
  CHECK_EN_ROUTE: 'dispatch.check_en_route',
  AUTO_REASSIGN: 'dispatch.auto_reassign',

  // Notification Jobs
  SEND_NOTIFICATION: 'notify.send',
  RETRY_NOTIFICATION: 'notify.retry',

  // Cleanup Jobs
  EXPIRE_TRACKING_TOKENS: 'cleanup.expire_tracking_tokens',
  CLEANUP_SESSIONS: 'cleanup.sessions',
} as const;

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ============================================================
// DOMAIN TYPES
// ============================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LocationBundle {
  coordinates: Coordinates;
  source: LocationSource;
  confidence: LocationConfidence;
  timestamp: string;
  landmark?: string;
  savedPlaceId?: string;
  savedPlaceName?: string;
}

export interface User {
  id: string;
  supabaseUid: string;
  phoneNumber: string;
  fullName: string | null;
  kycStatus: KycStatus;
  ghanaCardLast4: string | null;
  appRole: AppRole;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  code: string;
  type: UnitType;
  region: string;
  isActive: boolean;
  createdAt: string;
}

export interface Unit {
  id: string;
  agencyId: string;
  callSign: string;
  unitType: UnitType;
  status: UnitStatus;
  currentLocation: Coordinates | null;
  lastLocationAt: string | null;
  phoneNumber: string | null;
  isOnDuty: boolean;
  createdAt: string;
}

export interface Incident {
  id: string;
  callerPhone: string;
  callerName: string | null;
  callerId: string | null;
  emergencyType: EmergencyType;
  status: IncidentStatus;
  priority: IncidentPriority;
  intakeSource: IntakeSource;
  locationSource: LocationSource;
  locationConfidence: LocationConfidence;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  landmark: string | null;
  trackingToken: string;
  trackingExpiresAt: string;
  callerKycStatus: KycStatus;
  callerVerified: boolean;
  agencyId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

export interface UnitAssignment {
  id: string;
  incidentId: string;
  unitId: string;
  status: AssignmentStatus;
  offeredAt: string;
  respondedAt: string | null;
  declineReason: string | null;
  expiresAt: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface LocationSnapshot {
  id: string;
  incidentId: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  source: LocationSource;
  confidence: LocationConfidence;
  capturedAt: string;
  createdAt: string;
}

export interface DeliveryLog {
  id: string;
  incidentId: string | null;
  recipientPhone: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  messageType: string;
  messageContent: string;
  providerResponse: unknown | null;
  attemptCount: number;
  nextRetryAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  eventType: IncidentEventType;
  actorId: string | null;
  actorRole: AppRole | null;
  metadata: unknown;
  createdAt: string;
}

export interface UssdSession {
  id: string;
  sessionId: string;
  phoneNumber: string;
  state: UssdSessionState;
  emergencyType: EmergencyType | null;
  locationData: unknown | null;
  incidentId: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DTO TYPES
// ============================================================

export interface CreateIncidentDto {
  emergencyType: EmergencyType;
  location: LocationBundle;
  priority?: IncidentPriority;
}

export interface UpdateLocationDto {
  coordinates: Coordinates;
  source?: LocationSource;
}

export interface AssignUnitDto {
  unitId: string;
  isPrimary?: boolean;
}

export interface UpdateIncidentStatusDto {
  status: IncidentStatus;
  notes?: string;
}

export interface DeclineAssignmentDto {
  reason: string;
}

export interface UssdRequestDto {
  sessionId: string;
  phoneNumber: string;
  text: string;
  serviceCode: string;
}

export interface UssdResponseDto {
  response: string;
  endSession: boolean;
}

// ============================================================
// SOCKET PAYLOAD TYPES
// ============================================================

export interface IncidentCreatedPayload {
  incident: Incident;
  location: LocationSnapshot | null;
}

export interface IncidentUpdatedPayload {
  incidentId: string;
  changes: Partial<Incident>;
  event: IncidentEvent;
}

export interface LocationUpdatedPayload {
  incidentId: string;
  location: LocationSnapshot;
}

export interface AssignmentOfferedPayload {
  assignment: UnitAssignment;
  incident: Incident;
  location: LocationSnapshot | null;
}

export interface AssignmentResponsePayload {
  assignment: UnitAssignment;
  incidentId: string;
}

export interface UnitLocationPayload {
  unitId: string;
  location: Coordinates;
  timestamp: string;
}

export interface DeliveryResultPayload {
  deliveryLog: DeliveryLog;
  incidentId: string | null;
}

export interface KycStatusPayload {
  userId: string;
  status: KycStatus;
  updatedAt: string;
}

// ============================================================
// ROUTING RULES
// ============================================================

export const EmergencyRouting: Record<EmergencyType, UnitType[]> = {
  [EmergencyType.MEDICAL]: [UnitType.AMBULANCE, UnitType.MIXED],
  [EmergencyType.SAFETY]: [UnitType.POLICE, UnitType.SECURITY, UnitType.MIXED],
  [EmergencyType.SECURITY]: [UnitType.POLICE, UnitType.SECURITY, UnitType.MIXED],
  [EmergencyType.FIRE]: [UnitType.FIRE, UnitType.MIXED],
};

// ============================================================
// DISPATCH CONFIG
// ============================================================

export const DispatchConfig = {
  normal: {
    offerCount: 3,
    offerStrategy: 'sequential' as const,
    offerTimeoutSeconds: 90,
    escalationMinutes: 5,
  },
  high: {
    offerCount: 2,
    offerStrategy: 'parallel' as const,
    offerTimeoutSeconds: 60,
    escalationMinutes: 3,
  },
  enRouteCheckMinutes: 5,
  trackingTokenExpiryHours: 24,
} as const;

// ============================================================
// USSD MENUS
// ============================================================

export const UssdMenus = {
  welcome: `Welcome to SafePulse Emergency
1. Medical Emergency
2. Fire Emergency
3. Safety Emergency
4. Security Emergency
0. Cancel`,

  confirm: (type: string) => `You selected: ${type}
1. Confirm & Send Alert
0. Cancel`,

  selectLocation: `Select location:
1. Use saved Home
2. Use saved Work
3. Enter landmark
0. Cancel`,

  enterLandmark: `Enter your location/landmark:`,

  success: (id: string) => `Emergency alert sent!
Tracking ID: ${id}
Help is on the way.`,

  cancelled: `Session cancelled.
Dial again for emergencies.`,

  error: `An error occurred.
Please try again or call emergency services directly.`,
} as const;

// ============================================================
// VALIDATION
// ============================================================

export const Validation = {
  phoneRegex: /^\+?[0-9]{10,15}$/,
  ghanaCardRegex: /^GHA-[0-9]{9}-[0-9]$/,
  minPasswordLength: 8,
  maxLandmarkLength: 200,
  maxNotesLength: 1000,
} as const;

// ============================================================
// HTTP STATUS CODES
// ============================================================

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ============================================================
// ERROR CODES
// ============================================================

export const ErrorCodes = {
  // Auth errors
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PHONE_ALREADY_EXISTS: 'PHONE_ALREADY_EXISTS',
  GHANA_CARD_ALREADY_EXISTS: 'GHANA_CARD_ALREADY_EXISTS',

  // KYC errors
  KYC_REQUIRED: 'KYC_REQUIRED',
  KYC_FAILED: 'KYC_FAILED',
  KYC_PENDING: 'KYC_PENDING',

  // Incident errors
  INCIDENT_NOT_FOUND: 'INCIDENT_NOT_FOUND',
  INCIDENT_ALREADY_RESOLVED: 'INCIDENT_ALREADY_RESOLVED',
  INCIDENT_CREATION_BLOCKED: 'INCIDENT_CREATION_BLOCKED',

  // Unit errors
  UNIT_NOT_FOUND: 'UNIT_NOT_FOUND',
  UNIT_NOT_AVAILABLE: 'UNIT_NOT_AVAILABLE',
  UNIT_NOT_ASSIGNED: 'UNIT_NOT_ASSIGNED',

  // Assignment errors
  ASSIGNMENT_NOT_FOUND: 'ASSIGNMENT_NOT_FOUND',
  ASSIGNMENT_ALREADY_RESPONDED: 'ASSIGNMENT_ALREADY_RESPONDED',
  ASSIGNMENT_EXPIRED: 'ASSIGNMENT_EXPIRED',

  // USSD errors
  USSD_SESSION_NOT_FOUND: 'USSD_SESSION_NOT_FOUND',
  USSD_SESSION_EXPIRED: 'USSD_SESSION_EXPIRED',
  USSD_INVALID_INPUT: 'USSD_INVALID_INPUT',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT',
} as const;
