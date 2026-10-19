/**
 * Vercel Serverless Function & Isolated Local API Handler:
 * GET /api/platform/config  - Fetch platform settings (maintenance, banner, take-rate, etc.)
 * POST /api/platform/config - Update platform settings and broadcast to Pink Pixies main web
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'platform_config.json');

const DEFAULT_CONFIG = {
  maintenance_mode: false,
  maintenance_notice: "Pink Pixies Scheduled Maintenance — We are currently upgrading our luxury beauty network. Bookings will resume shortly! 💖",
  emergency_bypass_code: "pinkpixies2026",
  announcement_banner: {
    enabled: true,
    text: "✨ FLASH OFFER: 20% OFF all Luxury Gel Nails & Russian Lashes this week! Use code PINK20",
    badge: "FLASH OFFER",
    link: "#featured-pros-container",
    link_text: "Book Artist",
    type: "pink"
  },
  take_rate_percentage: 15.0,
  min_deposit_percentage: 20.0,
  currency: "ZMW",
  hero_badge: "✨ Zambia & Nigeria’s #1 Luxury Beauty Network",
  hero_title: "Discover & Book Verified Nail & Lash Artists",
  hero_subtitle: "Direct home visits and luxury salon appointments across Lusaka, Lagos, and Cape Town.",
  active_gateways: {
    paystack: true,
    stripe: true,
    cash: true
  },
  whatsapp_notifications: true,
  push_notifications: true,
  last_updated: new Date().toISOString(),
  updated_by: "System Admin"
};

function readLocalConfig() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local platform config:', err.message);
  }
  return DEFAULT_CONFIG;
}

function writeLocalConfig(config) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local platform config:', err.message);
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // --- GET: Retrieve Configuration ---
  if (req.method === 'GET') {
    let config = null;

    if (supabaseUrl && (serviceKey || anonKey)) {
      try {
        const key = serviceKey || anonKey;
        const response = await fetch(
          `${supabaseUrl}/rest/v1/admin_portal_config?key=eq.platform_settings&select=value`,
          {
            headers: {
              'apikey': key,
              'Authorization': `Bearer ${key}`
            }
          }
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].value) {
          config = data[0].value;
        }
      } catch (err) {
        console.warn('Supabase config fetch fallback to local cache:', err.message);
      }
    }

    if (!config) {
      config = readLocalConfig();
    }

    return res.status(200).json({
      success: true,
      config,
      source: supabaseUrl ? 'supabase_and_cache' : 'local_cache'
    });
  }

  // --- POST: Update Configuration ---
  if (req.method === 'POST') {
    const incoming = req.body || {};
    const existing = readLocalConfig();

    const updatedConfig = {
      ...existing,
      ...incoming,
      announcement_banner: {
        ...existing.announcement_banner,
        ...(incoming.announcement_banner || {})
      },
      active_gateways: {
        ...existing.active_gateways,
        ...(incoming.active_gateways || {})
      },
      last_updated: new Date().toISOString(),
      updated_by: incoming.updated_by || "Admin Session"
    };

    // Save to persistent file
    writeLocalConfig(updatedConfig);

    // Save to Supabase if configured
    if (supabaseUrl && (serviceKey || anonKey)) {
      try {
        const key = serviceKey || anonKey;
        await fetch(`${supabaseUrl}/rest/v1/admin_portal_config`, {
          method: 'POST',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify({
            key: 'platform_settings',
            value: updatedConfig,
            updated_by: updatedConfig.updated_by,
            updated_at: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('Could not sync to Supabase remote, saved locally:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Platform settings updated and broadcasted to main web.',
      config: updatedConfig
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
};
