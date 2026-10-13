# GridSentinel Ops

A responsive Next.js starter MVP for infrastructure operations intelligence. This first build is a **local demo** with illustrative data, interactive incident/work-order workflows, site and asset views, CSV preview, and a session-level audit trail.

## Requirements

- Node.js 18.17+ (Node.js 20 LTS recommended)
- npm
- VS Code (recommended)

## Run on Windows

1. Download and extract `GridSentinel-Ops.zip`.
2. Open the extracted `gridsentinel-ops` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Install packages:

   ```powershell
   npm install
   ```

5. Start the development server:

   ```powershell
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

To stop the server, focus the terminal and press `Ctrl + C`.

## What works in this version

- Overview dashboard with demo charts and site-health summaries.
- Sites & assets register with search and site-status filters.
- Incident inbox with status changes, search, filtering, and CSV export.
- Work orders: create tasks and update their statuses.
- CSV file preview (browser-side only; no data is uploaded to a server).
- Sample asset CSV download.
- Audit trail for actions performed in the current browser session.
- Responsive desktop, tablet, and mobile layouts.

## Important limitations

This is a front-end MVP/prototype. Data is illustrative and in-memory: reloading the page resets changes. There is no login, database, multi-tenant access control, durable audit log, server-side CSV processing, notification service, or live equipment/SCADA connection. The CSV preview reads local files in your browser; do not select confidential or sensitive operational data for this prototype. Never use demo alerts as the basis for real electrical safety decisions.

## Suggested next build steps

1. Add PostgreSQL and Prisma/Drizzle persistence.
2. Implement authentication, organization/tenant isolation, and server-side authorization.
3. Add schema validation, safe server-side CSV ingestion, and durable audit events.
4. Deploy a private pilot environment and agree data access in writing with a real operator.
5. Only then explore approved read-only integrations with equipment or operations platforms.

## Project structure

```text
app/
  globals.css       Responsive visual system
  layout.js         Root layout and page metadata
  page.js           Dashboard and interactive demo screens
components/         Reserved for future extracted components
lib/
  demo-data.js      Clearly illustrative demo records
```

## Tech stack

- Next.js 14 App Router
- React 18
- JavaScript
- Tailwind CSS 3 (with additional custom CSS for the dashboard)
- Recharts
- Lucide React icons
