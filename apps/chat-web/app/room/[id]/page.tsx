import { getRoomChats, getToken } from "@/actions";
import ChatRoom from "@/components/custom/chat-room";

const RoomId = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const chats = await getRoomChats(id);
  const token = await getToken();
  return (
    <ChatRoom
      token={token ?? ""}
      roomId={id}
      messages={chats.messages}
    />
  );
};

export default RoomId;
