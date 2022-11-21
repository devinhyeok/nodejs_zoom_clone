import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 서버 생성 후, http 서버 정보 넣어서 websocket 서버 생성
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 소켓 이벤트
function onSocketClose() {
    console.log("❌ disconnected from browser");
}

// 연결된 소켓 리스트
const sockets = [];

// 브라우저와 연결
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "anonymous";
    console.log("✅ connected to browser");
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message": {
                sockets.forEach(((aSocket) =>
                    aSocket.send(`${socket.nickname}: ${message.payload}`))
                );
            }
            case "nickname": {
                socket["nickname"] = message.payload;
            }
        }
    });
    socket.on("close", onSocketClose);
});

server.listen(3000, handleListen);