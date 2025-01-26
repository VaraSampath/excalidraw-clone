"use client";
import { wsMessage } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { wsMethods } from "@repo/common/types";
import { useState } from "react";

const Chats = ({
  ws,
  chats,
  roomId,
}: {
  ws: WebSocket;
  chats: wsMessage[];
  roomId: string;
}) => {
  const [chatInput, setChatInput] = useState("");
  const sendMessage = () => {
    ws?.send(
      JSON.stringify({
        method: wsMethods.CHAT,
        roomId: roomId,
        content: chatInput,
      })
    );
  };
  return (
    <div>
      {chats.map((chat, index) => (
        <div key={index}>
          <p>{chat.content}</p>
        </div>
      ))}
      <Input
        type="text"
        onChange={(e) => setChatInput(e.target.value)}
      />
      <Button
        variant={"default"}
        onClick={sendMessage}
      >
        Send
      </Button>
    </div>
  );
};

export default Chats;
