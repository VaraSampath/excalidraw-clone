import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@repo/backend-common/config";
import { wsMethods } from "@repo/common/types";
const wss = new WebSocketServer({ port: 8080 });

type TUser = {
  ws: WebSocket;
  userId: string;
  rooms: string[];
};

const users: TUser[] = [];

const getUser = (token: string): string | null => {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (typeof decoded === "string") {
      return null;
    }
    return decoded.id;
  } catch (error) {
    return null;
  }
};

wss.on("connection", async (ws, req) => {
  const url = new URLSearchParams(req?.url?.split("?")[1] ?? "");
  const token = url.get("token");
  console.log(token, "token");

  try {
    if (token) {
      const userId = getUser(token);
      console.log(userId, "userId");
      if (userId === null) {
        return null;
      }
      ws.on("message", (data) => {
        const parsedData = JSON.parse(data as unknown as string);
        if (parsedData.method === wsMethods.JOIN_ROOM) {
          const { roomId } = parsedData;
          users.push({
            ws,
            rooms: [roomId],
            userId,
          });
        }
        if (parsedData.method === wsMethods.CHAT) {
          const { roomId, message } = parsedData;
          const user = users.find((user) => user.rooms.includes(roomId));
          if (user) {
            user.ws.send(JSON.stringify({ method: wsMethods.CHAT, message }));
          }
        }
        if (parsedData.method === wsMethods.LEAVE_ROOM) {
          const { roomId } = parsedData;
          const user = users.find((user) => user.rooms.includes(roomId));
          if (user) {
            user.rooms = user.rooms.filter((room) => room !== roomId);
          }
        }
      });
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
});
