import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// http 서버 생성 후, http 서버 정보 넣어서 websocket 서버 생성
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    // socket.io admin 패널 설정
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});
// socket.io admin 패널 설정
instrument(io, {
    auth: false,
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);