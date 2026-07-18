const API_URL = "http://127.0.0.1:8000/chat";

const SESSION_ID = crypto.randomUUID();

async function enviarMensaje() {

    const input = document.getElementById("mensaje");
    const chat = document.getElementById("chat");

    const mensaje = input.value.trim();

    if (!mensaje) return;

    chat.innerHTML += `
        <div class="user">
            ${mensaje}
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

        chat.innerHTML += `
            <div class="bot">
                ${data.response}
            </div>
        `;

    } catch (error) {

        chat.innerHTML += `
            <div class="bot">
                No fue posible conectar con el asistente.
            </div>
        `;

        console.error(error);
    }

    chat.scrollTop = chat.scrollHeight;
}