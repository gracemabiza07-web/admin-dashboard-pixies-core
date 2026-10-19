/**
 * Vercel Serverless Function: Get Active Login Background Video Configuration
 * GET /api/media/get-login-video
 * 
 * Public endpoint consumed by index.html / app.js before displaying the login portal.
 */

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const defaultBackground = {
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-pink-particles-floating-in-the-dark-41584-large.mp4',
    poster_url: '',
    enable_particles: true,
    title: 'Ambient Dark Pink Particles'
  };

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return res.status(200).json({
      success: true,
      mode: 'default_fallback',
      config: defaultBackground
    });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/admin_portal_config?key=eq.login_background&select=value`,
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      }
    );

    const data = await response.json();
    const config = Array.isArray(data) && data.length > 0 && data[0].value
      ? data[0].value
      : defaultBackground;

    return res.status(200).json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error fetching login video config:', error);
    return res.status(200).json({
      success: true,
      mode: 'error_fallback',
      config: defaultBackground
    });
  }
};
