export default async function handler(req, res) {
  // Configuración de CORS para evitar bloqueos del navegador
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'API key no configurada en Vercel' } });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: { message: 'Formato de mensajes inválido' } });
  }

  const SYSTEM_PROMPT = `Eres ZYNTHEXA AI, asistente oficial de ZYNTHEXA.
Personalidad: Entusiasta, profesional e inspirador. 
ZYNTHEXA es una plataforma para creadores: videos con avatar, guiones, imágenes y análisis.
Planes: Gratis $0, Pro $9.99, Creator $24.99. Lanzamiento: Marzo 2026.
Responde de forma concisa (máximo 3 párrafos).`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // Modelo más compatible con cuentas nuevas
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Error de Anthropic:', data.error);
      return res.status(400).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ error: { message: 'Error interno del servidor' } });
  }
}
