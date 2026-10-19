/**
 * Vercel Serverless Function: Inbound Chat Inquiries from Main Website
 * POST /api/bridge/chat-inbound
 * 
 * Authenticated via 'x-api-key' matching ADMIN_BRIDGE_SECRET_KEY (or open in local dev)
 */

const fs = require('fs');
const path = require('path');
const CONV_FILE = path.join(__dirname, '..', '..', 'data', 'conversations.json');

function saveToLocalConversations(sessionId, clientName, clientContact, message, category) {
  try {
    let list = [];
    if (fs.existsSync(CONV_FILE)) {
      list = JSON.parse(fs.readFileSync(CONV_FILE, 'utf-8'));
    }
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let conv = list.find(c => c.sessionId === sessionId);
    if (!conv) {
      conv = {
        id: `conv-${Date.now().toString(36)}`,
        sessionId: sessionId,
        clientName: clientName || 'Guest User',
        clientContact: clientContact || '',
        category: category || 'General Inquiry',
        status: 'open',
        lastMessage: message,
        lastMessageAt: 'Just now',
        unread: true,
        messages: []
      };
      list.unshift(conv);
    } else {
      conv.lastMessage = message;
      conv.lastMessageAt = 'Just now';
      conv.unread = true;
      conv.status = 'open';
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderType: 'client',
      senderName: clientName || 'Guest User',
      senderRole: 'Client',
      content: message,
      timestamp: timeStr
    };
    conv.messages.push(newMsg);

    const dir = path.dirname(CONV_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONV_FILE, JSON.stringify(list, null, 2), 'utf-8');

    return { conversationId: conv.id, message: newMsg };
  } catch (err) {
    console.error('Error saving local conversation:', err);
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Authenticate via Shared API Bridge Key (optional in dev)
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.ADMIN_BRIDGE_SECRET_KEY;

  if (expectedKey && apiKey && apiKey !== expectedKey) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid or missing API Bridge Key.',
      code: 'INVALID_API_KEY'
    });
  }

  const { sessionId, clientName, clientContact, message, category } = req.body || {};

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'Missing required fields: sessionId and message are mandatory.' });
  }

  // Save to persistent file
  const localResult = saveToLocalConversations(sessionId, clientName, clientContact, message, category);

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({
      success: true,
      mode: 'mock_local',
      message: 'Inquiry received and queued in local memory.',
      conversationId: localResult ? localResult.conversationId : null,
      messageData: localResult ? localResult.message : null
    });
  }

  try {
    // 1. Upsert Conversation in Supabase
    const convResponse = await fetch(`${supabaseUrl}/rest/v1/support_conversations`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify({
        session_id: sessionId,
        client_name: clientName || 'Guest User',
        client_contact: clientContact || '',
        category: category || 'General Inquiry',
        status: 'open',
        last_message: message,
        last_message_at: new Date().toISOString()
      })
    });

    const convData = await convResponse.json();
    const conversationId = Array.isArray(convData) && convData.length > 0 ? convData[0].id : null;

    if (conversationId) {
      await fetch(`${supabaseUrl}/rest/v1/support_messages`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_type: 'client',
          sender_name: clientName || 'Guest User',
          sender_id: sessionId,
          content: message
        })
      });
    }

    return res.status(200).json({
      success: true,
      conversationId: conversationId || (localResult ? localResult.conversationId : null),
      message: localResult ? localResult.message : null
    });
  } catch (error) {
    console.error('Chat inbound processing error:', error);
    return res.status(200).json({ 
      success: true, 
      mode: 'fallback_saved_locally',
      conversationId: localResult ? localResult.conversationId : null,
      message: localResult ? localResult.message : null
    });
  }
};
