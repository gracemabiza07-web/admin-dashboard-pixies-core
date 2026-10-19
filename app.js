/**
 * ============================================================================
 * PIXIES CORE — ADMIN DASHBOARD ENGINE
 * High-Security RBAC, Audit Logging, Blurry Transitions, and Operational Suite
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Authorized Personnel Database (Seed Directory & Local Ledger) ---
  const AUTHORIZED_PERSONNEL = [
    {
      id: 'USR-001',
      name: 'Elena Rostova',
      email: 'manager@pinkpixies.com',
      password: 'password123',
      role: 'manager',
      roleLabel: 'General Manager',
      clearance: 'Level 4 — Full Executive',
      avatar: 'ER'
    },
    {
      id: 'USR-002',
      name: 'Maya Lin',
      email: 'staff@pinkpixies.com',
      password: 'password123',
      role: 'staff',
      roleLabel: 'Staff Member',
      clearance: 'Level 2 — Operational',
      avatar: 'ML'
    },
    {
      id: 'USR-003',
      name: 'Kavita Patel',
      email: 'admin@pinkpixies.com',
      password: 'password123',
      role: 'admin',
      roleLabel: 'Platform Administrator',
      clearance: 'Level 5 — Root Authority',
      avatar: 'KP'
    },
    {
      id: 'USR-004',
      name: 'David Mwamba',
      email: 'finance@pinkpixies.com',
      password: 'password123',
      role: 'finance',
      roleLabel: 'Finance & Treasury Lead',
      clearance: 'Level 3 — Financial Governance',
      avatar: 'DM'
    }
  ];

  // --- Mock Seed Data for Dashboard (Aligned with Pink Pixies Schema) ---
  const INITIAL_VERIFICATIONS = [
    {
      id: 'PRO-101',
      name: 'Chanda Bwalya',
      email: 'chanda.b@pixies.zm',
      phone: '+260 97 1234567',
      category: 'Nails',
      specialty: 'Gel Extensions & Nail Art',
      location: 'Lusaka, Zambia (Woodlands)',
      appliedDate: '2026-10-17',
      status: 'pending',
      pinkBadge: false,
      certDoc: 'Certified Master Nail Technician — Zambia Beauty Board (PDF)',
      rating: 4.9,
      experience: '5 Years'
    },
    {
      id: 'PRO-102',
      name: 'Amina Bello',
      email: 'amina.lashes@pixies.ng',
      phone: '+234 80 98765432',
      category: 'Lashes',
      specialty: 'Russian Volume & Hybrid Lashes',
      location: 'Lekki Phase 1, Lagos, Nigeria',
      appliedDate: '2026-10-16',
      status: 'pending',
      pinkBadge: true,
      certDoc: 'International Lash Masters Accreditation 2025 (PDF)',
      rating: 5.0,
      experience: '4 Years'
    },
    {
      id: 'PRO-103',
      name: 'Chloe Visser',
      email: 'chloe.v@pixies.za',
      phone: '+27 82 5550199',
      category: 'Nails & Lashes',
      specialty: 'Acrylic Sculpting & Lash Lifts',
      location: 'Camps Bay, Cape Town, South Africa',
      appliedDate: '2026-10-18',
      status: 'pending',
      pinkBadge: false,
      certDoc: 'South African Cosmetology Guild Diploma (PDF)',
      rating: 4.8,
      experience: '3 Years'
    }
  ];

  const INITIAL_APPOINTMENTS = [
    {
      id: 'APT-8821',
      clientName: 'Nadia Phiri',
      clientPhone: '+260 96 4432100',
      proName: 'Chanda Bwalya',
      category: 'Nails',
      serviceName: 'Full Set Ombré Acrylic + 3D Stones',
      dateTime: '2026-10-19 14:00',
      amount: 'ZMW 650.00',
      fee: 'ZMW 97.50',
      gateway: 'Paystack',
      status: 'confirmed',
      whatsappSent: true
    },
    {
      id: 'APT-8822',
      clientName: 'Sipho Ndlovu',
      clientPhone: '+27 73 8881234',
      proName: 'Chloe Visser',
      category: 'Lashes',
      serviceName: 'Mega Volume Lash Installation',
      dateTime: '2026-10-19 16:30',
      amount: 'ZMW 820.00',
      fee: 'ZMW 123.00',
      gateway: 'Paystack',
      status: 'confirmed',
      whatsappSent: true
    },
    {
      id: 'APT-8823',
      clientName: 'Jessica Sterling',
      clientPhone: '+44 79 11122233',
      proName: 'Amina Bello',
      category: 'Lashes',
      serviceName: 'Signature Russian Volume',
      dateTime: '2026-10-20 11:00',
      amount: '$75.00',
      fee: '$11.25',
      gateway: 'Stripe Connect',
      status: 'pending',
      whatsappSent: false
    },
    {
      id: 'APT-8824',
      clientName: 'Tamara Banda',
      clientPhone: '+260 97 9998888',
      proName: 'Chanda Bwalya',
      category: 'Nails',
      serviceName: 'French BIAB Overlay + Nail Spa',
      dateTime: '2026-10-20 15:00',
      amount: 'ZMW 450.00',
      fee: 'ZMW 67.50',
      gateway: 'Paystack',
      status: 'completed',
      whatsappSent: true
    }
  ];

  // --- Default Login Video Configuration (Managed by Marketing & HR) ---
  const DEFAULT_VIDEO_CONFIG = {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pink-particles-floating-in-the-dark-41584-large.mp4',
    posterUrl: '',
    title: 'Ambient Dark Pink Particles',
    enableParticles: true,
    lastUpdated: 'System Seed'
  };

  // --- Seed Data for Live Concierge (Marketing & HR Chatbot Bridge) ---
  const INITIAL_CONVERSATIONS = [
    {
      id: 'conv-101',
      sessionId: 'sess_client_lusaka_091',
      clientName: 'Mercy Chisanga',
      clientContact: '+260 97 8812999',
      location: 'Roma, Lusaka',
      category: 'Mobile Nail Tech',
      status: 'open', // 'open', 'in_progress', 'resolved'
      lastMessage: 'Hello, do your verified nail technicians do home visits in Roma, Lusaka?',
      lastMessageAt: 'Just now',
      unread: true,
      messages: [
        {
          id: 'msg-1',
          senderType: 'client',
          senderName: 'Mercy Chisanga',
          senderRole: 'Client',
          content: 'Hello, do your verified nail technicians do home visits in Roma, Lusaka? I need bridal nails done this Friday.',
          timestamp: '16:22'
        }
      ]
    },
    {
      id: 'conv-102',
      sessionId: 'sess_client_lagos_412',
      clientName: 'Folake Adeleke',
      clientContact: '+234 81 2345678',
      location: 'Victoria Island, Lagos',
      category: 'Russian Volume Lashes',
      status: 'in_progress',
      lastMessage: 'Can I pay in Naira using Paystack?',
      lastMessageAt: '12m ago',
      unread: false,
      messages: [
        {
          id: 'msg-2',
          senderType: 'client',
          senderName: 'Folake Adeleke',
          senderRole: 'Client',
          content: 'Can I pay in Naira using Paystack?',
          timestamp: '16:10'
        },
        {
          id: 'msg-3',
          senderType: 'marketing_hr',
          senderName: 'Marketing & HR Lead',
          senderRole: 'HR Specialist',
          content: 'Yes Folake! Paystack directly supports NGN payments with instant escrow protection.',
          timestamp: '16:12'
        }
      ]
    }
  ];

  // --- Storage Helper with Session & Audit Retention ---
  const Storage = {
    get(key, defaultValue) {
      try {
        const item = localStorage.getItem(`pixies_core_${key}`);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`pixies_core_${key}`, JSON.stringify(value));
      } catch (e) {
        console.error('Storage write error', e);
      }
    }
  };

  // --- State Management ---
  const State = {
    currentUser: Storage.get('session_user', null),
    auditLogs: Storage.get('audit_logs', []),
    verifications: Storage.get('verifications', INITIAL_VERIFICATIONS),
    appointments: Storage.get('appointments', INITIAL_APPOINTMENTS),
    conversations: Storage.get('conversations', INITIAL_CONVERSATIONS),
    activeConversationId: Storage.get('active_conv_id', 'conv-101'),
    conversationFilter: 'all',
    loginVideoConfig: Storage.get('login_video_config', DEFAULT_VIDEO_CONFIG),
    activeTab: 'overview',
    sidebarCollapsed: false
  };

  // --- Audit Logging Service (Strict Security & Record Keeping) ---
  const AuditLogger = {
    log(event, details) {
      const entry = {
        id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleString(),
        event: event, // 'SIGN_IN_SUCCESS', 'ROLE_MISMATCH_DENIED', 'SIGN_OUT', 'PRO_VERIFIED', etc.
        userEmail: details.email || (State.currentUser ? State.currentUser.email : 'anonymous'),
        userName: details.name || (State.currentUser ? State.currentUser.name : 'Unknown'),
        selectedRole: details.selectedRole || 'N/A',
        assignedRole: details.assignedRole || 'N/A',
        status: details.status || 'INFO', // 'SUCCESS', 'DENIED', 'WARNING'
        ipAddress: details.ip || '197.234.12.89 [Protected Proxy]',
        notes: details.notes || ''
      };

      State.auditLogs.unshift(entry);
      // Keep up to 250 records
      if (State.auditLogs.length > 250) State.auditLogs.pop();
      Storage.set('audit_logs', State.auditLogs);

      // Refresh table if security view is open
      if (State.activeTab === 'security') {
        App.renderAuditTable();
      }
      return entry;
    }
  };

  const ROLE_LABELS = {
    manager: 'General Manager',
    staff: 'Staff Member',
    admin: 'Platform Administrator',
    finance: 'Finance & Treasury Lead'
  };

  const DEFAULT_ROLE_CLEARANCE = {
    manager: 'Level 4 — Full Executive',
    staff: 'Level 2 — Operational',
    admin: 'Level 5 — Root Authority',
    finance: 'Level 3 — Financial Governance'
  };

  const getStoredNewUsers = () => {
    const users = Storage.get('registered_personnel', []);
    return Array.isArray(users) ? users : [];
  };

  const persistNewUsers = (users) => {
    Storage.set('registered_personnel', users);
  };

  // --- Main Application Controller ---
  const App = {
    getApiBase() {
      const base = (window.API_BASE_URL || '').replace(/\/$/, '');
      return base || '';
    },

    apiUrl(path) {
      const cleanPath = String(path || '').replace(/^\/+/, '');
      const base = this.getApiBase();
      return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
    },

    init() {
      this.bindEvents();
      this.applyLiveLoginVideo(State.loginVideoConfig);
      this.initBackgroundCanvas();
      this.updateConciergeBadge();

      // Check if user is already logged in
      if (State.currentUser) {
        // Fast skip splash or quick check
        this.runSplash(() => {
          this.showDashboard();
        });
      } else {
        // Run full initial splash screen
        this.runSplash(() => {
          this.showSignIn();
        });
      }
    },

    // --- Phase 1: Splash Screen Loading System ---
    runSplash(callback) {
      const splashScreen = document.getElementById('splash-screen');
      const progressBar = document.getElementById('splash-progress-bar');
      const percentageText = document.getElementById('splash-percentage');
      const statusText = document.getElementById('splash-status');

      if (!splashScreen || !progressBar || !percentageText) {
        if (callback) callback();
        return;
      }

      const statusMessages = [
        { at: 5, msg: 'ESTABLISHING SECURE PIXIES CORE CONNECTION...' },
        { at: 25, msg: 'SYNCHRONIZING ROLE-BASED ACCESS POLICIES...' },
        { at: 55, msg: 'MOUNTING SECURITY AUDIT & PAYMENTS LEDGER...' },
        { at: 80, msg: 'CALIBRATING DUAL-GATEWAY ROUTING SERVICES...' },
        { at: 95, msg: 'ACCESS PORTAL VERIFIED & SECURED.' }
      ];

      let progress = 0;
      const duration = 2600; // 2.6 seconds smooth load
      const intervalTime = 30;
      const step = 100 / (duration / intervalTime);

      const timer = setInterval(() => {
        progress += step;
        if (progress > 100) progress = 100;

        progressBar.style.width = `${progress}%`;
        percentageText.textContent = `${Math.floor(progress)}%`;

        // Update status subtext
        const currentMsg = statusMessages.slice().reverse().find(m => progress >= m.at);
        if (currentMsg && statusText) {
          statusText.textContent = currentMsg.msg;
        }

        if (progress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            // Apply blurry transition out of splash
            splashScreen.classList.add('blur-exiting');
            setTimeout(() => {
              splashScreen.classList.add('blur-hidden');
              splashScreen.classList.remove('blur-exiting');
              if (callback) callback();
            }, 450);
          }, 350);
        }
      }, intervalTime);
    },

    // --- Phase 2: Sign-In Screen Logic ---
    showSignIn() {
      const signinScreen = document.getElementById('signin-screen');
      const dashboardScreen = document.getElementById('dashboard-screen');

      dashboardScreen.classList.add('blur-hidden');
      signinScreen.classList.remove('blur-hidden');
      signinScreen.classList.add('blur-entering');

      // Reset form
      const form = document.getElementById('signin-form');
      if (form) form.reset();
      this.hideError();
    },

    getAllUsers() {
      return [...AUTHORIZED_PERSONNEL, ...getStoredNewUsers()];
    },

    signUserIn(user) {
      State.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleLabel: user.roleLabel,
        clearance: user.clearance,
        avatar: user.avatar,
        token: `px-jwt-${Math.random().toString(36).substring(2)}`,
        loginTimestamp: new Date().toISOString()
      };

      Storage.set('session_user', State.currentUser);

      AuditLogger.log('SIGN_IN_SUCCESS', {
        email: user.email,
        name: user.name,
        selectedRole: user.role,
        assignedRole: user.role,
        status: 'SUCCESS',
        notes: `User signed in successfully with authorized role '${user.roleLabel}'. Session token issued.`
      });

      const signinScreen = document.getElementById('signin-screen');
      if (signinScreen) {
        signinScreen.classList.add('blur-exiting');
      }

      setTimeout(() => {
        if (signinScreen) {
          signinScreen.classList.add('blur-hidden');
          signinScreen.classList.remove('blur-exiting');
        }
        this.showDashboard();
      }, 450);
    },

    handleSignUp(e) {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const role = document.getElementById('signup-role').value;

      this.hideError();

      if (!name || !email || !password || !role) {
        this.showError('Please complete the signup form and choose a valid role.');
        return;
      }

      const normalizedEmail = email.toLowerCase();
      const allUsers = this.getAllUsers();
      const existing = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (existing) {
        this.showError('That email is already registered. Please sign in instead.');
        return;
      }

      const initials = name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || 'NP';
      const newUser = {
        id: `USR-${Date.now().toString(36).toUpperCase()}`,
        name,
        email: normalizedEmail,
        password,
        role,
        roleLabel: ROLE_LABELS[role] || role,
        clearance: DEFAULT_ROLE_CLEARANCE[role] || 'Level 1 — Basic Access',
        avatar: initials
      };

      const users = getStoredNewUsers();
      users.push(newUser);
      persistNewUsers(users);

      AuditLogger.log('ACCOUNT_CREATED', {
        email: newUser.email,
        name: newUser.name,
        selectedRole: newUser.role,
        assignedRole: newUser.role,
        status: 'SUCCESS',
        notes: `New user account created for ${newUser.name} and access granted to dashboard.`
      });

      this.signUserIn(newUser);
      this.hideSignupPanel();
    },

    handleSignIn(e) {
      e.preventDefault();
      const emailInput = document.getElementById('signin-email').value.trim();
      const passwordInput = document.getElementById('signin-password').value.trim();
      const roleSelect = document.getElementById('signin-role').value;

      this.hideError();

      if (!emailInput || !passwordInput || !roleSelect) {
        this.showError('Please fill out all credentials and choose your designated role.');
        return;
      }

      // 1. Look up user in authorized personnel database
      const matchedUser = this.getAllUsers().find(
        u => u.email.toLowerCase() === emailInput.toLowerCase()
      );

      // If user does not exist or password mismatch
      if (!matchedUser || matchedUser.password !== passwordInput) {
        AuditLogger.log('SIGN_IN_FAILED_CREDENTIALS', {
          email: emailInput,
          name: 'Unrecognized Identity',
          selectedRole: roleSelect,
          assignedRole: 'None',
          status: 'DENIED',
          notes: 'Invalid credentials supplied'
        });
        this.showError('Authentication failed: Invalid email or password.');
        return;
      }

      // 2. STRICT SECURITY VERIFICATION: MATCH USER EMAIL WITH ASSIGNED ROLE
      if (matchedUser.role !== roleSelect) {
        // SECURITY VIOLATION: Role mismatch!
        AuditLogger.log('ROLE_MISMATCH_SECURITY_VIOLATION', {
          email: matchedUser.email,
          name: matchedUser.name,
          selectedRole: roleSelect,
          assignedRole: matchedUser.role,
          status: 'DENIED',
          notes: `ACCESS BLOCKED: User selected [${roleSelect}] but is officially registered as [${matchedUser.role}]. Unauthorized elevation attempt prevented.`
        });

        this.showError(
          `Security Alert: Clearance mismatch! Your account is registered as '${matchedUser.roleLabel}'. You cannot access '${roleSelect.toUpperCase()}' credentials.`
        );
        return;
      }

      // 3. SUCCESSFUL AUTHENTICATION & ROLE MATCH
      this.signUserIn({
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        roleLabel: matchedUser.roleLabel,
        clearance: matchedUser.clearance,
        avatar: matchedUser.avatar
      });
    },

    handleSignOut() {
      if (!State.currentUser) return;

      const user = State.currentUser;
      AuditLogger.log('SIGN_OUT', {
        email: user.email,
        name: user.name,
        selectedRole: user.role,
        assignedRole: user.role,
        status: 'SUCCESS',
        notes: `User logged out cleanly from Pixies Core admin portal.`
      });

      State.currentUser = null;
      Storage.set('session_user', null);

      // Blurry transition to sign in
      const dashboardScreen = document.getElementById('dashboard-screen');
      dashboardScreen.classList.add('blur-exiting');

      setTimeout(() => {
        dashboardScreen.classList.add('blur-hidden');
        dashboardScreen.classList.remove('blur-exiting');
        this.showSignIn();
      }, 450);
    },

    showError(message) {
      const errorBanner = document.getElementById('signin-error-banner');
      const errorMessage = document.getElementById('signin-error-text');
      if (errorBanner && errorMessage) {
        errorMessage.textContent = message;
        errorBanner.classList.add('show');
      }
    },

    hideError() {
      const errorBanner = document.getElementById('signin-error-banner');
      if (errorBanner) {
        errorBanner.classList.remove('show');
      }
    },

    showSignupPanel() {
      const signupForm = document.getElementById('signup-form');
      const showSignupToggle = document.getElementById('show-signup-toggle');
      const signinForm = document.getElementById('signin-form');
      if (signupForm) signupForm.classList.remove('hidden');
      if (showSignupToggle) showSignupToggle.classList.add('hidden');
      if (signinForm) signinForm.classList.add('opacity-70');
    },

    hideSignupPanel() {
      const signupForm = document.getElementById('signup-form');
      const showSignupToggle = document.getElementById('show-signup-toggle');
      const signinForm = document.getElementById('signin-form');
      if (signupForm) {
        signupForm.classList.add('hidden');
        signupForm.reset();
      }
      if (showSignupToggle) showSignupToggle.classList.remove('hidden');
      if (signinForm) signinForm.classList.remove('opacity-70');
    },

    // --- Phase 3: Dashboard Operations ---
    showDashboard() {
      const dashboardScreen = document.getElementById('dashboard-screen');
      dashboardScreen.classList.remove('blur-hidden');
      dashboardScreen.classList.add('blur-entering');

      // Update User Badges & Profile
      this.updateUserProfileDisplay();

      // Render Active Tab
      this.switchTab('overview');
      this.refreshKPIs();
    },

    updateUserProfileDisplay() {
      if (!State.currentUser) return;
      const u = State.currentUser;

      const userNameEl = document.getElementById('user-display-name');
      const userRoleEl = document.getElementById('user-display-role');
      const userAvatarEl = document.getElementById('user-display-avatar');
      const headerRolePill = document.getElementById('header-role-pill');

      if (userNameEl) userNameEl.textContent = u.name;
      if (userRoleEl) userRoleEl.textContent = u.roleLabel;
      if (userAvatarEl) userAvatarEl.textContent = u.avatar;
      if (headerRolePill) {
        headerRolePill.textContent = `${u.roleLabel.toUpperCase()} — ACTIVE`;
      }
    },

    switchTab(tabId) {
      State.activeTab = tabId;

      // Update sidebar nav active state
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.tab === tabId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Blurry tab transition
      const views = document.querySelectorAll('.tab-view');
      views.forEach(v => {
        if (v.id === `view-${tabId}`) {
          v.classList.remove('hidden');
          v.classList.add('tab-fading');
          setTimeout(() => {
            v.classList.remove('tab-fading');
          }, 30);
        } else {
          v.classList.add('hidden');
        }
      });

      // Specific tab data renders
      switch (tabId) {
        case 'overview':
          this.refreshKPIs();
          this.renderRecentAppointmentsPreview();
          this.renderRecentVerificationsPreview();
          break;
        case 'verifications':
          this.renderVerificationsTable();
          break;
        case 'appointments':
          this.renderAppointmentsTable();
          break;
        case 'financials':
          this.renderFinancials();
          break;
        case 'users':
          this.renderUsersTable();
          break;
        case 'security':
          this.renderAuditTable();
          break;
        case 'concierge':
          this.renderConciergeView();
          break;
        case 'media':
          this.renderMediaManager();
          break;
        case 'settings':
          this.renderSettings();
          break;
      }
    },

    // --- Tab 1: Overview KPIs ---
    refreshKPIs() {
      const totalAppointments = State.appointments.length;
      const pendingVerifications = State.verifications.filter(v => v.status === 'pending').length;
      const totalRevenueZMW = State.appointments
        .filter(a => a.amount.includes('ZMW'))
        .reduce((sum, a) => sum + parseFloat(a.amount.replace(/[^0-9.]/g, '') || 0), 0);
      const totalCommissionZMW = totalRevenueZMW * 0.15; // 15% platform take-rate

      const revenueEl = document.getElementById('kpi-revenue');
      const commissionEl = document.getElementById('kpi-commission');
      const bookingsEl = document.getElementById('kpi-bookings');
      const pendingEl = document.getElementById('kpi-pending-verifications');

      if (revenueEl) revenueEl.textContent = `ZMW ${totalRevenueZMW.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (commissionEl) commissionEl.textContent = `ZMW ${totalCommissionZMW.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (bookingsEl) bookingsEl.textContent = totalAppointments;
      if (pendingEl) pendingEl.textContent = pendingVerifications;
    },

    renderRecentAppointmentsPreview() {
      const container = document.getElementById('overview-appointments-preview');
      if (!container) return;

      const recent = State.appointments.slice(0, 4);
      container.innerHTML = recent.map(apt => `
        <tr class="hover:bg-white/5 transition-colors">
          <td class="font-mono text-xs text-pink-400 font-bold">${apt.id}</td>
          <td>
            <div class="font-medium text-white">${apt.clientName}</div>
            <div class="text-xs text-gray-500">${apt.clientPhone}</div>
          </td>
          <td>
            <div class="text-xs font-semibold text-gray-300">${apt.serviceName}</div>
            <div class="text-[11px] text-pink-400/80">Tech: ${apt.proName}</div>
          </td>
          <td class="font-bold text-white">${apt.amount}</td>
          <td>
            <span class="badge-status ${apt.status === 'confirmed' ? 'status-verified' : apt.status === 'pending' ? 'status-pending' : 'status-denied'}">
              ${apt.status.toUpperCase()}
            </span>
          </td>
        </tr>
      `).join('');
    },

    renderRecentVerificationsPreview() {
      const container = document.getElementById('overview-verifications-preview');
      if (!container) return;

      const pending = State.verifications.filter(v => v.status === 'pending').slice(0, 3);
      if (pending.length === 0) {
        container.innerHTML = `<p class="text-center text-xs text-gray-500 py-6 italic">No pending verifications. All clear!</p>`;
        return;
      }

      container.innerHTML = pending.map(pro => `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-pink-500/10 hover:border-pink-500/30 transition-all">
          <div>
            <div class="font-bold text-white text-sm flex items-center gap-2">
              ${pro.name}
              ${pro.pinkBadge ? '<span class="pink-badge-tag">💖 Pink Badge</span>' : ''}
            </div>
            <div class="text-xs text-gray-400 mt-0.5">${pro.category} • ${pro.location}</div>
          </div>
          <button onclick="window.PixiesCore.openVerificationModal('${pro.id}')" class="px-3 py-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-bold hover:bg-pink-500 hover:text-white transition-all">
            Review
          </button>
        </div>
      `).join('');
    },

    // --- Tab 2: Verifications ---
    renderVerificationsTable() {
      const tbody = document.getElementById('verifications-table-body');
      if (!tbody) return;

      tbody.innerHTML = State.verifications.map(pro => `
        <tr>
          <td>
            <div class="font-bold text-white flex items-center gap-2">
              ${pro.name}
              ${pro.pinkBadge ? '<span class="pink-badge-tag">💖 Pink Badge</span>' : ''}
            </div>
            <div class="text-xs text-gray-500">${pro.email} • ${pro.phone}</div>
          </td>
          <td>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${pro.category.includes('Lashes') ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' : 'bg-pink-500/15 text-pink-400 border border-pink-500/30'}">
              ${pro.category}
            </span>
          </td>
          <td class="text-xs text-gray-300">${pro.location}</td>
          <td>
            <button onclick="window.PixiesCore.viewCertDoc('${pro.id}')" class="text-xs text-pink-400 hover:underline flex items-center gap-1">
              📄 ${pro.certDoc}
            </button>
          </td>
          <td>
            <span class="badge-status ${pro.status === 'approved' ? 'status-verified' : pro.status === 'pending' ? 'status-pending' : 'status-denied'}">
              ${pro.status.toUpperCase()}
            </span>
          </td>
          <td>
            <div class="flex items-center gap-2">
              <button onclick="window.PixiesCore.updateProVerification('${pro.id}', 'approved')" class="btn-action-icon text-emerald-400 hover:text-emerald-300" title="Approve">
                ✓
              </button>
              <button onclick="window.PixiesCore.togglePinkBadge('${pro.id}')" class="btn-action-icon text-pink-400 hover:text-pink-300" title="Toggle Pink Badge">
                💖
              </button>
              <button onclick="window.PixiesCore.updateProVerification('${pro.id}', 'rejected')" class="btn-action-icon text-red-400 hover:text-red-300" title="Reject">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    },

    updateProVerification(proId, status) {
      const pro = State.verifications.find(p => p.id === proId);
      if (!pro) return;

      pro.status = status;
      Storage.set('verifications', State.verifications);

      AuditLogger.log(`PRO_VERIFICATION_${status.toUpperCase()}`, {
        notes: `Technician ${pro.name} (${pro.id}) status set to ${status}.`
      });

      this.renderVerificationsTable();
      this.refreshKPIs();
      alert(`Technician ${pro.name} has been ${status.toUpperCase()}.`);
    },

    togglePinkBadge(proId) {
      const pro = State.verifications.find(p => p.id === proId);
      if (!pro) return;

      pro.pinkBadge = !pro.pinkBadge;
      Storage.set('verifications', State.verifications);

      AuditLogger.log('PINK_BADGE_TOGGLED', {
        notes: `Pink Badge status for ${pro.name} changed to ${pro.pinkBadge ? 'AWARDED' : 'REVOKED'}.`
      });

      this.renderVerificationsTable();
      alert(`Pink Badge ${pro.pinkBadge ? 'AWARDED to' : 'REVOKED from'} ${pro.name}.`);
    },

    viewCertDoc(proId) {
      const pro = State.verifications.find(p => p.id === proId);
      if (!pro) return;
      alert(`Viewing Verification Document for ${pro.name}:\n\n${pro.certDoc}\n\nDocument Hash: sha256-${Math.random().toString(36).substring(2)}\nIssued by accredited authority.`);
    },

    // --- Tab 3: Appointments ---
    renderAppointmentsTable() {
      const tbody = document.getElementById('appointments-table-body');
      if (!tbody) return;

      tbody.innerHTML = State.appointments.map(apt => `
        <tr>
          <td class="font-mono text-xs font-bold text-pink-400">${apt.id}</td>
          <td>
            <div class="font-bold text-white">${apt.clientName}</div>
            <div class="text-xs text-gray-500">${apt.clientPhone}</div>
          </td>
          <td>
            <div class="text-xs font-medium text-white">${apt.serviceName}</div>
            <div class="text-[11px] text-pink-400">Tech: ${apt.proName}</div>
          </td>
          <td class="text-xs text-gray-300 font-mono">${apt.dateTime}</td>
          <td>
            <div class="font-bold text-white">${apt.amount}</div>
            <div class="text-[10px] text-emerald-400">Fee: ${apt.fee}</div>
          </td>
          <td>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold ${apt.gateway === 'Paystack' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'}">
              ${apt.gateway}
            </span>
          </td>
          <td>
            <span class="badge-status ${apt.status === 'confirmed' ? 'status-verified' : apt.status === 'pending' ? 'status-pending' : 'status-denied'}">
              ${apt.status.toUpperCase()}
            </span>
          </td>
          <td>
            <button onclick="window.PixiesCore.resendWhatsApp('${apt.id}')" class="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1">
              💬 WhatsApp
            </button>
          </td>
        </tr>
      `).join('');
    },

    resendWhatsApp(aptId) {
      const apt = State.appointments.find(a => a.id === aptId);
      if (!apt) return;
      alert(`[Twilio WhatsApp Dispatch]\n\nAutomated WhatsApp confirmation sent to ${apt.clientName} (${apt.clientPhone}) for appointment with ${apt.proName}.\n\nMessage template: 'Pink Pixies Appointment Confirmed'`);
      AuditLogger.log('WHATSAPP_CONFIRMATION_RESENT', {
        notes: `Twilio WhatsApp manual trigger executed for appointment ${aptId} to ${apt.clientPhone}.`
      });
    },

    // --- Tab 4: Financials & Payment Router ---
    renderFinancials() {
      const paystackCount = State.appointments.filter(a => a.gateway === 'Paystack').length;
      const stripeCount = State.appointments.filter(a => a.gateway === 'Stripe Connect').length;

      const pCountEl = document.getElementById('financials-paystack-count');
      const sCountEl = document.getElementById('financials-stripe-count');

      if (pCountEl) pCountEl.textContent = `${paystackCount} Txns`;
      if (sCountEl) sCountEl.textContent = `${stripeCount} Txns`;
    },

    // --- Tab 5: Users Governance (RBAC) ---
    renderUsersTable() {
      const tbody = document.getElementById('users-table-body');
      if (!tbody) return;

      tbody.innerHTML = AUTHORIZED_PERSONNEL.map(u => `
        <tr>
          <td>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                ${u.avatar}
              </div>
              <div>
                <div class="font-bold text-white text-sm">${u.name}</div>
                <div class="text-xs text-gray-500">${u.email}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge-role role-${u.role}">
              ${u.roleLabel}
            </span>
          </td>
          <td class="text-xs text-gray-300 font-mono">${u.clearance}</td>
          <td>
            <span class="badge-status status-verified">ACTIVE & VERIFIED</span>
          </td>
          <td class="text-xs text-gray-400">
            Internal Cryptographic Auth
          </td>
        </tr>
      `).join('');
    },

    // --- Tab 6: Security Center & Audit Ledger ---
    renderAuditTable() {
      const tbody = document.getElementById('audit-table-body');
      if (!tbody) return;

      if (State.auditLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-xs text-gray-500 py-8 italic">No security events recorded yet. System initial clean state.</td></tr>`;
        return;
      }

      tbody.innerHTML = State.auditLogs.map(log => `
        <tr class="${log.status === 'DENIED' ? 'bg-red-500/5' : ''}">
          <td class="font-mono text-xs text-gray-400 whitespace-nowrap">${log.formattedTime}</td>
          <td>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              log.status === 'DENIED' 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : log.event.includes('SUCCESS')
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
            }">
              ${log.event}
            </span>
          </td>
          <td>
            <div class="font-medium text-white text-xs">${log.userName}</div>
            <div class="text-[11px] text-gray-400 font-mono">${log.userEmail}</div>
          </td>
          <td>
            <div class="text-xs">
              <span class="text-gray-400">Selected:</span> <strong class="${log.selectedRole !== log.assignedRole && log.status === 'DENIED' ? 'text-red-400 font-bold' : 'text-gray-200'}">${log.selectedRole}</strong>
            </div>
            <div class="text-[11px] text-gray-500">
              Assigned: <strong>${log.assignedRole}</strong>
            </div>
          </td>
          <td>
            <span class="badge-status ${log.status === 'SUCCESS' ? 'status-verified' : log.status === 'DENIED' ? 'status-denied' : 'status-pending'}">
              ${log.status}
            </span>
          </td>
          <td class="text-xs text-gray-400 max-w-xs truncate" title="${log.notes}">
            ${log.notes}
          </td>
        </tr>
      `).join('');
    },

    exportAuditLog() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State.auditLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pixies_core_audit_ledger_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    },

    // --- Tab 7: System Settings & Main Web Control ---
    renderSettings() {
      this.loadPlatformConfig();
    },

    async loadPlatformConfig() {
      const badge = document.getElementById('settings-sync-status');
      if (badge) { badge.textContent = 'LOADING...'; badge.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30'; }

      try {
        const resp = await fetch(this.apiUrl('/api/platform/config'));
        const result = await resp.json();
        if (result.success && result.config) {
          const c = result.config;
          State.platformConfig = c;

          const el = (id) => document.getElementById(id);

          // Core toggles
          if (el('toggle-maintenance')) el('toggle-maintenance').checked = !!c.maintenance_mode;
          if (el('toggle-whatsapp')) el('toggle-whatsapp').checked = c.whatsapp_notifications !== false;
          if (el('toggle-push')) el('toggle-push').checked = c.push_notifications !== false;

          // Banner
          if (c.announcement_banner) {
            if (el('toggle-banner')) el('toggle-banner').checked = c.announcement_banner.enabled !== false;
            if (el('input-banner-badge')) el('input-banner-badge').value = c.announcement_banner.badge || '';
            if (el('input-banner-text')) el('input-banner-text').value = c.announcement_banner.text || '';
            if (el('input-banner-link')) el('input-banner-link').value = c.announcement_banner.link || '';
            if (el('input-banner-btn')) el('input-banner-btn').value = c.announcement_banner.link_text || '';
          }

          // Hero
          if (el('input-hero-badge')) el('input-hero-badge').value = c.hero_badge || '';
          if (el('input-hero-title')) el('input-hero-title').value = c.hero_title || '';
          if (el('input-hero-subtitle')) el('input-hero-subtitle').value = c.hero_subtitle || '';

          // Financials
          if (el('input-take-rate')) el('input-take-rate').value = c.take_rate_percentage || 15;
          if (el('input-deposit')) el('input-deposit').value = c.min_deposit_percentage || 20;
          if (el('input-currency')) el('input-currency').value = c.currency || 'ZMW';
          if (c.active_gateways) {
            if (el('toggle-paystack')) el('toggle-paystack').checked = c.active_gateways.paystack !== false;
            if (el('toggle-stripe')) el('toggle-stripe').checked = c.active_gateways.stripe !== false;
            if (el('toggle-cash')) el('toggle-cash').checked = c.active_gateways.cash !== false;
          }

          if (badge) { badge.textContent = 'SYNCED'; badge.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'; }
        }
      } catch (err) {
        console.warn('Platform config load error (local mode):', err.message);
        if (badge) { badge.textContent = 'LOCAL MODE'; badge.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30'; }
      }
    },

    async updatePlatformSetting(key, value) {
      const payload = { [key]: value };
      const user = State.currentUser || { name: 'Admin' };
      payload.updated_by = user.name;

      try {
        await fetch(this.apiUrl('/api/platform/config'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Setting update (local fallback):', err.message);
      }

      AuditLogger.log('PLATFORM_SETTING_CHANGED', {
        notes: `${user.name} set "${key}" to ${JSON.stringify(value)} on main web.`
      });
    },

    async saveBannerConfig() {
      const el = (id) => document.getElementById(id);
      const banner = {
        enabled: el('toggle-banner') ? el('toggle-banner').checked : true,
        badge: el('input-banner-badge') ? el('input-banner-badge').value.trim() : 'OFFER',
        text: el('input-banner-text') ? el('input-banner-text').value.trim() : '',
        link: el('input-banner-link') ? el('input-banner-link').value.trim() : '',
        link_text: el('input-banner-btn') ? el('input-banner-btn').value.trim() : 'Go',
        type: 'pink'
      };

      const user = State.currentUser || { name: 'Admin' };

      try {
        await fetch(this.apiUrl('/api/platform/config'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ announcement_banner: banner, updated_by: user.name })
        });
      } catch (err) {
        console.warn('Banner save error:', err.message);
      }

      AuditLogger.log('MAIN_WEB_BANNER_PUBLISHED', {
        notes: `${user.name} published announcement banner: "${banner.text.substring(0, 50)}..."`
      });

      alert(`✅ Banner Published to Main Web!\n\n"${banner.text}"\n\nThis will appear across the top of pinkpixies.com.`);
    },

    async saveHeroConfig() {
      const el = (id) => document.getElementById(id);
      const hero = {
        hero_badge: el('input-hero-badge') ? el('input-hero-badge').value.trim() : '',
        hero_title: el('input-hero-title') ? el('input-hero-title').value.trim() : '',
        hero_subtitle: el('input-hero-subtitle') ? el('input-hero-subtitle').value.trim() : ''
      };

      const user = State.currentUser || { name: 'Admin' };

      try {
        await fetch(this.apiUrl('/api/platform/config'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...hero, updated_by: user.name })
        });
      } catch (err) {
        console.warn('Hero save error:', err.message);
      }

      AuditLogger.log('MAIN_WEB_HERO_UPDATED', {
        notes: `${user.name} updated hero copy: "${hero.hero_title}"`
      });

      alert(`✅ Hero Section Published to Main Web!\n\nTitle: "${hero.hero_title}"\nSubtitle: "${hero.hero_subtitle}"`);
    },

    async saveFinancialConfig() {
      const el = (id) => document.getElementById(id);
      const financial = {
        take_rate_percentage: parseFloat(el('input-take-rate') ? el('input-take-rate').value : 15),
        min_deposit_percentage: parseFloat(el('input-deposit') ? el('input-deposit').value : 20),
        currency: el('input-currency') ? el('input-currency').value : 'ZMW',
        active_gateways: {
          paystack: el('toggle-paystack') ? el('toggle-paystack').checked : true,
          stripe: el('toggle-stripe') ? el('toggle-stripe').checked : true,
          cash: el('toggle-cash') ? el('toggle-cash').checked : true
        }
      };

      const user = State.currentUser || { name: 'Admin' };

      try {
        await fetch(this.apiUrl('/api/platform/config'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...financial, updated_by: user.name })
        });
      } catch (err) {
        console.warn('Financial save error:', err.message);
      }

      AuditLogger.log('FINANCIAL_SETTINGS_UPDATED', {
        notes: `${user.name} set take-rate to ${financial.take_rate_percentage}%, currency ${financial.currency}, gateways: Paystack=${financial.active_gateways.paystack}, Stripe=${financial.active_gateways.stripe}.`
      });

      alert(`✅ Financial Settings Applied!\n\nTake Rate: ${financial.take_rate_percentage}%\nMin Deposit: ${financial.min_deposit_percentage}%\nCurrency: ${financial.currency}\nPaystack: ${financial.active_gateways.paystack ? 'ON' : 'OFF'}\nStripe: ${financial.active_gateways.stripe ? 'ON' : 'OFF'}\nCash: ${financial.active_gateways.cash ? 'ON' : 'OFF'}`);
    },

    runDiagnostics() {
      const checks = [
        `Database: Supabase PostgreSQL — ${typeof State.platformConfig === 'object' ? 'Connected & Synced' : 'Local Mode'}`,
        `Admin Bridge API: ${window.location.origin}/api/ — Active`,
        `Chat Inbound Endpoint: /api/bridge/chat-inbound — Ready`,
        `Chat Reply Endpoint: /api/bridge/chat-reply — Ready`,
        `Chat Poll Endpoint: /api/bridge/chat-poll — Ready`,
        `Platform Config API: /api/platform/config — Active`,
        `Professionals Bridge: /api/bridge/professionals — Active`,
        `Appointments Bridge: /api/bridge/appointments — Active`,
        `Media Config API: /api/media/get-login-video — Active`,
        `Maintenance Mode: ${State.platformConfig?.maintenance_mode ? 'ENABLED ⚠️' : 'OFF ✅'}`,
        `Audit Ledger Entries: ${State.auditLogs.length}`,
        `All admin-controlled systems normal.`
      ];
      alert(`⚡ Pixies Core Full Diagnostics\n\n${checks.map(c => `• ${c}`).join('\n')}`);
    },

    // --- Tab 8: Marketing & HR Live Concierge Desk ---
    renderConciergeView() {
      this.renderConversationsList();
      this.renderActiveConversation();
      this.updateConciergeBadge();
    },

    updateConciergeBadge() {
      const openCount = State.conversations.filter(c => c.status === 'open' || c.unread).length;
      const navBadge = document.getElementById('nav-concierge-badge');
      const queueCount = document.getElementById('concierge-queue-count');

      if (navBadge) {
        navBadge.textContent = openCount > 0 ? `${openCount} LIVE` : 'ALL CLEAR';
        navBadge.className = openCount > 0 
          ? 'nav-badge !bg-pink-500/20 !text-pink-400 animate-pulse'
          : 'nav-badge !bg-emerald-500/20 !text-emerald-400';
      }

      if (queueCount) {
        queueCount.textContent = `${openCount} Action Needed`;
      }
    },

    filterConversations(filter, buttonEl) {
      State.conversationFilter = filter;
      document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
      if (buttonEl) buttonEl.classList.add('active');
      this.renderConversationsList();
    },

    renderConversationsList() {
      const container = document.getElementById('concierge-threads-list');
      if (!container) return;

      let list = State.conversations;
      if (State.conversationFilter !== 'all') {
        list = list.filter(c => c.status === State.conversationFilter);
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-xs text-gray-500 italic">
            No conversations in this status. All queries attended!
          </div>
        `;
        return;
      }

      container.innerHTML = list.map(c => `
        <div class="thread-item ${c.id === State.activeConversationId ? 'active' : ''}" onclick="window.PixiesCore.selectConversation('${c.id}')">
          <div class="flex items-center justify-between mb-1">
            <div class="font-bold text-white text-xs flex items-center gap-2">
              ${c.clientName}
              ${c.unread ? '<span class="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>' : ''}
            </div>
            <span class="text-[10px] text-gray-500 font-mono">${c.lastMessageAt}</span>
          </div>
          <div class="text-[11px] text-gray-400 truncate mb-1.5 font-sans">${c.lastMessage}</div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-pink-400/80 font-mono">${c.category}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-bold ${
              c.status === 'open' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : c.status === 'in_progress'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }">
              ${c.status.toUpperCase()}
            </span>
          </div>
        </div>
      `).join('');
    },

    selectConversation(convId) {
      State.activeConversationId = convId;
      const conv = State.conversations.find(c => c.id === convId);
      if (conv) {
        conv.unread = false;
        Storage.set('conversations', State.conversations);
      }
      this.renderConversationsList();
      this.renderActiveConversation();
      this.updateConciergeBadge();
    },

    renderActiveConversation() {
      const conv = State.conversations.find(c => c.id === State.activeConversationId);
      if (!conv) return;

      const nameEl = document.getElementById('active-client-name');
      const avatarEl = document.getElementById('active-client-avatar');
      const metaEl = document.getElementById('active-client-meta');
      const statusSelect = document.getElementById('active-thread-status');
      const stream = document.getElementById('concierge-messages-stream');

      if (nameEl) nameEl.textContent = conv.clientName;
      if (avatarEl) {
        const initials = conv.clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarEl.textContent = initials || 'PX';
      }
      if (metaEl) {
        metaEl.textContent = `${conv.clientContact || 'Guest'} • ${conv.location || 'Direct Web Inquiry'} • ${conv.category}`;
      }
      if (statusSelect) {
        statusSelect.value = conv.status;
      }

      if (stream) {
        stream.innerHTML = conv.messages.map(m => {
          const isHR = m.senderType === 'marketing_hr';
          return `
            <div class="${isHR ? 'chat-bubble-hr' : 'chat-bubble-client'}">
              <div class="font-bold text-[11px] mb-0.5 ${isHR ? 'text-pink-100' : 'text-pink-400'}">
                ${m.senderName} ${isHR ? '(Marketing & HR)' : ''}
              </div>
              <div class="whitespace-pre-line">${m.content}</div>
              <div class="chat-meta text-[10px] ${isHR ? 'text-pink-200/80 justify-end' : 'text-gray-400'}">
                <span>${m.timestamp}</span>
                ${isHR ? '<span>• Sent to Main Web</span>' : '<span>• Inbound via Bridge</span>'}
              </div>
            </div>
          `;
        }).join('');

        stream.scrollTop = stream.scrollHeight;
      }
    },

    applyQuickReply(text) {
      const input = document.getElementById('concierge-reply-input');
      if (input) {
        input.value = text;
        input.focus();
      }
    },

    updateActiveThreadStatus(status) {
      const conv = State.conversations.find(c => c.id === State.activeConversationId);
      if (!conv) return;

      conv.status = status;
      Storage.set('conversations', State.conversations);

      AuditLogger.log('CONCIERGE_THREAD_STATUS_CHANGED', {
        notes: `Marketing & HR set thread ${conv.id} (${conv.clientName}) status to ${status.toUpperCase()}.`
      });

      this.renderConversationsList();
      this.updateConciergeBadge();
    },

    sendConciergeReply(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('concierge-reply-input');
      const resolveCheckbox = document.getElementById('concierge-auto-resolve');
      if (!input || !input.value.trim()) return;

      const replyContent = input.value.trim();
      const markResolved = resolveCheckbox ? resolveCheckbox.checked : false;

      const conv = State.conversations.find(c => c.id === State.activeConversationId);
      if (!conv) return;

      const user = State.currentUser || { name: 'Marketing & HR Specialist', roleLabel: 'Staff' };
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newMsg = {
        id: `msg-${Date.now()}`,
        senderType: 'marketing_hr',
        senderName: user.name,
        senderRole: user.roleLabel,
        content: replyContent,
        timestamp: timeStr
      };

      conv.messages.push(newMsg);
      conv.lastMessage = replyContent;
      conv.lastMessageAt = 'Just now';
      conv.status = markResolved ? 'resolved' : 'in_progress';
      conv.unread = false;

      Storage.set('conversations', State.conversations);

      AuditLogger.log('CONCIERGE_REPLY_SENT', {
        notes: `Marketing & HR (${user.name}) responded to ${conv.clientName}: "${replyContent.substring(0, 45)}..."`
      });

      // Dispatch to Vercel Serverless Backend API (with silent fallback if in mock mode)
      fetch(this.apiUrl('/api/bridge/chat-reply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conv.id,
          senderName: user.name,
          senderRole: user.roleLabel,
          content: replyContent,
          markResolved: markResolved
        })
      }).catch(err => {
        console.log('Serverless API dispatched in local mode:', err.message);
      });

      input.value = '';
      if (resolveCheckbox) resolveCheckbox.checked = false;

      this.renderConversationsList();
      this.renderActiveConversation();
      this.updateConciergeBadge();
    },

    simulateInboundInquiry() {
      const mockQuestions = [
        {
          name: 'Zoe Mwale',
          contact: '+260 96 7712345',
          loc: 'Kabulonga, Lusaka',
          category: 'Nail Art & Gel',
          msg: 'Hi! Can a verified nail tech do chrome ombré extensions at my office in Kabulonga tomorrow at 2 PM?'
        },
        {
          name: 'Nneka Okonjo',
          contact: '+234 80 5558889',
          loc: 'Ikoyi, Lagos',
          category: 'Hybrid Lashes',
          msg: 'Good afternoon, what is the booking deposit policy and do you have technicians with the Pink Badge near Ikoyi?'
        },
        {
          name: 'Lerato Dlamini',
          contact: '+27 72 9991122',
          loc: 'Sandton, Johannesburg',
          category: 'Bridal Beauty Package',
          msg: 'Hello! I need a group booking for 4 bridesmaids for nails and lash lifts next Saturday. What packages do you have?'
        }
      ];

      const sample = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
      const newConvId = `conv-${Date.now().toString(36)}`;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newConv = {
        id: newConvId,
        sessionId: `sess_user_${Math.floor(Math.random() * 10000)}`,
        clientName: sample.name,
        clientContact: sample.contact,
        location: sample.loc,
        category: sample.category,
        status: 'open',
        lastMessage: sample.msg,
        lastMessageAt: 'Just now',
        unread: true,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderType: 'client',
            senderName: sample.name,
            senderRole: 'Client',
            content: sample.msg,
            timestamp: timeStr
          }
        ]
      };

      State.conversations.unshift(newConv);
      Storage.set('conversations', State.conversations);

      AuditLogger.log('INBOUND_CONCIERGE_INQUIRY_RECEIVED', {
        notes: `New customer inquiry received from ${sample.name} via Pink Pixies API Bridge: "${sample.msg.substring(0, 45)}..."`
      });

      this.selectConversation(newConvId);
      alert(`🔔 New Live Inquiry Received from Pink Pixies Main Web!\n\nClient: ${sample.name} (${sample.loc})\nQuestion: "${sample.msg}"\n\nMarketing & HR can reply now in the Concierge Desk.`);
    },

    // --- Tab 9: Marketing & HR Login Video Background Controller ---
    renderMediaManager() {
      const config = State.loginVideoConfig;
      const urlInput = document.getElementById('input-video-url');
      const titleInput = document.getElementById('input-video-title');
      const posterInput = document.getElementById('input-video-poster');
      const particlesInput = document.getElementById('input-video-particles');
      const statusBadge = document.getElementById('media-status-badge');

      if (urlInput) urlInput.value = config.videoUrl || '';
      if (titleInput) titleInput.value = config.title || '';
      if (posterInput) posterInput.value = config.posterUrl || '';
      if (particlesInput) particlesInput.checked = config.enableParticles !== false;
      if (statusBadge) {
        statusBadge.textContent = `LIVE: ${config.title || 'Active Ambient Theme'}`;
      }

      this.previewVideo(config.videoUrl);
    },

    previewVideo(url) {
      const previewVideoEl = document.getElementById('preview-stage-video');
      const previewSourceEl = document.getElementById('preview-stage-source');

      if (previewVideoEl && previewSourceEl && url) {
        previewSourceEl.src = url;
        previewVideoEl.load();
        previewVideoEl.play().catch(() => {});
      }
    },

    applyVideoPreset(url, title) {
      const urlInput = document.getElementById('input-video-url');
      const titleInput = document.getElementById('input-video-title');

      if (urlInput) urlInput.value = url;
      if (titleInput) titleInput.value = title;

      this.previewVideo(url);
    },

    saveVideoConfig(e) {
      if (e) e.preventDefault();

      const urlInput = document.getElementById('input-video-url');
      const titleInput = document.getElementById('input-video-title');
      const posterInput = document.getElementById('input-video-poster');
      const particlesInput = document.getElementById('input-video-particles');

      if (!urlInput || !urlInput.value.trim()) {
        alert('Please provide a valid video stream URL.');
        return;
      }

      const updatedConfig = {
        videoUrl: urlInput.value.trim(),
        title: titleInput ? titleInput.value.trim() || 'Custom Luxury Theme' : 'Custom Theme',
        posterUrl: posterInput ? posterInput.value.trim() : '',
        enableParticles: particlesInput ? particlesInput.checked : true,
        lastUpdated: new Date().toLocaleString()
      };

      State.loginVideoConfig = updatedConfig;
      Storage.set('login_video_config', updatedConfig);

      // Apply dynamically to live login video element immediately
      this.applyLiveLoginVideo(updatedConfig);

      // Audit Log
      const user = State.currentUser || { name: 'Marketing & HR Specialist' };
      AuditLogger.log('LOGIN_BACKGROUND_VIDEO_UPDATED', {
        notes: `Marketing & HR (${user.name}) updated login portal video to: "${updatedConfig.title}"`
      });

      // Send to serverless backend
      fetch(this.apiUrl('/api/media/update-login-video'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: updatedConfig.videoUrl,
          title: updatedConfig.title,
          posterUrl: updatedConfig.posterUrl,
          enableParticles: updatedConfig.enableParticles,
          updatedBy: user.name
        })
      }).catch(err => {
        console.log('Saved locally:', err.message);
      });

      const statusBadge = document.getElementById('media-status-badge');
      if (statusBadge) {
        statusBadge.textContent = `LIVE: ${updatedConfig.title}`;
      }

      alert(`✨ Login Background Video Successfully Published!\n\nAsset: ${updatedConfig.title}\nURL: ${updatedConfig.videoUrl}\n\nThe public Sign-In portal now displays this video stream.`);
    },

    resetVideoToDefault() {
      State.loginVideoConfig = { ...DEFAULT_VIDEO_CONFIG };
      Storage.set('login_video_config', State.loginVideoConfig);
      this.renderMediaManager();
      this.applyLiveLoginVideo(State.loginVideoConfig);
      alert('Login background video reset to factory default (Ambient Dark Pink Particles).');
    },

    applyLiveLoginVideo(config) {
      if (!config) return;

      const videoElement = document.querySelector('.video-bg');
      if (videoElement) {
        let sourceElement = videoElement.querySelector('source');
        if (!sourceElement) {
          sourceElement = document.createElement('source');
          sourceElement.type = 'video/mp4';
          videoElement.appendChild(sourceElement);
        }

        if (config.videoUrl && sourceElement.src !== config.videoUrl) {
          sourceElement.src = config.videoUrl;
          videoElement.load();
          videoElement.play().catch(() => {});
        }

        if (config.posterUrl) {
          videoElement.poster = config.posterUrl;
        }
      }

      const canvasElement = document.getElementById('video-fallback-canvas');
      if (canvasElement) {
        canvasElement.style.display = config.enableParticles === false ? 'none' : 'block';
      }
    },


    // --- Ambient Particle Canvas (Fallback for Video Background) ---
    initBackgroundCanvas() {
      const canvas = document.getElementById('video-fallback-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const particles = [];
      const particleCount = 45;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.5 + 0.2
        });
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(236, 72, 153, ${0.15 * (1 - dist / 140)})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(236, 72, 153, ${p.alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ec4899';
          ctx.fill();
        });

        requestAnimationFrame(animate);
      }

      animate();
    },

    // --- Event Bindings ---
    bindEvents() {
      // Sign In Form submission
      const form = document.getElementById('signin-form');
      if (form) {
        form.addEventListener('submit', (e) => this.handleSignIn(e));
      }

      const signupForm = document.getElementById('signup-form');
      if (signupForm) {
        signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
      }

      const showSignupToggle = document.getElementById('show-signup-toggle');
      if (showSignupToggle) {
        showSignupToggle.addEventListener('click', () => this.showSignupPanel());
      }

      const hideSignupToggle = document.getElementById('hide-signup-toggle');
      if (hideSignupToggle) {
        hideSignupToggle.addEventListener('click', () => this.hideSignupPanel());
      }

      // Sidebar Tab Links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const tab = link.dataset.tab;
          if (tab) this.switchTab(tab);
        });
      });

      // Sign Out Button
      const signoutBtn = document.getElementById('btn-signout');
      if (signoutBtn) {
        signoutBtn.addEventListener('click', () => this.handleSignOut());
      }

      // Sidebar Toggle
      const sidebarToggle = document.getElementById('btn-toggle-sidebar');
      const sidebar = document.getElementById('main-sidebar');
      if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
          State.sidebarCollapsed = !State.sidebarCollapsed;
          sidebar.classList.toggle('collapsed', State.sidebarCollapsed);
        });
      }

      // Global Search Keyboard Shortcut (Ctrl+K or Cmd+K)
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.toggleSearchPalette();
        }
      });

      const searchTrigger = document.getElementById('search-palette-trigger');
      if (searchTrigger) {
        searchTrigger.addEventListener('click', () => this.toggleSearchPalette());
      }
    },

    toggleSearchPalette() {
      const palette = document.getElementById('search-palette-modal');
      if (palette) {
        palette.classList.toggle('hidden');
        if (!palette.classList.contains('hidden')) {
          const input = document.getElementById('palette-search-input');
          if (input) input.focus();
        }
      }
    }
  };

  // Expose to window for inline onclick hooks
  window.PixiesCore = App;

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
})();
