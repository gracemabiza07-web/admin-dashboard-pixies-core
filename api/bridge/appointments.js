/**
 * Vercel Serverless Function & Isolated Local API Handler:
 * GET /api/bridge/appointments  - Fetch appointments
 * POST /api/bridge/appointments - Create or update appointment
 */

const fs = require('fs');
const path = require('path');
const APPT_FILE = path.join(__dirname, '..', '..', 'data', 'appointments.json');

function readLocalAppointments() {
  try {
    if (fs.existsSync(APPT_FILE)) {
      return JSON.parse(fs.readFileSync(APPT_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading local appointments:', err);
  }
  return [];
}

function writeLocalAppointments(list) {
  try {
    const dir = path.dirname(APPT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(APPT_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local appointments:', err);
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
    let appointments = null;
    if (supabaseUrl && (serviceKey || anonKey)) {
      try {
        const key = serviceKey || anonKey;
        const response = await fetch(`${supabaseUrl}/rest/v1/appointments?select=*&order=created_at.desc`, {
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          appointments = data.map(a => ({
            id: a.id,
            clientName: a.client_name,
            clientPhone: a.client_phone,
            proName: a.pro_name,
            category: a.category,
            serviceName: a.service_name,
            dateTime: a.scheduled_at,
            amount: a.amount_display || `ZMW ${a.amount_numeric}`,
            fee: a.fee_display || `ZMW ${a.fee_numeric}`,
            gateway: a.gateway,
            status: a.status,
            whatsappSent: !!a.whatsapp_sent
          }));
        }
      } catch (err) {
        console.warn('Supabase appointments fetch error, using local file:', err.message);
      }
    }

    if (!appointments || appointments.length === 0) {
      appointments = readLocalAppointments();
    }

    return res.status(200).json({
      success: true,
      appointments
    });
  }

  if (req.method === 'POST') {
    const { action, appointment, id, status, whatsappSent } = req.body || {};
    const list = readLocalAppointments();

    if (action === 'create' || appointment) {
      const newApt = appointment || {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: req.body.clientName || 'Guest Client',
        clientPhone: req.body.clientPhone || '+260 97 0000000',
        proName: req.body.proName || 'Specialist',
        category: req.body.category || 'Nails',
        serviceName: req.body.serviceName || 'Standard Service',
        dateTime: req.body.dateTime || new Date().toISOString(),
        amount: req.body.amount || 'ZMW 500.00',
        fee: req.body.fee || 'ZMW 75.00',
        gateway: req.body.gateway || 'Paystack',
        status: req.body.status || 'confirmed',
        whatsappSent: !!req.body.whatsappSent
      };

      list.unshift(newApt);
      writeLocalAppointments(list);

      // Save to Supabase if available
      if (supabaseUrl && (serviceKey || anonKey)) {
        try {
          const key = serviceKey || anonKey;
          await fetch(`${supabaseUrl}/rest/v1/appointments`, {
            method: 'POST',
            headers: {
              'apikey': key,
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: newApt.id,
              client_name: newApt.clientName,
              client_phone: newApt.clientPhone,
              pro_name: newApt.proName,
              category: newApt.category,
              service_name: newApt.serviceName,
              scheduled_at: new Date().toISOString(),
              amount_display: newApt.amount,
              amount_numeric: parseFloat(newApt.amount.replace(/[^0-9.]/g, '') || 0),
              fee_display: newApt.fee,
              fee_numeric: parseFloat(newApt.fee.replace(/[^0-9.]/g, '') || 0),
              gateway: newApt.gateway,
              status: newApt.status,
              whatsapp_sent: newApt.whatsappSent
            })
          });
        } catch (err) {
          console.warn('Supabase appt save error:', err.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Appointment recorded.',
        appointment: newApt
      });
    }

    if (id) {
      const apt = list.find(a => a.id === id);
      if (apt) {
        if (status !== undefined) apt.status = status;
        if (whatsappSent !== undefined) apt.whatsappSent = !!whatsappSent;
        writeLocalAppointments(list);
      }

      if (supabaseUrl && (serviceKey || anonKey)) {
        try {
          const key = serviceKey || anonKey;
          const payload = {};
          if (status !== undefined) payload.status = status;
          if (whatsappSent !== undefined) payload.whatsapp_sent = !!whatsappSent;
          await fetch(`${supabaseUrl}/rest/v1/appointments?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
              'apikey': key,
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.warn('Supabase appt update error:', err.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: `Appointment ${id} updated.`,
        appointment: apt
      });
    }

    return res.status(400).json({ error: 'Invalid payload: provide appointment object or id.' });
  }

  return res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
};
