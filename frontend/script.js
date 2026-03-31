let chats = [[]];
let currentChat = 0;

function newChat() {
    chats.push([]);
    currentChat = chats.length - 1;
    render();
}

function addMessage(text, type) {
    chats[currentChat].push({ text, type });
    render();
}

function render() {
    const chatDiv = document.getElementById("chat");
    chatDiv.innerHTML = "";
    chats[currentChat].forEach(m => {
        let div = document.createElement("div");
        div.className = "message " + m.type;
        div.innerText = m.text;
        chatDiv.appendChild(div);
    });
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function send() {
    const input = document.getElementById("input");
    const text = input.value;
    if (!text) return;

    addMessage("You: " + text, "user");
    input.value = "";

    let thinkingIndex = chats[currentChat].length;
    chats[currentChat].push({ text: "AI is thinking...", type: "ai thinking" });
    render();

    try {
        const messages = chats[currentChat].map(m => {
            if (m.type === "user") return { role: "user", content: m.text.replace(/^You: /, "") };
            if (m.type === "ai") return { role: "assistant", content: m.text.replace(/^AI: /, "") };
        }).filter(Boolean);

        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages })
        });

        const data = await res.json();
        chats[currentChat][thinkingIndex] = { text: "AI: " + data.answer, type: "ai" };
        render();
    } catch {
        chats[currentChat][thinkingIndex] = { text: "AI: Could not connect to server.", type: "ai" };
        render();
    }
}

document.addEventListener("keypress", e => { if (e.key === "Enter") send(); });
render();
