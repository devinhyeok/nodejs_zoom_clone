// 소켓 생성, 생성시 자동으로 서버에 웹 소켓 연결 요청
const socket = new WebSocket(`ws://${window.location.host}`);

// 서버와 연결
socket.addEventListener("open", () => {
    console.log("✅ connected to server");
});

socket.addEventListener("message", (message) => {
    console.log("message: \"", message.data, "\" from the server");
});

socket.addEventListener("close", () => {
    console.log("❌ disconnected from server");
});

setTimeout(() => {
    socket.send("hello");
}, 1000)