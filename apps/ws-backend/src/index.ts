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

const getUser = async (token: string) => {
  if (!token) {
    return null;
  }
  try {
    const decoded = await jwt.verify(token, SECRET_KEY);

    if (typeof decoded === "string") {
      return null;
    }
    return decoded.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

wss.on("connection", async (ws, req) => {
  const url = new URLSearchParams(req?.url?.split("?")[1] ?? "");
  const token = url.get("token");

  try {
    if (token) {
      const userId = await getUser(token);

      if (userId === null) {
        ws.close();
        return null;
      }
      ws.on("message", (data) => {
        const parsedData = JSON.parse(data as unknown as string);
        if (parsedData.method === wsMethods.JOIN_ROOM) {
          const { roomId } = parsedData;
          const user = users.find((user) => user.userId === userId);
          if (user) {
            user.rooms.push(roomId);
          } else {
            users.push({
              ws,
              rooms: [roomId],
              userId,
            });
          }
        }
        if (parsedData.method === wsMethods.CHAT) {
          const { roomId, content } = parsedData;
          const filteredUsers = users.filter((user) =>
            user.rooms.includes(roomId)
          );

          for (const user of filteredUsers) {
            user.ws.send(
              JSON.stringify({
                method: wsMethods.CHAT,
                roomId,
                content,
              })
            );
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
