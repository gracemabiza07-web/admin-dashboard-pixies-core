/**
 * Vercel Serverless Function & Isolated Local API Handler:
 * GET /api/bridge/professionals  - Fetch professionals directory
 * POST /api/bridge/professionals - Update verification status or Pink Badge
 */

const fs = require('fs');
const path = require('path');
const PRO_FILE = path.join(__dirname, '..', '..', 'data', 'professionals.json');

function readLocalPros() {
  try {
    if (fs.existsSync(PRO_FILE)) {
      return JSON.parse(fs.readFileSync(PRO_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading local pros:', err);
  }
  return [];
}

function writeLocalPros(list) {
  try {
    const dir = path.dirname(PRO_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PRO_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local pros:', err);
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

  if (req.method === 'GET') {
    let pros = null;
    if (supabaseUrl && (serviceKey || anonKey)) {
      try {
        const key = serviceKey || anonKey;
        const response = await fetch(`${supabaseUrl}/rest/v1/professionals?select=*`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          pros = data.map(p => ({
            id: p.code || p.id,
            uuid: p.id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            category: p.category,
            specialty: p.specialty,
            location: p.location,
            status: p.status,
            pinkBadge: !!p.pink_badge,
            certDoc: p.cert_document_name,
            rating: parseFloat(p.rating) || 5.0,
            experience: p.experience_years
          }));
        }
      } catch (err) {
        console.warn('Supabase pros fetch error, using local file:', err.message);
      }
    }

    if (!pros || pros.length === 0) {
      pros = readLocalPros();
    }

    return res.status(200).json({
      success: true,
      professionals: pros
    });
  }

  if (req.method === 'POST') {
    const { id, status, pinkBadge, notes } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    const list = readLocalPros();
    const pro = list.find(p => p.id === id || p.uuid === id);
    if (pro) {
      if (status !== undefined) pro.status = status;
      if (pinkBadge !== undefined) pro.pinkBadge = !!pinkBadge;
      writeLocalPros(list);
    }

    // Update Supabase if available
    if (supabaseUrl && (serviceKey || anonKey)) {
      try {
        const key = serviceKey || anonKey;
        const updatePayload = {};
        if (status !== undefined) updatePayload.status = status;
        if (pinkBadge !== undefined) updatePayload.pink_badge = !!pinkBadge;

        await fetch(`${supabaseUrl}/rest/v1/professionals?or=(code.eq.${id},id.eq.${id})`, {
          method: 'PATCH',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatePayload)
        });

        // Also update profiles table if technician is registered there
        await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            is_verified: status === 'approved',
            is_pink_badge: !!pinkBadge
          })
        });
      } catch (err) {
        console.warn('Supabase pro update warning:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Professional ${id} updated successfully.`,
      professional: pro || { id, status, pinkBadge }
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
};
