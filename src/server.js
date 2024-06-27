import http from "http";
import WebSocket from "ws";
// Node 속성 서버 설정
import express from "express";

// Express 애플리케이션 인스턴스 생성
const app = express();

// 템플릿 엔진을 Pug로 설정
app.set("view engine", "pug");
// 뷰 파일들이 위치한 디렉토리를 설정
app.set("views", __dirname + "/views");

// 정적 파일을 제공하기 위해 '/public' 경로 설정
app.use("/public", express.static(__dirname + "/public"));

// 루트 경로에 대한 GET 요청을 처리하여 home.pug를 렌더링
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("/"));

// 서버가 시작되었을 때 호출되는 콜백 함수
const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 포트 3000에서 서버 리스닝 시작
// app.listen(3000, handleListen)

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Connected to Browser✅");
  socket.on("close", () => console.log("DisConnected to Browser❎"));
  socket.on("message", (message) => {
    console.log(message.toString("utf8"));
  });
  socket.send("hello");
});

server.listen(3000, handleListen);
