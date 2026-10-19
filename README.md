# Pixies Core — Isolated Administrative Center & Governance Hub

**Pixies Core** is the dedicated, high-security administrative dashboard built exclusively for the **Pink Pixies** beauty professional marketplace. It is strictly isolated from the public consumer website and designed to be deployed on an independent HTTPS host or subdomain (e.g., `https://admin.pinkpixies.com` or private internal VPN).

---

## 🎨 Visual Identity & Design System

- **Color Palette**: Deep Pitch Black (`#050508`), Charcoal Glass Surface (`rgba(14, 14, 22, 0.72)`), Neon Hot Pink (`#EC4899`, `#F472B6`, `#FF2D87`).
- **Glassmorphic Aesthetics**: Multi-layered frosted glass panels (`backdrop-filter: blur(24px)`), subtle neon pink border gradients, and specular highlights.
- **Blurry Transitions**: Cinematic blurry fade-in and fade-out transitions (`filter: blur(...)` to `blur(0px)`) between screens, views, and navigation tabs.
- **Inspirations**: Built with reference to modern Shadcn administrative UI standards, adapted with the Pink Pixies luxury dark neon visual language.

---

## 🚀 Key Screens & Architecture

### 1. Initialization Splash Screen
- **Typography**: Glowing brand display **"Pixies Core"** with live system status feed.
- **3D Heart Activation**: Multi-layered 3D SVG heart featuring specular reflection and dynamic pulsating neon activation waves that turn on and off in realistic cycles.
- **Progress Counter**: Real-time progress bar calibrating from **0% to 100%** with cryptographic status updates, concluding with a smooth blurry exit into the Sign-In portal.

### 2. Live Video Background Sign-In Portal
- **Ambient Live Video**: High-definition ambient particle video loop with integrated fallback canvas mesh.
- **Role-Based Access Control (RBAC)**: Users select their designated role (*General Manager*, *Staff Member*, *Platform Administrator*, *Finance Lead*).
- **Strict Role Matching**: The system validates user credentials against their officially registered clearance level:
  - If a user selects a role that does **not** match the database record for that email, access is **immediately blocked**, a security alert is displayed, and a violation entry is logged to the Security Ledger.
  - If verified, the user is issued a session token and transitioned via blurry fade into the executive dashboard.

### 3. Executive Dashboard Suite
- **Shadcn-Inspired Collapsible Sidebar**: Fast switching across operational modules.
- **Top Header**: Global command palette (`Ctrl + K`), active session health monitor, role clearance pill, and alert drawer.
- **Modules**:
  1. **Overview Dashboard**: Gross volume (ZMW), platform take-rate (15%), booking velocity, interactive SVG revenue trend curve, and live verification spotlight.
  2. **Technician & Lash Verification Center**: Review pending nail and lash licenses, view certificates, approve or reject applications, and grant the official **"Pink Badge"**.
  3. **Appointments & Bookings**: Dispatch tracker, service details, and manual Twilio WhatsApp confirmation triggers.
  4. **Financials & Payment Router**: Monitor dual gateway split between **Paystack** (African local currencies: ZMW, NGN, ZAR) and **Stripe Connect** (International cards).
  5. **Personnel Governance (RBAC)**: Manage internal accounts, clearance ranks, and access privileges.
  6. **Security Center & Audit Ledger**: Immutable audit log capturing all sign-in events, sign-out timestamps, blocked role mismatch attempts, and administrative actions with full JSON export.
  7. **System Settings**: Platform maintenance mode, Twilio WhatsApp sandbox dispatch, Courier/Novu notification relay test.
  8. **Marketing & HR Live Concierge Desk**: Two-way realtime communication pipeline receiving user inquiries from the consumer website via a secured API bridge. Marketing & HR personnel review client context and respond directly with quick-reply templates.
  9. **Login Portal Video Background & Brand Hub**: Dedicated control center for Marketing & HR to dynamically update the background video stream URL (MP4/WebM), fallback poster, and particle canvas mesh with 1:1 live preview simulation.

---

## 🔐 Authorized Demo Credentials

For development and internal verification, the following clearance profiles are pre-configured in the directory:

| Full Name | Role Selected | Official Email | Passphrase | Clearance Level |
| :--- | :--- | :--- | :--- | :--- |
| **Elena Rostova** | General Manager | `manager@pinkpixies.com` | `password123` | Level 4 — Executive |
| **Maya Lin** | Staff Member | `staff@pinkpixies.com` | `password123` | Level 2 — Operational |
| **Kavita Patel** | Platform Administrator | `admin@pinkpixies.com` | `password123` | Level 5 — Root Authority |
| **David Mwamba** | Finance & Treasury | `finance@pinkpixies.com` | `password123` | Level 3 — Treasury |

> **Security Note**: Attempting to sign in as `staff@pinkpixies.com` while selecting **General Manager** will immediately trigger a `ROLE_MISMATCH_SECURITY_VIOLATION` block recorded in the Audit Ledger.

---

## 🌐 Production Live Architecture: Cloudflare Pages + Vercel + Clerk + Supabase

### 1. Cloudflare Pages (Frontend Hosting)
- **Deployment**: Connect this repository to Cloudflare Pages.
- **Build Output Directory**: `.` (Root)
- **Custom Subdomain**: `admin.pinkpixies.com` (Isolated from consumer domain `pinkpixies.com`).
- **Security**: Cloudflare SSL/TLS Full (Strict) + Web Application Firewall (WAF).

### 2. Vercel Serverless Backend (`api/`)
- **Serverless Endpoints**:
  - `POST /api/bridge/chat-inbound`: Receives customer inquiries from the main web using `x-api-key`.
  - `POST /api/bridge/chat-reply`: Dispatches Marketing & HR manual responses to the client stream.
  - `GET /api/media/get-login-video`: Delivers the current login background video configuration.
  - `POST /api/media/update-login-video`: Restricted endpoint for Marketing/HR video updates.
  - `POST /api/auth/verify-session`: Clerk session verification & RBAC token decoding.

### 3. New Supabase Account Database Setup
- Execute `supabase_new_setup.sql` in your **NEW** Supabase project's SQL Editor.
- Enables realtime publications for `support_conversations`, `support_messages`, `admin_portal_config`, and `appointments`.

### 4. Zero-Leak Environment Configuration
Refer to `.env.example` for the complete blueprint. Secrets are stored strictly in Vercel and Cloudflare dashboard vaults and are never committed to version control.

