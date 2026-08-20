# ◈ BugLens AI

> **"Find Bugs. Understand Code. Ship With Confidence."**

BugLens AI is an enterprise-grade intelligent software testing and code-quality platform that allows developers to connect GitHub repositories or upload source projects, analyze code using AI, automatically synthesize comprehensive test cases, execute tests in isolated environments, detect and classify vulnerabilities, pinpoint root causes with before/after diffs, monitor test coverage telemetry, and export professional audit reports.

---

## 🌟 Key Features

- **Interactive 3D AI Core**: WebGL 3D AI visualization responding to mouse parallax with graceful reduced-motion fallbacks.
- **AI Code Explorer & Monaco IDE**: Full IDE interface with AST syntax highlighting, security heuristics, and inline vulnerability diagnosis.
- **Autonomous Test Generator**: Synthesize Functional, Boundary, Negative, Security, API, and UI test cases with detailed step assertions.
- **Autonomous Test Lab**: Real-time WebSocket streaming of containerized test executions across isolated worker sandboxes.
- **AI Root-Cause & Fix Generator**: Typewriter-streamed explanations of test crashes with side-by-side Monaco diff patches.
- **Comprehensive Bug Management**: Multi-criteria filters across Critical, High, Medium, and Low severity classifications.
- **Coverage Telemetry Dashboard**: Real-time statement, line, branch, and function metrics with file-level hotspot detection.
- **Executive PDF Reporting**: One-click printable and downloadable audit reports with security findings and scorecards.
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Rapid keyboard-first navigation across projects, bugs, test suites, and actions.
- **TestAI Floating Assistant**: Context-aware AI assistant capable of answering questions about test failures and code hotspots.
- **Demo AI Mode**: Zero external API dependencies required for immediate demonstration with preloaded 1,284 files and 43 bugs.

---

## 🏗️ Architecture

```
                                  ┌────────────────────────┐
                                  │   React 19 + Vite UI   │
                                  │  (Three.js, Monaco,    │
                                  │   Tailwind, Motion)    │
                                  └───────────┬────────────┘
                                              │ REST / WebSockets
                                              ▼
                                  ┌────────────────────────┐
                                  │   Node.js Backend API  │
                                  │ (Express, TS, SocketIO,│
                                  │  JWT, Argon2, BullMQ)  │
                                  └─────┬────────────┬─────┘
                                        │            │
                         REST API Calls │            │ Background Queues
                                        ▼            ▼
                   ┌────────────────────────┐   ┌────────────────────────┐
                   │  FastAPI AI Service    │   │     BullMQ Workers     │
                   │ (Python, Pydantic,     │   │ (Simulated / Isolated  │
                   │  OpenAI API / Mock)    │   │  Playwright / Vitest)  │
                   └────────────────────────┘   └───────────┬────────────┘
                                                            │
                                             ┌──────────────┴─────────────┐
                                             ▼                            ▼
                                  ┌────────────────────┐       ┌────────────────────┐
                                  │    MongoDB 7.0     │       │    Redis 7.2       │
                                  │ (Users, Projects,  │       │ (Queues, Locks,    │
                                  │  Bugs, Test Cases) │       │  Real-time Events) │
                                  └────────────────────┘       └────────────────────┘
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js `v20+` or `v22+`
- Python `3.10+`
- Docker & Docker Compose (Optional for containerized run)
- MongoDB & Redis (Or Docker container)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/buglens-ai/buglens.git
cd "testing AI"

# Install all submodules
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Demo Dataset
Populate MongoDB with the pre-configured **E-Commerce API** demo project (1,284 files, 43 bugs, test runs):
```bash
npm run seed
```

### 4. Run Locally in Development Mode
```bash
# Concurrently starts Frontend (5173), Backend (5000), and AI Microservice (8000)
npm run dev
```
Visit **`http://localhost:5173`** in your browser.

---

## 🐳 Docker Deployment

To launch all 6 services (Frontend, Backend, AI Microservice, Worker, MongoDB, Redis) in unified containers:

```bash
docker compose up --build
```
- **Web Platform**: `http://localhost:80` (or `http://localhost:5173`)
- **Backend API**: `http://localhost:5000`
- **AI Microservice**: `http://localhost:8000/docs`

---

## 🔑 Demo Mode Credentials

The platform runs out-of-the-box in **Demo AI Mode** without requiring an OpenAI key:

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | `demo@buglens.ai` | `Password123!` |
| **Developer** | `sarah@buglens.ai` | `Password123!` |

*(Or click the "One-Click Login" button directly on the login page)*

---

## 📋 REST API Endpoints

### Authentication
- `POST /api/auth/register` — Register developer account
- `POST /api/auth/login` — Sign in and issue JWT & refresh cookie
- `POST /api/auth/refresh` — Rotate access token
- `POST /api/auth/logout` — Revoke session

### Projects & Repository Scans
- `GET /api/projects` — List project workspaces
- `POST /api/projects` — Create repository connection
- `POST /api/scans/projects/:id/scans` — Trigger full/quick/security scan

### Test Lab & Generation
- `GET /api/testing/projects/:id/suites` — List test suites
- `POST /api/testing/projects/:id/runs` — Trigger automated test execution
- `POST /api/ai/generate-tests` — AI test case synthesis

### Bugs & Heuristic Diagnostics
- `GET /api/bugs` — Filter bugs by severity, category, priority, status
- `POST /api/ai/root-cause` — AI root-cause analysis
- `POST /api/ai/generate-fix` — AI before/after patch synthesis

---

## 🧪 Testing

```bash
# Run unit & integration test suites across all services
npm test
```

---

## 📄 License
MIT License © 2026 BugLens AI Inc.
