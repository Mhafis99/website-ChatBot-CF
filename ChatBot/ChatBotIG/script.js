const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
let chatArchives = JSON.parse(localStorage.getItem("chatArchives")) || [];

const clearBtn = document.getElementById("clearChat");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let chatHistory = [];

// ===== LOAD CHAT =====
window.onload = function () {
    userInput.focus();

    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
        chatHistory = JSON.parse(savedChat);

        if (chatHistory.length > 0) {
            showHistoryLabel();
        }

        chatHistory.forEach(chat => {
            addMessage(chat.text, chat.type, chat.time, false);
        });
    }
};

function showHistoryLabel() {
    const label = document.createElement("div");
    label.className = "history-label";
    label.innerText = "— Riwayat Chat —";
    chatBox.appendChild(label);
}



// ===== EVENT =====
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

clearBtn.addEventListener("click", () => {
    if (chatHistory.length === 0) return;

    const save = confirm("Simpan chat ke riwayat sebelum menghapus?");
    
    if (save) {
        chatArchives.push({
            id: Date.now(),
            date: new Date().toLocaleString(),
            messages: chatHistory
        });
        localStorage.setItem("chatArchives", JSON.stringify(chatArchives));
    }

    localStorage.removeItem("chatHistory");
    chatHistory = [];
    chatBox.innerHTML = `
        <div class="message bot">
            Halo 👋 Aku Albert Bot.
            <span class="time">${getTime()}</span>
        </div>
    `;
});

historyBtn.addEventListener("click", () => {
    renderHistory();
    historyPanel.classList.add("active");
});

function closeHistory() {
    historyPanel.classList.remove("active");
}

function renderHistory() {
    historyList.innerHTML = "";

    if (chatArchives.length === 0) {
        historyList.innerHTML = "<p>Tidak ada riwayat.</p>";
        return;
    }

    chatArchives.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <strong>${item.date}</strong><br>
            <small>${item.messages.length} pesan</small><br>
            <button onclick="restoreChat(${item.id})">Pulihkan</button>
            <button onclick="deleteHistory(${item.id})">Hapus</button>
        `;
        historyList.appendChild(div);
    });
}

function restoreChat(id) {
    const data = chatArchives.find(h => h.id === id);
    if (!data) return;

    chatHistory = data.messages;
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

    chatBox.innerHTML = "";
    chatHistory.forEach(chat => {
        addMessage(chat.text, chat.type, chat.time, false);
    });

    closeHistory();
}

function deleteHistory(id) {
    const confirmDelete = confirm("Hapus riwayat ini permanen?");
    if (!confirmDelete) return;

    chatArchives = chatArchives.filter(h => h.id !== id);
    localStorage.setItem("chatArchives", JSON.stringify(chatArchives));
    renderHistory();
}



// ===== SEND MESSAGE =====
function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    const time = getTime();
    addMessage(text, "user", time, true);
    userInput.value = "";

    showTyping();

    setTimeout(() => {
        removeTyping();
        const reply = "Aku masih bot sederhana 🤖";
        addMessage(reply, "bot", getTime(), true);
    }, 1000);
}

// ===== ADD MESSAGE =====
function addMessage(text, type, time, save) {
    const div = document.createElement("div");
    div.className = "message " + type;

    div.innerHTML = `
        ${text}
        <span class="time">${time}</span>
    `;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (save) {
        chatHistory.push({ text, type, time });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
}

// ===== TYPING =====
function showTyping() {
    const typing = document.createElement("div");
    typing.className = "typing";
    typing.id = "typing";
    typing.innerText = "Albert sedang mengetik...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typing");
    if (typing) typing.remove();
}

// ===== TIME =====
function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, "0") + ":" +
           now.getMinutes().toString().padStart(2, "0");
}
