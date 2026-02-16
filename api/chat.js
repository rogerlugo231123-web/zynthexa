export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const key = process.env.GEMINI_API_KEY || "NO_HAY_KEY";
    
    if (key === "NO_HAY_KEY") {
      return res.status(200).json({ content: [{ text: "❌ Error: No has guardado la variable GEMINI_API_KEY en Vercel." }] });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Hola" }] }] })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ content: [{ text: `❌ Google dice: ${data.error.message}` }] });
    }

    return res.status(200).json({ content: [{ text: "✅ ¡CONEXIÓN EXITOSA! Zynthexa está vivo." }] });

  } catch (e) {
    return res.status(200).json({ content: [{ text: "❌ Error crítico: " + e.message }] });
  }
}
