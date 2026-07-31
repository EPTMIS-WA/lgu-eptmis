# Employee Progress Tracking Management Information System

Employee Progress Tracking Management Information System, or EPTMIS-WA, is a web application for managing LGU employee work assignments, department workflows, task approvals, notifications, progress monitoring, accomplishment reporting, and Individual Performance Commitment and Review (IPCR) workflows.

The project is split into a React/Vite frontend and a Django REST Framework backend. The frontend provides role-based dashboards, task screens, reports, and IPCR workspaces, while the backend owns authentication, permissions, task workflow rules, IPCR form workflow rules, audit logs, notifications, file uploads, and local-to-cloud synchronization.

## System Information

EPTMIS-WA is intended for LGU offices that need one accountable place for employee assignments, department task coordination, progress evidence, approvals, accomplishment reporting, and IPCR evaluation. The system records who created a task, who is assigned to it, which department owns or reviews it, what files support it, when progress was submitted, and who approved, rejected, or reassigned the work. It also tracks IPCR rating periods, employee forms, target commitments, accomplishment submissions, function-level ratings, signoffs, and final approval status.

The system is role-scoped:

- Admin manages users, employee profiles, departments, tasks, reports, IPCR rating periods, IPCR audits, and organization-wide dashboard data.
- Mayor has management visibility over departments, tasks, reports, organization-wide performance metrics, and executive IPCR approvals.
- Department Head manages department tasks, reviews cross-department assignments, reviews submitted work, evaluates department IPCR forms, and monitors employee productivity.
- Employee receives assigned tasks, submits progress and files, checks notifications, views the personal IPCR workspace, and views personal reports.

The default deployment model is local-first. The Django server and SQLite database can run inside the office network so daily work can continue even when optional cloud services are unavailable. PostgreSQL/Supabase synchronization and S3-compatible media storage can be enabled when the office needs cloud backup, cross-site sync, or media transfer.

The reporting module supports accomplishment reports for visible users, department productivity reports, and IPCR report summaries. Accomplishment reports can be exported through `pdfkit` and `wkhtmltopdf` when those dependencies are installed. IPCR reports include an in-browser printable official form preview.

## Tech Stack

### Frontend

- React 19 with Vite
- React Router for page routing
- Axios for API requests
- HeroUI, Tailwind CSS, Ionicons, and Lucide React for UI
- Recharts for dashboard charts
- React Toastify and SweetAlert2 for user feedback

### Backend

- Django 6
- Django REST Framework
- Simple JWT with HTTP-only access and refresh cookies
- Django Filter and search filters
- SQLite as the default local database
- Optional PostgreSQL/Supabase cloud database for synchronization
- Optional S3-compatible media storage for cloud media sync

## Project Structure

```text
.
├── backend2/              # Django project and API apps
│   ├── apps/
│   │   ├── api/           # Health, connectivity, sync, feedback email routes
│   │   ├── authentication/# Users, login, logout, password, roles
│   │   ├── audit_logs/    # Task history API
│   │   ├── dashboard/     # Admin, head, and employee dashboard APIs
│   │   ├── department/    # Department records and head assignment
│   │   ├── employee/      # Employee profiles
│   │   ├── ipcr/          # IPCR forms, periods, ratings, signoffs, audit logs
│   │   ├── notification/  # In-app notifications
│   │   ├── performance/   # Performance-related app namespace
│   │   ├── synchronization/# Offline queue and cloud sync logic
│   │   └── task/          # Tasks, assignments, files, approvals
│   ├── backend/           # Django settings and URL configuration
│   └── manage.py
├── frontend/              # React/Vite application
│   ├── src/
│   │   ├── components/    # Layout, sidebar, dashboard widgets, modals, IPCR preview
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Dashboard, tasks, users, departments, reports, IPCR
│   │   ├── routes/        # Protected and role-based routes
│   │   └── services/      # API client and sync manager
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Main Features

- Role-based login for Admin, Mayor, Department Head, HRMO, and Employee accounts.
- Protected frontend routes and backend permissions based on user role.
- Admin user management for creating and updating users with linked employee profiles.
- Employee and department management, including department head assignment.
- Role-specific dashboards:
  - Admin and Mayor see organization-wide task metrics and department leaderboard data.
  - Department Heads see department productivity, employee performance, upcoming tasks, and activity.
  - Employees see their own assigned tasks, progress, upcoming work, and notifications.
- Task creation with multiple assignees, priority, deadline, reference files, and upload permissions.
- Cross-department task clearance, where assignments outside the creator's department require approval from the assignee department head.
- Task progress submission by assignees.
- Final completion approval, rejection, and reassignment workflow.
- Task file management for reference files and assignee uploads.
- Task audit logs that record creation, assignment review, submissions, approvals, rejection, reassignment, and file actions.
- In-app notifications for task assignment, approval, rejection, reassignment, submitted work, and system events.
- IPCR Management:
  - Admin opens IPCR rating periods and manages the HRMO-style audit queue.
  - Employees can view their active IPCR form from the IPCR workspace.
  - Department Heads and Admins review and rate team IPCR forms using quality, efficiency, and timeliness scores.
  - Mayor reviews HR-audited forms and performs executive approval.
  - IPCR reports summarize form counts by status and department and provide a printable official IPCR form preview.
- Connectivity health banner and local/cloud synchronization status.
- Local-first backend operation using SQLite, with optional cloud sync to PostgreSQL/Supabase.
- API failover in the frontend between local, network, localhost, and 127.0.0.1 API URLs.

## How It Works

### Authentication

Users log in through the React frontend. The frontend sends credentials to:

```text
POST /api/auth/login/
```

The backend authenticates the custom `Users` model by username and password. On success, it returns the user's role and stores JWT access and refresh tokens in HTTP-only cookies. The frontend then loads the current user from:

```text
GET /api/auth/me/
```

The frontend keeps basic user data in `localStorage` for routing and display. API authorization still depends on the backend cookies and backend permission classes.

### Role-Based Navigation

The frontend route guards work in three layers:

- `AuthRoute` keeps logged-in users away from the login page.
- `ProtectedRoute` redirects unauthenticated users to login.
- `RoleRoute` limits selected pages to specific roles.

The dashboard route selects the correct dashboard by role:

- `Employee` -> employee dashboard
- `Head` -> department head dashboard
- `Admin`, `Mayor`, and other management roles -> main dashboard

### Task Workflow

Tasks are created through the frontend and submitted to:

```text
POST /api/tasks/
```

The backend creates the task, links assignees through `TaskAssignment`, stores optional reference files, writes an audit log, and sends notifications.

Task status changes follow this flow:

```text
Pending -> In Progress -> For Approval -> Completed
```

Other possible task states are:

```text
Reassignment
Fail
```

If all assignees are in the creator's department, the task can move directly to `In Progress`. If one or more assignees are from another department, the task remains `Pending` until the required department head approves the assignment.

Relevant task actions include:

```text
POST /api/tasks/{id}/review-assignment/{assignment_id}/
POST /api/tasks/{id}/submit-progress/
POST /api/tasks/{id}/approve-completion/
POST /api/tasks/{id}/reject-completion/
POST /api/tasks/{id}/reassign/
```

When all assignees submit progress, the task moves to `For Approval`. The task creator can then approve it as `Completed` or reject it back to `In Progress`.

### IPCR Workflow

IPCR means Individual Performance Commitment and Review. The system stores IPCR records in the `apps.ipcr` Django app and exposes them through the React IPCR pages:

```text
/ipcr/my-form          Employee IPCR workspace
/ipcr/evaluations      Department Head/Admin evaluation queue
/ipcr/admin/manage     Admin HRMO-style rating period and audit workspace
/ipcr/executive        Mayor executive approval workspace
/reports/ipcr          IPCR report and printable form preview
```

Admin users can open rating periods for `H1`, `H2`, or `Year`. Opening a period also ensures the default IPCR function categories exist:

```text
Core       50%
Strategic 30%
Support   15%
```

The IPCR form status flow is:

```text
DRAFT -> TARGETS_SUBMITTED -> TARGETS_APPROVED -> ACCOMPLISHMENTS_SUBMITTED -> RATED -> HR_AUDITED -> MAYOR_APPROVED
```

Forms can also be marked:

```text
RETURNED
```

The React workspace includes employee target and accomplishment submission screens, team review screens, Admin audit screens, and Mayor approval screens. The current backend permission class still restricts non-read IPCR API requests to `Admin`, so Employee, Head, and Mayor write actions need permission work before they will behave as the UI suggests.

Department Heads and Admin users can review IPCR function rows, while rating submissions store quality, efficiency, and timeliness scores. The backend averages those three scores per function, applies category weights, stores the final numerical rating, and maps it to an adjectival rating:

```text
4.50+ Outstanding
3.50+ Very Satisfactory
2.50+ Satisfactory
1.50+ Unsatisfactory
Below 1.50 Poor
```

The backend records IPCR signoffs and audit logs for transitions such as target submission, target approval, rating, HR audit, and mayor approval. IPCR report generation supports year, period, and status filters and returns summary counts plus department breakdowns.

### Files and Audit Logs

Task files are stored through the `TaskFile` model. The system separates files into:

- `reference_file` for task instructions or supporting documents.
- `assignee_upload` for employee output or proof of progress.

Task history is stored in audit logs and exposed through:

```text
GET /api/audit-logs/
GET /api/audit-logs/?task={task_id}
```

### Notifications

The backend creates notifications when important task events happen. Users can load and mark notifications through:

```text
GET /api/notifications/
PATCH /api/notifications/{id}/
```

### Offline and Cloud Synchronization

The backend is designed to keep working against the local SQLite database when the cloud database is unavailable. Local changes are queued in `SyncRecord` records and can be synchronized to the configured cloud database later.

The frontend `SyncBanner` polls health and sync state through:

```text
GET /api/health/
GET /api/connectivity/
GET /api/sync/pending/
```

Synchronization endpoints include:

```text
POST /api/sync/
POST /api/sync/employee/
POST /api/sync/admin/
GET  /api/sync/status/
```

Employee sync pushes local changes to cloud. Admin sync pushes local changes and can pull cloud updates back into the local database.

Offline mode here means the local Django server and local database can continue operating when the cloud service is unavailable. The browser still needs to reach the local Django API to save data.

The system supports offline-capable local deployment with queued synchronization to Supabase. The hosted web deployment requires internet access.

Apply Supabase migrations from the frontend folder with the project-local Supabase CLI:

```powershell
cd frontend
npm exec supabase -- login
npm exec supabase -- link --project-ref jexafjjdkkdvhqzzpozu
npm exec supabase -- db push
```

The Supabase Realtime Broadcast channel used by the frontend and database trigger is:

```text
eptmis-cloud-db-changes
```

Override the channel name only if both the frontend environment and database trigger are changed together:

```env
VITE_SUPABASE_REALTIME_TOPIC=eptmis-cloud-db-changes
```

Broadcast role details for this project:

```text
Sender: Postgres trigger function with SECURITY DEFINER
Client role: anon, through the frontend Supabase anon key
Channel privacy: public
```

The database trigger calls `realtime.send(..., false)`, so the browser does not need an `authenticated` Realtime policy for the current Broadcast setup. If the channel is changed to private later, add matching Supabase Realtime authorization policies.

## API Overview

Main backend routes:

```text
/admin/                       Django admin
/api/auth/                    Login, logout, refresh, signup, current user, password change
/api/users/                   User management
/api/employees/               Employee profiles
/api/departments/             Department management
/api/tasks/                   Tasks, assignments, task files, task workflow actions
/api/audit-logs/              Task audit history
/api/emails/                  Feedback email API
/api/dashboard/               Admin and Mayor dashboard
/api/dashboard/head/          Department Head dashboard
/api/dashboard/employee/      Employee dashboard
/api/notifications/           User notifications
/api/ipcr/                    IPCR forms and workflow actions
/api/ipcr-templates/          IPCR templates
/api/ipcr-rating-periods/     IPCR rating periods
/api/ipcr-function-categories/ IPCR function categories
/api/health/                  Connectivity and sync health
/api/connectivity/            Connectivity status
/api/sync/                    Manual synchronization
/api/sync/employee/           Employee push sync
/api/sync/admin/              Admin push and pull sync
/api/sync/pending/            Pending sync queue
/api/sync/status/             Sync status
```

IPCR form actions:

```text
GET  /api/ipcr/my-form/
POST /api/ipcr/{id}/submit-targets/
POST /api/ipcr/{id}/approve-targets/
POST /api/ipcr/{id}/submit-accomplishments/
POST /api/ipcr/{id}/rate/
POST /api/ipcr/{id}/hr-audit/
POST /api/ipcr/{id}/mayor-approve/
GET  /api/ipcr/reports/generate/
POST /api/ipcr-rating-periods/{id}/close/
```

## Local Development

### Prerequisites

- Python 3.12 or newer recommended
- Node.js and npm
- Git
- Docker Desktop, if using Docker Compose

### Backend Setup

```powershell
cd backend2
Copy-Item .env.example .env
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate --database=default
python manage.py migrate --database=cloud
python manage.py createsuperuser
python serve_wsgi.py
```

The local `.env.example` sets `DEBUG=True`, so Django can use its local-only
development secret key fallback. When `DEBUG=False`, set `SECRET_KEY` or
`DJANGO_SECRET_KEY` yourself.

`python serve_wsgi.py` uses Waitress by default, which is the supported native
Windows WSGI server. Gunicorn is also available for Linux and WSL.

Waitress, default local server:

```powershell
cd backend2
python serve_wsgi.py
```

Waitress, explicit local server:

```powershell
cd backend2
$env:WSGI_SERVER = "waitress"
python serve_wsgi.py
```

Gunicorn on Linux or WSL:

```bash
cd backend2
WSGI_SERVER=gunicorn python serve_wsgi.py
```

Gunicorn on Linux or WSL with worker settings:

```bash
cd backend2
WSGI_SERVER=gunicorn GUNICORN_WORKERS=2 GUNICORN_THREADS=4 GUNICORN_TIMEOUT=120 python serve_wsgi.py
```

The backend API will be available at:

```text
http://localhost:8000/api/
```

The Django admin will be available at:

```text
http://localhost:8000/admin/
```

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

The frontend will be available at:

```text
http://localhost:5173/
```

The current frontend API client uses `/api` by default, then falls back to configured web, local, network, localhost, and 127.0.0.1 API bases:

```text
/api
http://localhost:8000/api
http://127.0.0.1:8000/api
```

Optional frontend environment variables:

```env
VITE_API_BASE_URL=/api
VITE_WEB_API_URL=https://portal.lgu-eptmis.com/api
VITE_LOCAL_API_URL=/api
VITE_NETWORK_API_URL=http://192.168.1.100:8000/api
VITE_API_TIMEOUT_MS=10000
VITE_SYNC_INTERVAL_MS=60000
VITE_SYNC_COMPLETION_TIMEOUT_MS=120000
```

The public frontend URL is `https://portal.lgu-eptmis.com`. Browser requests
should use the same-origin frontend API path `https://portal.lgu-eptmis.com/api`,
which proxies to the backend API at `https://api.lgu-eptmis.com/api`.
The localhost and LAN fallback variables are used only when the app is opened
from a local/LAN hostname.

### Cloudflare Pages Deployment

Deploy only the Vite frontend to Cloudflare Pages. Deploy the Django backend to
Railway.

Cloudflare Pages settings:

```text
Root directory: frontend
Framework preset: React (Vite)
Build command: npm run build
Build output directory: dist
```

If the frontend uses `/api`, Cloudflare Pages handles `/api/*` through
`frontend/functions/api/[[path]].js`, which proxies to the deployed Django API.
For Workers Builds, the same proxy behavior lives in
`frontend/worker/index.js`, and the SPA fallback is handled by
`not_found_handling` in `frontend/wrangler.toml`.

Cloudflare Pages runtime variable for the backend API:

```env
API_PROXY_URL=https://api.lgu-eptmis.com/api
```

Current public frontend URL:

```text
https://portal.lgu-eptmis.com
```

### Railway Backend Deployment

Create a Railway service for the Django API, not the frontend. Use these
settings:

```text
Root directory: leave blank
Config file: /backend2/railway.json
Builder: Dockerfile
Dockerfile path: Dockerfile.railway
Custom build command: leave blank
Watch paths: /backend2/**
Health check path: /api/healthz/
Public custom domain: api.lgu-eptmis.com
Target port: 8080
```

Railway resolves the configured Dockerfile path from the repository root for
this service, so `Dockerfile.railway` is a repo-root Dockerfile that copies the
`backend2` application into the image. The existing `backend2/Dockerfile`
remains for local Docker Compose.

Add a PostgreSQL service in the same Railway project and set the backend service
variables from `backend2/.env.railway.example`. At minimum, set:

```env
DJANGO_SETTINGS_MODULE=backend.settings
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app,.railway.internal,localhost,127.0.0.1,0.0.0.0,api.lgu-eptmis.com,eptmis-wa-api-production.up.railway.app,eptmis-wa-api.railway.internal,wnlf548z.up.railway.app
CORS_ALLOWED_ORIGINS=https://portal.lgu-eptmis.com
CSRF_TRUSTED_ORIGINS=https://portal.lgu-eptmis.com
AUTH_COOKIE_SECURE=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL_REQUIRE=True
DATABASE_CONN_MAX_AGE=600
REQUIRE_DATABASE_URL=True
# Use a Railway-only value. Do not reuse your local backend2/.env SECRET_KEY.
SECRET_KEY=${{secret(64)}}
WSGI_SERVER=gunicorn
WSGI_HOST=0.0.0.0
GUNICORN_WORKERS=2
GUNICORN_THREADS=4
GUNICORN_TIMEOUT=120
SYNC_AUTO_START_ON_QUEUE=False
SYNC_SCHEDULER_ENABLED=False
SYNC_CLOUD_CONNECT_TIMEOUT_SECONDS=2
```

Keep two separate secret values: `backend2/.env` is for local development, and
Railway service variables are for the deployed backend. They can both be named
`SECRET_KEY`; the isolation comes from where the value is stored.

The `Postgres` prefix in `${{Postgres.DATABASE_URL}}` must match the Railway
PostgreSQL service name. If your database service has a different name, use
that exact service name in the reference. If you do not set `DATABASE_URL`, the
backend can also use split Railway PostgreSQL variables: `PGHOST`, `PGPORT`,
`PGDATABASE`, `PGUSER`, and `PGPASSWORD`.

For the recommended hosted setup, `DATABASE_URL` must be Railway PostgreSQL.
Supabase should be configured only as the optional cloud/sync database using
`SUPABASE_DATABASE_URL` or the split `SUPABASE_*` variables. When Supabase is
unreachable, normal app requests continue against Railway PostgreSQL and sync
readiness turns off until Supabase comes back.

`backend2/railway.json` runs `python manage.py migrate --database=default`
before each deployment. Keep recurring deployments to Railway PostgreSQL
migrations only. If the Supabase sync database needs Django migrations, run
`python manage.py migrate --database=cloud` manually while Supabase is reachable;
do not put that in Railway pre-deploy unless you accept Supabase blocking
deployments. Railway uses `/api/healthz/` as a cheap liveness probe;
`/api/health/` remains the app's full connectivity and sync status endpoint.

Do not set `WSGI_PORT` in Railway. Railway injects `PORT`, and
`serve_wsgi.py` uses that value so the service binds to the port Railway
expects.

If you add or update the API custom domain through the Railway CLI, use:

```bash
railway domain api.lgu-eptmis.com --service <backend-service-name> --port 8080 --json
```

When setting comma-separated values from PowerShell, quote the whole assignment:

```powershell
railway variable set "ALLOWED_HOSTS=.railway.app,.up.railway.app,.railway.internal,localhost,127.0.0.1,0.0.0.0,api.lgu-eptmis.com,eptmis-wa-api-production.up.railway.app,eptmis-wa-api.railway.internal,wnlf548z.up.railway.app" --service eptmis-wa-api
```

If Cloudflare requires a deploy command, you are using Workers Builds rather
than the plain Pages Git build flow. This repo includes a Worker Static Assets
configuration at `frontend/wrangler.toml`.

Workers Builds settings:

```text
Root directory: frontend
Build command: npm run build
Deploy command: npx wrangler deploy
Non-production deploy command: npx wrangler versions upload
```

Do not set `CLOUDFLARE_API_TOKEN` manually unless it has Workers deploy
permissions. Prefer Cloudflare's automatically generated Workers Builds token.

If you keep the Supabase Edge Function in the request path instead of letting
Cloudflare proxy directly to Railway, update the Supabase Edge Function secrets
too:

```powershell
cd frontend
npm exec supabase -- secrets set DJANGO_API_ORIGIN=https://api.lgu-eptmis.com
npm exec supabase -- secrets set APP_ORIGIN=https://portal.lgu-eptmis.com
npm exec supabase -- functions deploy django-api --no-verify-jwt
```

### Run Backend as a Windows Service

Install Python 3.12 from python.org

Install the backend dependencies first:

```powershell
cd C:\xampp\htdocs\Employee-Progress-Tracking-Management-Information-System\backend2
"C:\Program Files\Python312\python.exe" -m pip install -r requirements.txt
```

Install and start the Windows service from an Administrator terminal:

```powershell
"C:\Program Files\Python312\python.exe" .\django_service.py --startup auto install
"C:\Program Files\Python312\python.exe" .\django_service.py start
```

Use these commands when managing the service:

```powershell
# Apply changes after editing django_service.py or service startup options
python django_service.py update --startup auto

# Start, stop, or restart the service
python django_service.py start
python django_service.py stop
python django_service.py restart

# Run in the current terminal for debugging instead of as a background service
python django_service.py debug

# Remove the service registration
python django_service.py remove
```

Check the service from Windows:

```powershell
sc query EPTMISDjangoBackend
Get-Service EPTMISDjangoBackend
```

The Windows service uses Waitress with the same host and port settings as
`serve_wsgi.py`:

```env
WSGI_HOST=0.0.0.0
WSGI_PORT=8000
WSGI_THREADS=8
WSGI_CONNECTION_LIMIT=100
```

Gunicorn is not supported by the native Windows service. Use Docker, Linux, or
WSL when Gunicorn is required.

## Docker Development

Docker runs the backend with Gunicorn only and serves the frontend with Nginx.
The frontend container proxies `/api/` and `/media/` to the backend container.
React owns `/admin/*` routes, so the Django admin remains available directly on
the backend port.

Build and start all services:

```powershell
docker compose up --build
```

Open the Nginx-served frontend:

```text
http://localhost:5173/
```

Open the Django admin directly through the backend:

```text
http://localhost:8000/admin/
```

Build and start only the backend with Gunicorn:

```powershell
docker compose up --build backend2
```

Build and start only the Nginx frontend:

```powershell
docker compose up --build frontend
```

Run the backend container with custom Gunicorn worker settings from PowerShell:

```powershell
$env:GUNICORN_WORKERS = "2"
$env:GUNICORN_THREADS = "4"
$env:GUNICORN_TIMEOUT = "120"
docker compose up --build backend2
```

Run the backend container with custom Gunicorn worker settings from Bash, Linux,
or WSL:

```bash
GUNICORN_WORKERS=2 GUNICORN_THREADS=4 GUNICORN_TIMEOUT=120 docker compose up --build backend2
```

Build the backend Docker image directly:

```powershell
docker build -t eptmis-backend .\backend2
```

Run the backend Docker image directly with Gunicorn:

```powershell
docker run --rm -p 8000:8000 `
  -v "${PWD}\certs:/certs:ro" `
  -e POSTGRES_SSLMODE=verify-full `
  -e POSTGRES_SSL_ROOT_CERT=/certs/prod-ca-2021.crt `
  eptmis-backend
```

Run the backend Docker image directly with custom Gunicorn settings:

```powershell
docker run --rm -p 8000:8000 `
  -v "${PWD}\certs:/certs:ro" `
  -e POSTGRES_SSLMODE=verify-full `
  -e POSTGRES_SSL_ROOT_CERT=/certs/prod-ca-2021.crt `
  -e GUNICORN_CMD_ARGS="--bind=0.0.0.0:8000 --workers=2 --threads=8 --timeout=120 --access-logfile=- --error-logfile=-" `
  eptmis-backend
```

Run services in the background:

```powershell
docker compose up --build --remove-orphans -d
```

Run migrations:

```powershell
docker compose exec backend2 python manage.py migrate --database=default
docker compose exec backend2 python manage.py migrate --database=cloud
```

Create a Django superuser:

```powershell
docker compose exec -it backend2 python manage.py createsuperuser
```

Tail logs:

```powershell
docker compose logs -f
```

Stop containers:

```powershell
docker compose down
```

Reset Docker volumes:

```powershell
docker compose down -v
```

## Environment Configuration

Railway backend variables are documented in `backend2/.env.railway.example`.
Use Railway reference variables for managed PostgreSQL instead of copying raw
database credentials into the repo.

`DATABASE_URL` is the primary application database. On Railway, point it at
Railway PostgreSQL:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_CONN_MAX_AGE=600
```

Alternative split Railway PostgreSQL variables:

```env
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGDATABASE=${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
PGSSLMODE=require
```

Backend cloud sync uses an optional PostgreSQL/Supabase database. Preferred:

```env
SUPABASE_DATABASE_URL=postgresql://user:password@host:6543/postgres?sslmode=require
CLOUD_DATABASE_SSL_REQUIRE=True
SYNC_CLOUD_CONNECT_TIMEOUT_SECONDS=2
```

You can also use split variables. These are aliases for the `cloud` database,
not the main Railway database:

```env
SUPABASE_DB=postgres
SUPABASE_USER=
SUPABASE_PASSWORD=
SUPABASE_HOST=
SUPABASE_PORT=6543
SUPABASE_SSLMODE=verify-full
SUPABASE_SSL_ROOT_CERT=/certs/prod-ca-2021.crt
```

Legacy `POSTGRES_*` cloud-sync variables still work, but the `SUPABASE_*` names
are clearer for Railway because Railway PostgreSQL already owns `DATABASE_URL`.

Docker Compose mounts the repository `certs` directory into the backend
container at `/certs`. Keep `certs/prod-ca-2021.crt` present when using
Supabase/PostgreSQL with `SUPABASE_SSLMODE=verify-full`.

Optional S3-compatible media storage:

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_ENDPOINT_URL=
AWS_S3_REGION_NAME=us-east-1
AWS_STORAGE_BUCKET_NAME=
SYNC_OFFLINE_MEDIA_SUBDIRS=task_files,task_template_files
```

Optional email feedback settings:

```env
EMAIL_BACKEND=
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=
FEEDBACK_RECIPIENT_EMAIL=
FEEDBACK_IMAGE_URL=
```

Optional sync settings:

```env
SYNC_BATCH_SIZE=50
SYNC_RETRY_BASE_SECONDS=30
SYNC_RETRY_MAX_SECONDS=3600
SYNC_QUEUE_RETENTION_DAYS=30
SYNC_CONFLICT_STRATEGY=latest_timestamp_wins
SYNC_AUTO_START_ON_HEALTH=false
SYNC_AUTO_START_ON_QUEUE=false
SYNC_SCHEDULER_ENABLED=false
SYNC_SCHEDULER_INTERVAL_SECONDS=300
```

For hosted Railway web services, keep queue auto-sync and the sync scheduler
off unless this web container is intentionally responsible for background sync.
Local/offline deployments default those settings on.

Do not commit real production secrets. Move deployment credentials into `.env` files, hosting secrets, or Docker secrets before production use.

## Current Integration Notes

- The backend default database is SQLite when `DATABASE_URL` is absent. Railway should set `DATABASE_URL` to Railway PostgreSQL. The configured `cloud` database is used only by the synchronization layer when Supabase credentials are available.
- The frontend API client uses `VITE_API_BASE_URL` first and `VITE_WEB_API_URL` second. Localhost and LAN fallbacks are enabled only when the app itself is opened from a local/LAN hostname.

## Common Development Commands

Frontend:

```powershell
cd frontend
npm run dev
npm run build
npm run preview
```

Backend:

```powershell
cd backend2
python manage.py makemigrations
python manage.py migrate --database=default
python manage.py migrate --database=cloud
python manage.py test
python serve_wsgi.py
python manage.py cleanup_sync_history --include-cloud
```

Synchronization management commands:

```powershell
cd backend2
python manage.py sync_to_cloud
python manage.py sync_from_cloud --skip-media
python manage.py upload_offline_media
python manage.py download_cloud_media
```

`sync_to_cloud` uploads local database changes and then uploads local media unless `--skip-media` is used. `sync_from_cloud --skip-media` pulls only cloud database records; without `--skip-media`, it also downloads cloud media.

By default, media sync includes both `backend2/media/task_files` and `backend2/media/task_template_files`, storing them under matching Supabase Storage prefixes. Set `SYNC_OFFLINE_MEDIA_SUBDIRS` to override that default.

Legacy media upload command:

```powershell
python manage.py sync_offline_media
```