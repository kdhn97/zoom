import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

// 뷰 엔진 설정
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// 정적 파일 제공
app.use("/public", express.static(__dirname + "/public"));

// 홈 경로 설정
app.get("/", (_, res) => res.render("home"));

// 모든 다른 경로를 홈으로 리디렉션
app.get("/*", (_, res) => res.redirect("/"));

// HTTP 서버 생성
const httpServer = http.createServer(app);

// WebSocket 서버 생성
const wsServer = SocketIO(httpServer);

// WebSocket 연결 이벤트 핸들러
wsServer.on("connection", (socket) => {
  // 사용자가 방에 참가할 때
  socket.on("join_room", (roomName) => {
    socket.join(roomName); // 방에 참가
    socket.to(roomName).emit("welcome"); // 다른 사용자에게 환영 메시지 전송
  });

  // 사용자가 offer 신호를 보낼 때
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer); // 방의 다른 사용자에게 offer 전송
  });

  // 사용자가 answer 신호를 보낼 때
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer); // 방의 다른 사용자에게 answer 전송
  });

  // ICE 후보를 받을 때
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice); // 방의 다른 사용자에게 ICE 후보 전송
  });
});

// 서버 시작 및 포트 3001에서 수신 대기
const handleListen = () => console.log(`Listening on http://localhost:3002`);
httpServer.listen(3002, handleListen);
