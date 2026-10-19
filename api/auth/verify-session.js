/**
 * Vercel Serverless Function: Clerk Session & RBAC Verification
 * POST /api/auth/verify-session
 */

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkSecretKey) {
    // Development / Local simulation
    return res.status(200).json({
      authenticated: true,
      mode: 'mock_local',
      user: {
        id: 'usr_clerk_simulated',
        email: 'manager@pinkpixies.com',
        role: 'manager',
        clearance: 'Level 4 — Full Executive'
      }
    });
  }

  try {
    // Verify token with Clerk Backend API
    const response = await fetch('https://api.clerk.com/v1/tokens/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid Clerk session token' });
    }

    const sessionData = await response.json();
    return res.status(200).json({
      authenticated: true,
      session: sessionData
    });
  } catch (error) {
    console.error('Clerk verification error:', error);
    return res.status(500).json({ error: 'Clerk verification service unreachable', details: error.message });
  }
};
