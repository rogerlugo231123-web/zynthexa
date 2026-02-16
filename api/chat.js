async function send() {
    const inp = document.getElementById('chat-inp');
    const msgs = document.getElementById('msgs');
    const txt = inp.value.trim();
    
    if(!txt) return;
    
    // Añadir mensaje del usuario a la pantalla
    msgs.innerHTML += `<div style="text-align:right; margin-bottom:15px;"><span style="background:var(--secondary); padding:10px 15px; border-radius:15px; font-size:0.9rem;">${txt}</span></div>`;
    inp.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                messages: [{ role: 'user', content: txt }] 
            })
        });
        
        const data = await res.json();
        const reply = data.content[0].text;

        // Añadir respuesta de la IA a la pantalla
        msgs.innerHTML += `<div style="margin-bottom:15px;"><span style="background:var(--glass); border:1px solid var(--border); padding:10px 15px; border-radius:15px; font-size:0.9rem; display:inline-block;">${reply}</span></div>`;
    } catch(e) {
        msgs.innerHTML += `<div style="color:red; font-size:0.8rem;">Error: No pude conectar con el cerebro de Zynthexa.</div>`;
    }
    msgs.scrollTop = msgs.scrollHeight;
}
