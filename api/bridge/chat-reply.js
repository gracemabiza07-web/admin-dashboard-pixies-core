/**
 * Vercel Serverless Function: Outbound Reply from Marketing / HR
 * POST /api/bridge/chat-reply
 */

const fs = require('fs');
const path = require('path');
const CONV_FILE = path.join(__dirname, '..', '..', 'data', 'conversations.json');

function saveReplyToLocalConversations(conversationId, senderName, senderRole, content, markResolved) {
  try {
    if (!fs.existsSync(CONV_FILE)) return null;
    const list = JSON.parse(fs.readFileSync(CONV_FILE, 'utf-8'));
    const conv = list.find(c => c.id === conversationId || c.sessionId === conversationId);
    if (!conv) return null;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderType: 'marketing_hr',
      senderName: senderName || 'Marketing & HR Specialist',
      senderRole: senderRole || 'Staff Member',
      content: content,
      timestamp: timeStr
    };

    conv.messages.push(newMsg);
    conv.lastMessage = content;
    conv.lastMessageAt = 'Just now';
    conv.status = markResolved ? 'resolved' : 'in_progress';
    conv.unread = false;

    fs.writeFileSync(CONV_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newMsg;
  } catch (err) {
    console.error('Error saving local reply:', err);
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

  const { conversationId, senderName, senderRole, content, markResolved } = req.body || {};

  if (!conversationId || !content) {
    return res.status(400).json({ error: 'Missing required fields: conversationId and content are mandatory.' });
  }

  // Save to persistent file
  const localMsg = saveReplyToLocalConversations(conversationId, senderName, senderRole, content, markResolved);

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({
      success: true,
      mode: 'mock_local',
      message: 'Marketing / HR reply processed in local memory.',
      reply: localMsg || {
        conversationId,
        senderName: senderName || 'Marketing & HR Specialist',
        senderRole: senderRole || 'Staff Member',
        content,
        sentAt: new Date().toISOString()
      }
    });
  }

  try {
    // 1. Insert Reply into support_messages
    const msgResponse = await fetch(`${supabaseUrl}/rest/v1/support_messages`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender_type: 'marketing_hr',
        sender_name: senderName || 'Marketing & HR Lead',
        sender_id: senderRole || 'Staff',
        content: content
      })
    });

    const msgData = await msgResponse.json();

    // 2. Update Conversation status and last_message
    await fetch(`${supabaseUrl}/rest/v1/support_conversations?id=eq.${conversationId}`, {
      method: 'PATCH',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: markResolved ? 'resolved' : 'in_progress',
        last_message: content,
        last_message_at: new Date().toISOString(),
        assigned_agent: senderName || 'Marketing & HR'
      })
    });

    return res.status(200).json({
      success: true,
      data: (Array.isArray(msgData) && msgData[0]) || localMsg
    });
  } catch (error) {
    console.error('Chat reply dispatch error:', error);
    return res.status(200).json({
      success: true,
      mode: 'fallback_saved_locally',
      data: localMsg
    });
  }
};
