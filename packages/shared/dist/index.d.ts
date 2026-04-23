export declare enum EmergencyType {
    MEDICAL = "medical",
    FIRE = "fire",
    SAFETY = "safety",
    SECURITY = "security"
}
export declare enum IncidentStatus {
    PENDING = "pending",
    ACKNOWLEDGED = "acknowledged",
    DISPATCHED = "dispatched",
    EN_ROUTE = "en_route",
    ON_SCENE = "on_scene",
    RESOLVED = "resolved",
    CANCELLED = "cancelled",
    CLOSED = "closed"
}
export declare enum IncidentPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum IntakeSource {
    APP = "app",
    USSD = "ussd",
    WEB = "web",
    API = "api"
}
export declare enum LocationSource {
    GPS = "gps",
    NETWORK = "network",
    LANDMARK = "landmark",
    SAVED_PLACE = "saved_place",
    MANUAL = "manual"
}
export declare enum LocationConfidence {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    UNKNOWN = "unknown"
}
export declare enum UnitType {
    AMBULANCE = "ambulance",
    POLICE = "police",
    FIRE = "fire",
    SECURITY = "security",
    MIXED = "mixed"
}
export declare enum UnitStatus {
    AVAILABLE = "available",
    BUSY = "busy",
    OFFLINE = "offline",
    ON_BREAK = "on_break"
}
export declare enum AssignmentStatus {
    OFFERED = "offered",
    ACCEPTED = "accepted",
    DECLINED = "declined",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare enum KycStatus {
    NOT_STARTED = "not_started",
    PENDING = "pending",
    VERIFIED = "verified",
    FAILED = "failed"
}
export declare enum AppRole {
    CITIZEN = "citizen",
    UNIT = "unit",
    DISPATCHER = "dispatcher",
    SUPERVISOR = "supervisor",
    ADMIN = "admin"
}
export declare enum NotificationChannel {
    PUSH = "push",
    WHATSAPP = "whatsapp",
    SMS = "sms"
}
export declare enum DeliveryStatus {
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    FAILED = "failed",
    RETRYING = "retrying"
}
export declare enum UssdSessionState {
    INIT = "init",
    SELECT_TYPE = "select_type",
    CONFIRM = "confirm",
    SELECT_LOCATION = "select_location",
    ENTER_LANDMARK = "enter_landmark",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum IncidentEventType {
    CREATED = "created",
    ACKNOWLEDGED = "acknowledged",
    STATUS_CHANGED = "status_changed",
    LOCATION_UPDATED = "location_updated",
    UNIT_ASSIGNED = "unit_assigned",
    UNIT_ACCEPTED = "unit_accepted",
    UNIT_DECLINED = "unit_declined",
    UNIT_EN_ROUTE = "unit_en_route",
    UNIT_ON_SCENE = "unit_on_scene",
    BACKUP_REQUESTED = "backup_requested",
    ESCALATED = "escalated",
    NOTE_ADDED = "note_added",
    MESSAGE_SENT = "message_sent",
    RESOLVED = "resolved",
    CANCELLED = "cancelled",
    MARKED_SAFE = "marked_safe",
    CANT_LOCATE = "cant_locate"
}
export declare const SocketEvents: {
    readonly CONNECTION: "connection";
    readonly DISCONNECT: "disconnect";
    readonly JOIN_ROOM: "join_room";
    readonly LEAVE_ROOM: "leave_room";
    readonly INCIDENT_CREATED: "incident:created";
    readonly INCIDENT_UPDATED: "incident:updated";
    readonly INCIDENT_ACKNOWLEDGED: "incident:acknowledged";
    readonly INCIDENT_RESOLVED: "incident:resolved";
    readonly INCIDENT_CANCELLED: "incident:cancelled";
    readonly LOCATION_UPDATED: "location:updated";
    readonly UNIT_LOCATION_UPDATED: "unit_location:updated";
    readonly ASSIGNMENT_OFFERED: "assignment:offered";
    readonly ASSIGNMENT_ACCEPTED: "assignment:accepted";
    readonly ASSIGNMENT_DECLINED: "assignment:declined";
    readonly ASSIGNMENT_EXPIRED: "assignment:expired";
    readonly ASSIGNMENT_CANCELLED: "assignment:cancelled";
    readonly UNIT_STATUS_CHANGED: "unit:status_changed";
    readonly UNIT_ONLINE: "unit:online";
    readonly UNIT_OFFLINE: "unit:offline";
    readonly DELIVERY_RESULT: "delivery:result";
    readonly KYC_STATUS_UPDATED: "kyc:status_updated";
    readonly ESCALATION_ALERT: "escalation:alert";
    readonly BACKUP_REQUESTED: "backup:requested";
};
export type SocketEventType = typeof SocketEvents[keyof typeof SocketEvents];
export declare const RoomPatterns: {
    readonly agency: (agencyId: string) => string;
    readonly unit: (unitId: string) => string;
    readonly incident: (incidentId: string) => string;
    readonly user: (userId: string) => string;
};
export declare const QueueNames: {
    readonly DISPATCH: "dispatch";
    readonly NOTIFICATIONS: "notifications";
    readonly CLEANUP: "cleanup";
};
export declare const JobNames: {
    readonly OFFER_TIMEOUT: "dispatch.offer_timeout";
    readonly ESCALATE: "dispatch.escalate";
    readonly CHECK_EN_ROUTE: "dispatch.check_en_route";
    readonly AUTO_REASSIGN: "dispatch.auto_reassign";
    readonly SEND_NOTIFICATION: "notify.send";
    readonly RETRY_NOTIFICATION: "notify.retry";
    readonly EXPIRE_TRACKING_TOKENS: "cleanup.expire_tracking_tokens";
    readonly CLEANUP_SESSIONS: "cleanup.sessions";
};
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
export declare const EmergencyRouting: Record<EmergencyType, UnitType[]>;
export declare const DispatchConfig: {
    readonly normal: {
        readonly offerCount: 3;
        readonly offerStrategy: "sequential";
        readonly offerTimeoutSeconds: 90;
        readonly escalationMinutes: 5;
    };
    readonly high: {
        readonly offerCount: 2;
        readonly offerStrategy: "parallel";
        readonly offerTimeoutSeconds: 60;
        readonly escalationMinutes: 3;
    };
    readonly enRouteCheckMinutes: 5;
    readonly trackingTokenExpiryHours: 24;
};
export declare const UssdMenus: {
    readonly welcome: "Welcome to SafePulse Emergency\n1. Medical Emergency\n2. Fire Emergency\n3. Safety Emergency\n4. Security Emergency\n0. Cancel";
    readonly confirm: (type: string) => string;
    readonly selectLocation: "Select location:\n1. Use saved Home\n2. Use saved Work\n3. Enter landmark\n0. Cancel";
    readonly enterLandmark: "Enter your location/landmark:";
    readonly success: (id: string) => string;
    readonly cancelled: "Session cancelled.\nDial again for emergencies.";
    readonly error: "An error occurred.\nPlease try again or call emergency services directly.";
};
export declare const Validation: {
    readonly phoneRegex: RegExp;
    readonly ghanaCardRegex: RegExp;
    readonly minPasswordLength: 8;
    readonly maxLandmarkLength: 200;
    readonly maxNotesLength: 1000;
};
export declare const HttpStatus: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const ErrorCodes: {
    readonly INVALID_TOKEN: "INVALID_TOKEN";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
    readonly PHONE_ALREADY_EXISTS: "PHONE_ALREADY_EXISTS";
    readonly GHANA_CARD_ALREADY_EXISTS: "GHANA_CARD_ALREADY_EXISTS";
    readonly KYC_REQUIRED: "KYC_REQUIRED";
    readonly KYC_FAILED: "KYC_FAILED";
    readonly KYC_PENDING: "KYC_PENDING";
    readonly INCIDENT_NOT_FOUND: "INCIDENT_NOT_FOUND";
    readonly INCIDENT_ALREADY_RESOLVED: "INCIDENT_ALREADY_RESOLVED";
    readonly INCIDENT_CREATION_BLOCKED: "INCIDENT_CREATION_BLOCKED";
    readonly UNIT_NOT_FOUND: "UNIT_NOT_FOUND";
    readonly UNIT_NOT_AVAILABLE: "UNIT_NOT_AVAILABLE";
    readonly UNIT_NOT_ASSIGNED: "UNIT_NOT_ASSIGNED";
    readonly ASSIGNMENT_NOT_FOUND: "ASSIGNMENT_NOT_FOUND";
    readonly ASSIGNMENT_ALREADY_RESPONDED: "ASSIGNMENT_ALREADY_RESPONDED";
    readonly ASSIGNMENT_EXPIRED: "ASSIGNMENT_EXPIRED";
    readonly USSD_SESSION_NOT_FOUND: "USSD_SESSION_NOT_FOUND";
    readonly USSD_SESSION_EXPIRED: "USSD_SESSION_EXPIRED";
    readonly USSD_INVALID_INPUT: "USSD_INVALID_INPUT";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly IDEMPOTENCY_CONFLICT: "IDEMPOTENCY_CONFLICT";
};
