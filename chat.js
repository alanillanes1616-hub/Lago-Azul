const API_URL = "http://127.0.0.1:8000/chat";
const SESSION_ID = crypto.randomUUID();

async function enviarMensaje() {
    const input = document.getElementById("mensaje");
    const chat = document.getElementById("chat");

    if (!input || !chat) {
        console.error("No se encontró el elemento 'mensaje' o 'chat' en el HTML.");
        return;
    }

    const mensaje = input.value.trim();
    if (!mensaje) return;

    // Mostrar mensaje del usuario
    chat.innerHTML += `
        <div class="user" style="margin: 8px 0; text-align: right;">
            <b>Tú:</b> ${mensaje}
        </div>
    `;

    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                session_id: SESSION_ID,
                message: mensaje
            })
        });

        const data = await response.json();
        const respuestaIA = data.response || data.message || "Respuesta recibida";

        // Mostrar respuesta de la IA
        chat.innerHTML += `
            <div class="bot" style="margin: 8px 0; text-align: left; color: #0f2b46;">
                <b>Lago Azul AI:</b> ${respuestaIA}
            </div>
        `;

    } catch (error) {
        chat.innerHTML += `
            <div class="bot" style="margin: 8px 0; color: red;">
                No fue posible conectar con el asistente.
            </div>
        `;
        console.error(error);
    }

    chat.scrollTop = chat.scrollHeight;
}
