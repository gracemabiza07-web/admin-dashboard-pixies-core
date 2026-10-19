// Runtime configuration for the admin frontend.
// Values are injected from environment settings in production deployments.
// This file intentionally avoids hardcoded live secrets.

const FALLBACK_CONFIG = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  API_BASE_URL: '',
  CLERK_PUBLISHABLE_KEY: ''
};

const runtimeConfig = typeof window !== 'undefined' && window.__PIXIES_CONFIG__
  ? window.__PIXIES_CONFIG__
  : FALLBACK_CONFIG;

const SUPABASE_URL = runtimeConfig.SUPABASE_URL || FALLBACK_CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = runtimeConfig.SUPABASE_ANON_KEY || FALLBACK_CONFIG.SUPABASE_ANON_KEY;
const API_BASE_URL = runtimeConfig.API_BASE_URL || FALLBACK_CONFIG.API_BASE_URL;
const CLERK_PUBLISHABLE_KEY = runtimeConfig.CLERK_PUBLISHABLE_KEY || FALLBACK_CONFIG.CLERK_PUBLISHABLE_KEY;

if (typeof window !== 'undefined') {
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  window.API_BASE_URL = API_BASE_URL;
  window.CLERK_PUBLISHABLE_KEY = CLERK_PUBLISHABLE_KEY;
}
