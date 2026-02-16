export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, apiKey } = req.body;

  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return res.status(401).json({ error: { type: 'authentication_error' } });
  }

  const SYSTEM = `Eres ZYNTHEXA AI, asistente oficial de ZYNTHEXA, plataforma de IA para creadores de contenido.
Personalidad: Entusiasta, inspirador, profesional y cercano. Respondes en español o inglés según el usuario.
ZYNTHEXA: videos con avatar, guiones virales, imágenes épicas, editor profesional, análisis de tendencias.
Planes: Gratis $0/mes, Pro $9.99/mes, Creator $24.99/mes. Lanzamiento Marzo 2026. Web: zynthexa.com
Ayuda con: contenido, marketing digital, redes sociales, IA y negocios. Máximo 3 párrafos por respuesta.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM,
        messages: messages.slice(-20)
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Server error' } });
  }
}
