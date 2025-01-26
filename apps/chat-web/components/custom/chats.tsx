"use client";
import { wsMessage } from "@/types";
import { Input } from "../ui/input";
import { wsMethods } from "@repo/common/types";
import { useEffect, useState } from "react";

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
  const [userDetails, setUserDetails] = useState({
    name: "unknown user",
  });
  useEffect(() => {
    if (window) {
      const userDetails = JSON.parse(
        window.localStorage.getItem("user") as string
      );
      if (userDetails) {
        setUserDetails({ name: userDetails.name });
      } else {
        console.log("User not found in local storage");
      }
    }
  }, []);
  const sendMessage = () => {
    if (chatInput) {
      ws?.send(
        JSON.stringify({
          method: wsMethods.CHAT,
          roomId: roomId,
          content: `${userDetails.name}: ${chatInput}`,
        })
      );
    }
  };
  return (
    <div className=" absolute right-0 bottom-0 h-screen bg-black/10 flex flex-col justify-end px-10 max-w-max">
      {chats.map((chat, index) => (
        <div
          key={index}
          className="flex flex-col gap-4"
        >
          <p>{chat.content}</p>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          className="bg-slate-500 flex-1"
          placeholder="Type a message..."
          value={chatInput}
          type="text"
          onChange={(e) => {
            setChatInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              setChatInput("");
            }
          }}
        />
      </div>
    </div>
  );
};

export default Chats;
