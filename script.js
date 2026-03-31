let chats = JSON.parse(localStorage.getItem("chats")) || [[]];
let currentChat = chats.length - 1;

function saveChats() { localStorage.setItem("chats", JSON.stringify(chats)); }
function newChat() { chats.push([]); currentChat = chats.length - 1; render(); }

function addMessage(text, type) { chats[currentChat].push({text, type}); saveChats(); render(); }
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

// ================= OPENAI API =================
async function fetchAIAnswer(question) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_OPENAI_API_KEY" // replace with your key
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: question }],
                max_tokens: 500
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (err) {
        return "I couldn't connect to AI API. Try again later.";
    }
}

// ================= SEND MESSAGE =================
async function send() {
    let input = document.getElementById("input");
    let text = input.value;
    if (!text) return;

    addMessage("You: " + text, "user");
    input.value = "";

    let thinkingIndex = chats[currentChat].length;
    chats[currentChat].push({text: "AI is thinking...", type: "ai thinking"});
    render();

    const answer = await fetchAIAnswer(text);

    chats[currentChat][thinkingIndex] = { text: "AI: " + answer, type: "ai" };
    saveChats();
    render();
}

document.addEventListener("keypress", e => { if (e.key === "Enter") send(); });
render();
