exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { statusCode: 500, body: 'Telegram env not configured' };
  const d = JSON.parse(event.body || '{}');
  const text = `📩 Yangi ariza\n\n👤 F.I.Sh: ${d.name || ''}\n📞 Telefon: ${d.phone || ''}\n🎓 Yo‘nalish: ${d.program || ''}\n📝 Izoh: ${d.note || ''}\n👥 User: ${d.user?.login || 'unknown'}`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  return { statusCode: res.ok ? 200 : 500, body: await res.text() };
};
