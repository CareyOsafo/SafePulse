# SafePulse - Emergency Response System for Ghana

A comprehensive emergency response platform featuring:
- **Citizen Mobile App** (React Native/Expo) - Report emergencies with live location tracking
- **Dispatcher Dashboard** (Next.js) - RapidSOS-inspired 3-pane console for call-takers
- **Unit Portal** (Next.js PWA) - Mobile-first interface for response units
- **USSD Channel** - Emergency reporting via feature phones

## Architecture

```
safepulse/
├── apps/
│   ├── api/                 # NestJS backend
│   ├── dispatcher-web/      # Next.js dispatcher dashboard
│   ├── unit-portal-web/     # Next.js PWA for units
│   └── citizen-mobile/      # React Native (Expo) app
├── packages/
│   └── shared/              # Shared types and constants
├── migrations/              # SQL migrations
└── docker-compose.yml       # Redis for local dev
```

## Prerequisites

- Node.js 18+
- npm 9+ or yarn
- Docker (for Redis)
- Supabase account (for Postgres + Auth)
- iOS Simulator / Android Emulator (for mobile)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url> safepulse
cd safepulse
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to **Settings > API** and copy:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)
3. Go to **Settings > General** and note your Project Reference
4. Go to **Authentication > Providers** and enable **Phone** (SMS OTP)
   - Configure your SMS provider (Twilio recommended for Ghana)

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials and other settings.

### 4. Start Redis

```bash
docker-compose up -d
```

### 5. Run Database Migrations

```bash
# Using the Supabase SQL editor, run each migration file in order
# Or use psql if you have direct database access:
npm run db:migrate

# Seed sample data (agencies, units, dispatchers)
npm run db:seed
```

### 6. Build Shared Package

```bash
npm run build:shared
```

### 7. Start Development Servers

```bash
# All services (API + Web apps)
npm run dev

# Or individually:
npm run dev:api           # http://localhost:4000
npm run dev:dispatcher    # http://localhost:3000
npm run dev:unit          # http://localhost:3001
```

### 8. Start Mobile App (Expo)

```bash
cd apps/citizen-mobile
npm install
npx expo start
```

## API Documentation

Swagger UI available at: http://localhost:4000/api/docs

## Testing USSD

Simulate a USSD session:

```bash
# New session
curl -X POST http://localhost:4000/api/v1/ussd/session \
  -H "Content-Type: application/json" \
  -H "x-ussd-secret: your-ussd-webhook-secret" \
  -d '{"sessionId":"test-123","phoneNumber":"+233241234567","serviceCode":"*920*911#","text":""}'

# Select Medical (option 1)
curl -X POST http://localhost:4000/api/v1/ussd/session \
  -H "Content-Type: application/json" \
  -H "x-ussd-secret: your-ussd-webhook-secret" \
  -d '{"sessionId":"test-123","phoneNumber":"+233241234567","serviceCode":"*920*911#","text":"1"}'

# Confirm (option 1)
curl -X POST http://localhost:4000/api/v1/ussd/session \
  -H "Content-Type: application/json" \
  -H "x-ussd-secret: your-ussd-webhook-secret" \
  -d '{"sessionId":"test-123","phoneNumber":"+233241234567","serviceCode":"*920*911#","text":"1*1"}'

# Enter landmark
curl -X POST http://localhost:4000/api/v1/ussd/session \
  -H "Content-Type: application/json" \
  -H "x-ussd-secret: your-ussd-webhook-secret" \
  -d '{"sessionId":"test-123","phoneNumber":"+233241234567","serviceCode":"*920*911#","text":"1*1*3*Near Accra Mall"}'
```

## Testing KYC Verification

### With MetaMap API Key (Production)

The KYC service uses MetaMap's Ghana Card verification API:
- Endpoint: `POST https://api.prod.metamap.com/govchecks/v1/gh/verify-card`
- Set `METAMAP_API_KEY` in your `.env` file

```bash
# Start KYC verification (requires auth token)
curl -X POST http://localhost:4000/api/v1/kyc/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"ghanaCardNumber": "GHA-123456789-0"}'
```

### Without API Key (Development Stub)

If `METAMAP_API_KEY` is not set, the service runs in stub mode with simulated responses.

### Simulating Webhook Callback

```bash
curl -X POST http://localhost:4000/api/v1/kyc/webhooks/metamap \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "evt_123",
    "eventName": "verification_completed",
    "resource": {
      "id": "stub-1234567890",
      "status": "verified"
    }
  }'
```

## WebSocket Testing

Connect to WebSocket:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000/ws', {
  auth: { token: 'your-supabase-jwt' }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});

socket.on('incident:created', (data) => {
  console.log('New incident:', data);
});

// Join incident room
socket.emit('join_room', { room: 'incident:uuid-here' });
```

## Key Features

### Dispatch Engine
- **Normal priority**: Sequential offers to top 3 nearest units
- **High priority**: Parallel offers to top 2 units (first accept wins)
- Automatic timeout and re-offer on decline/expiry
- Escalation after 3-5 minutes with no response

### KYC Integration
- Ghana Card verification via MetaMap Government Checks API
- API Endpoint: `POST https://api.prod.metamap.com/govchecks/v1/gh/verify-card`
- HMAC hash storage for uniqueness (no plaintext storage)
- SOS allowed while KYC pending, blocked only if failed
- Supports both immediate verification and async webhook callbacks

### Notifications (Stubbed)
- Push (Firebase/Expo)
- WhatsApp (Meta Business API / Twilio)
- SMS (Africa's Talking / Twilio)
- Fallback chain: Push → WhatsApp → SMS

### Realtime Events
- Socket.IO with room-based subscriptions
- Rooms: `agency:{id}`, `unit:{id}`, `incident:{id}`, `user:{id}`
- Events: incident updates, location updates, assignment offers, delivery results

## Project Structure

### Backend (apps/api)
```
src/
├── auth/           # JWT verification, guards, decorators
├── database/       # Postgres connection
├── queue/          # BullMQ job queues
├── redis/          # Redis connection
└── modules/
    ├── incidents/    # Emergency requests
    ├── dispatch/     # Assignment engine
    ├── units/        # Response units
    ├── dispatcher/   # Dispatcher operations
    ├── contacts/     # Emergency contacts
    ├── users/        # User management
    ├── locations/    # Location utilities
    ├── notifications/# Multi-channel notifications
    ├── ussd/         # USSD state machine
    ├── kyc/          # Identity verification
    ├── realtime/     # WebSocket gateway
    └── tracking/     # Public tracking page
```

### Database Tables
- `users` - App users with KYC fields
- `emergency_contacts` - Trusted contacts
- `agencies` - Response agencies
- `agency_users` - Dispatchers/supervisors
- `units` - Response vehicles/teams
- `emergency_requests` - Incidents
- `location_snapshots` - Location history
- `unit_assignments` - Dispatch assignments
- `unit_location_pings` - Unit tracking
- `delivery_logs` - Notification tracking
- `incident_events` - Audit trail
- `ussd_sessions` - USSD state
- `webhook_events` - Idempotent webhook storage

## License

Proprietary - All rights reserved
