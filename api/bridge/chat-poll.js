/**
 * Vercel Serverless Function: Poll/Fetch Chat Messages for a Conversation
 * GET /api/bridge/chat-poll?sessionId=... or ?conversationId=...
 */

const fs = require('fs');
const path = require('path');
const CONV_FILE = path.join(__dirname, '..', '..', 'data', 'conversations.json');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionId = req.query && req.query.sessionId;
  const conversationId = req.query && req.query.conversationId;

  if (!sessionId && !conversationId) {
    return res.status(400).json({ error: 'Missing required query parameter: sessionId or conversationId' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && anonKey) {
    try {
      let targetConvId = conversationId;
      if (!targetConvId && sessionId) {
        const convRes = await fetch(
          `${supabaseUrl}/rest/v1/support_conversations?session_id=eq.${sessionId}&select=id`,
          {
            headers: {
              'apikey': anonKey,
              'Authorization': `Bearer ${anonKey}`
            }
          }
        );
        const convs = await convRes.json();
        if (Array.isArray(convs) && convs.length > 0) {
          targetConvId = convs[0].id;
        }
      }

      if (targetConvId) {
        const msgRes = await fetch(
          `${supabaseUrl}/rest/v1/support_messages?conversation_id=eq.${targetConvId}&order=created_at.asc`,
          {
            headers: {
              'apikey': anonKey,
              'Authorization': `Bearer ${anonKey}`
            }
          }
        );
        const msgs = await msgRes.json();
        if (Array.isArray(msgs)) {
          return res.status(200).json({
            success: true,
            conversationId: targetConvId,
            messages: msgs.map(m => ({
              id: m.id,
              senderType: m.sender_type,
              senderName: m.sender_name,
              content: m.content,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
          });
        }
      }
    } catch (err) {
      console.warn('Supabase poll error, falling back to local file:', err.message);
    }
  }

  // Fallback to local file
  try {
    if (fs.existsSync(CONV_FILE)) {
      const list = JSON.parse(fs.readFileSync(CONV_FILE, 'utf-8'));
      const conv = list.find(c => (sessionId && c.sessionId === sessionId) || (conversationId && c.id === conversationId));
      if (conv) {
        return res.status(200).json({
          success: true,
          conversationId: conv.id,
          status: conv.status,
          messages: conv.messages || []
        });
      }
    }
  } catch (err) {
    console.error('Error reading local conversations:', err);
  }

  return res.status(200).json({
    success: true,
    messages: []
  });
};
