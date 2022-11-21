const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); // 소켓 생성, 생성시 자동으로 서버에 웹 소켓 연결 요청

// 소켓 핸들러
function makeMessage(type, payload) {
    const msg = { type, payload }
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server ✅");
}

function handleMessage(message) {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
}

function handleClose() {
    console.log("❌ disconnected from server");
}

// 소켓 이벤트 바인딩
socket.addEventListener("open", handleOpen); // 서버와 연결
socket.addEventListener("message", handleMessage);
socket.addEventListener("close", handleClose);


// 버튼 이벤트
function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

// 버튼 이벤트 바인딩
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);