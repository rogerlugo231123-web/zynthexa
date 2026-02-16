export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Esta es una respuesta de prueba sin APIs externas
  return res.status(200).json({
    content: [{ text: "¡CONEXIÓN EXITOSA! Si ves este mensaje, el servidor de Vercel está funcionando. Ahora solo falta conectar la IA." }]
  });
}
