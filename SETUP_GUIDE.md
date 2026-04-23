# SafePulse Complete Setup Guide

This guide will walk you through setting up the SafePulse Emergency Response System from scratch. No coding experience required - just follow each step carefully.

---

## Table of Contents
1. [Prerequisites - Install Required Software](#step-1-prerequisites---install-required-software)
2. [Set Up Supabase (Database & Authentication)](#step-2-set-up-supabase-database--authentication)
3. [Configure Environment Variables](#step-3-configure-environment-variables)
4. [Start Redis (Message Queue)](#step-4-start-redis-message-queue)
5. [Run Database Migrations](#step-5-run-database-migrations)
6. [Build and Start the Application](#step-6-build-and-start-the-application)
7. [Set Up the Mobile App](#step-7-set-up-the-mobile-app-optional)
8. [Verify Everything Works](#step-8-verify-everything-works)
9. [Troubleshooting](#troubleshooting)

---

## Step 1: Prerequisites - Install Required Software

### 1.1 Install Node.js

Node.js is the runtime that runs the application.

**For Mac:**
1. Open your web browser and go to: https://nodejs.org
2. Click the green button that says **"LTS"** (Long Term Support)
3. Open the downloaded file and follow the installer
4. To verify installation, open **Terminal** (search for it in Spotlight with Cmd+Space) and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x` or higher

**For Windows:**
1. Go to: https://nodejs.org
2. Click the green **"LTS"** button
3. Run the downloaded `.msi` file and follow the installer
4. Open **Command Prompt** (search for "cmd") and type:
   ```
   node --version
   ```

### 1.2 Install Docker Desktop

Docker runs Redis (the message queue system).

**For Mac:**
1. Go to: https://www.docker.com/products/docker-desktop
2. Click **"Download for Mac"**
3. Open the downloaded `.dmg` file
4. Drag Docker to your Applications folder
5. Open Docker from Applications
6. Wait for Docker to start (you'll see a whale icon in your menu bar)

**For Windows:**
1. Go to: https://www.docker.com/products/docker-desktop
2. Click **"Download for Windows"**
3. Run the installer
4. Restart your computer when prompted
5. Open Docker Desktop from the Start menu

### 1.3 Install a Code Editor (Optional but Recommended)

**Visual Studio Code** is a free, beginner-friendly editor:
1. Go to: https://code.visualstudio.com
2. Download and install for your operating system

---

## Step 2: Set Up Supabase (Database & Authentication)

Supabase provides the database and user authentication for SafePulse.

### 2.1 Create a Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with your GitHub account or email

### 2.2 Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `safepulse` (or any name you prefer)
   - **Database Password:** Create a strong password and **SAVE IT SOMEWHERE SAFE** - you'll need it later!
   - **Region:** Choose the closest to your users (e.g., "West EU" for Ghana)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

### 2.3 Get Your Supabase Credentials

Once your project is ready:

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the Settings menu
3. You'll see several values - **copy each one and save them**:

| Setting | What to Copy |
|---------|-------------|
| **Project URL** | `https://xxxxx.supabase.co` |
| **anon public** | A long string starting with `eyJ...` |
| **service_role** | Another long string starting with `eyJ...` (Keep this SECRET!) |

4. Click **"General"** in the Settings menu
5. Find **"Reference ID"** and copy it (it looks like `grwrvmoqhrqjqlfkczju`)

### 2.4 Get Your Database Connection String

1. In Settings, click **"Database"**
2. Scroll down to **"Connection string"**
3. Click the **"URI"** tab
4. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the database password you created earlier

### 2.5 Enable Phone Authentication

1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"**
3. Find **"Phone"** and click to expand it
4. Toggle it **ON**
5. For SMS provider, you can use:
   - **Twilio** (recommended) - requires a Twilio account
   - **MessageBird**
   - Leave it on "Supabase" for testing (limited free SMS)
6. Click **"Save"**

---

## Step 3: Configure Environment Variables

Environment variables tell the application how to connect to your services.

### 3.1 Navigate to the Project Folder

Open **Terminal** (Mac) or **Command Prompt** (Windows):

```bash
cd /path/to/SafePulse
```

Replace `/path/to/SafePulse` with the actual path to your SafePulse folder.

### 3.2 Create the Main Environment File

The project already has a `.env` file. Let's update it with your Supabase credentials.

**Option A: Using a Text Editor**
1. Open the SafePulse folder in VS Code or any text editor
2. Find and open the file named `.env` in the root folder
3. Update these lines with your Supabase values:

```env
# SUPABASE - Replace with YOUR values from Step 2.3
SUPABASE_URL="https://YOUR-PROJECT-ID.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_KEY="your-service-role-key-here"
SUPABASE_PROJECT_REF="your-project-reference-id"

# DATABASE - Replace with YOUR connection string from Step 2.4
DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT-ID.supabase.co:5432/postgres
```

4. Save the file

### 3.3 Create Environment Files for Web Apps

**For Dispatcher Dashboard:**
1. Go to the folder: `apps/dispatcher-web/`
2. Create a new file called `.env.local`
3. Add these contents:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

**For Unit Portal:**
1. Go to the folder: `apps/unit-portal-web/`
2. Create a new file called `.env.local`
3. Add the same contents as above

---

## Step 4: Start Redis (Message Queue)

Redis handles background jobs like sending notifications.

### 4.1 Start Docker

Make sure Docker Desktop is running (look for the whale icon in your menu bar/system tray).

### 4.2 Start Redis Container

Open Terminal/Command Prompt and navigate to the SafePulse folder:

```bash
cd /path/to/SafePulse
```

Then run:

```bash
docker-compose up -d
```

**What this does:** Downloads and starts Redis in the background.

To verify Redis is running:
```bash
docker ps
```

You should see `safepulse-redis` in the list.

---

## Step 5: Run Database Migrations

Migrations create all the database tables that SafePulse needs.

### 5.1 Option A: Using Supabase SQL Editor (Recommended for Beginners)

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

Now you need to run each migration file in order. The files are in the `migrations/` folder:

4. Open the SafePulse folder on your computer
5. Go to the `migrations/` folder
6. Open `001_create_users.sql` in a text editor
7. Copy ALL the contents
8. Paste into the Supabase SQL Editor
9. Click **"Run"** (or press Cmd+Enter / Ctrl+Enter)
10. Repeat steps 6-9 for each file in order:
    - `002_create_emergency_contacts.sql`
    - `003_create_agencies.sql`
    - `004_create_units.sql`
    - `005_create_emergency_requests.sql`
    - `006_create_location_snapshots.sql`
    - `007_create_unit_assignments.sql`
    - `008_create_unit_location_pings.sql`
    - `009_create_delivery_logs.sql`
    - `010_create_incident_events.sql`
    - `011_create_ussd_sessions.sql`
    - `012_create_webhook_events.sql`
    - `013_create_additional_indexes.sql`

11. Finally, run `014_seed_data.sql` to add sample data (test agencies and units)

### 5.2 Option B: Using Command Line (Advanced)

If you have `psql` installed:

```bash
npm run db:migrate
npm run db:seed
```

---

## Step 6: Build and Start the Application

### 6.1 Install Dependencies

In Terminal/Command Prompt, from the SafePulse folder:

```bash
npm install
```

**Wait for this to complete** - it may take 2-5 minutes.

### 6.2 Build the Shared Package

```bash
npm run build:shared
```

### 6.3 Start All Services

To start everything at once:

```bash
npm run dev
```

This starts:
- **API Server** at http://localhost:4000
- **Dispatcher Dashboard** at http://localhost:3000
- **Unit Portal** at http://localhost:3001

**Keep this terminal window open** - closing it will stop the servers.

### 6.4 Verify Services Are Running

Open your web browser and visit:
- http://localhost:4000/api/docs - API Documentation (Swagger)
- http://localhost:3000 - Dispatcher Dashboard
- http://localhost:3001 - Unit Portal

---

## Step 7: Set Up the Mobile App (Optional)

The citizen mobile app is built with Expo (React Native).

### 7.1 Install Expo CLI

```bash
npm install -g expo-cli
```

### 7.2 Navigate to Mobile App Folder

```bash
cd apps/citizen-mobile
```

### 7.3 Install Mobile App Dependencies

```bash
npm install
```

### 7.4 Create Mobile Environment File

Create a file called `.env` in the `apps/citizen-mobile/` folder:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=http://YOUR-COMPUTER-IP:4000/api/v1
EXPO_PUBLIC_SOCKET_URL=http://YOUR-COMPUTER-IP:4000
```

**Important:** Replace `YOUR-COMPUTER-IP` with your actual local IP address:
- **Mac:** Run `ipconfig getifaddr en0` in Terminal
- **Windows:** Run `ipconfig` and look for "IPv4 Address"

### 7.5 Start the Mobile App

```bash
npx expo start
```

This opens Expo Developer Tools in your browser.

### 7.6 Run on Your Phone

1. Install the **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in the terminal/browser with:
   - **iPhone:** Camera app
   - **Android:** Expo Go app

---

## Step 8: Verify Everything Works

### 8.1 Test the API

Visit http://localhost:4000/api/docs in your browser. You should see the Swagger documentation.

### 8.2 Test the Dispatcher Dashboard

1. Go to http://localhost:3000
2. You should see a login page
3. Use the test credentials (if seeded) or create a new account through Supabase

### 8.3 Test USSD (Command Line)

Open a new terminal and run:

```bash
curl -X POST http://localhost:4000/api/v1/ussd/session \
  -H "Content-Type: application/json" \
  -H "x-ussd-secret: your-ussd-webhook-secret" \
  -d '{"sessionId":"test-123","phoneNumber":"+233241234567","serviceCode":"*920*911#","text":""}'
```

You should see a welcome menu response.

---

## Troubleshooting

### "Cannot find module" errors

Run these commands:
```bash
npm run clean
npm install
npm run build:shared
```

### Redis connection errors

1. Make sure Docker Desktop is running
2. Run: `docker-compose down` then `docker-compose up -d`

### Database connection errors

1. Check your `DATABASE_URL` in `.env`
2. Make sure you replaced `[YOUR-PASSWORD]` with your actual password
3. Make sure there are no extra spaces or quotes

### "Port already in use" errors

Another application is using the port. Either:
- Close the other application, OR
- Change the port in `.env` (e.g., `PORT=4001`)

### Supabase authentication errors

1. Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
2. Make sure you enabled Phone authentication in Supabase

### Mobile app can't connect to API

1. Make sure you're using your computer's IP address, not `localhost`
2. Make sure your phone and computer are on the same WiFi network
3. Check if any firewall is blocking port 4000

### Need to start over?

```bash
# Stop everything
docker-compose down

# Remove all installed packages
npm run clean

# Start fresh
npm install
npm run build:shared
docker-compose up -d
npm run dev
```

---

## Quick Reference - Commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run build:shared` | Build the shared package |
| `npm run dev` | Start all services |
| `npm run dev:api` | Start only the API |
| `npm run dev:dispatcher` | Start only the Dispatcher Dashboard |
| `npm run dev:unit` | Start only the Unit Portal |
| `docker-compose up -d` | Start Redis |
| `docker-compose down` | Stop Redis |
| `npm run clean` | Remove all node_modules |

---

## Service URLs (Local Development)

| Service | URL |
|---------|-----|
| API Server | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| Dispatcher Dashboard | http://localhost:3000 |
| Unit Portal | http://localhost:3001 |

---

## Getting Help

If you encounter issues not covered here:

1. Check the error message carefully
2. Search for the error message online
3. Check the project's GitHub issues
4. Reach out to the development team

---

**Congratulations!** You've successfully set up SafePulse. The system is now running on your local machine for development and testing.
