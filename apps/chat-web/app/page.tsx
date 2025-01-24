import { getRooms } from "@/actions";
import CreateRoom from "@/components/custom/create-room";
import { Button } from "@/components/ui/button";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const rooms = await getRooms();
  if (!rooms || !rooms.length) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <CreateRoom />
      </div>
    );
  }
  return (
    <div className="p-5 min-h-dvh flex flex-col items-start justify-start">
      <h1 className="text-4xl mb-9">Your Rooms</h1>
      {rooms.map((room) => (
        <div
          key={room.id}
          className="p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col gap-4"
        >
          <h1 className=" capitalize">{room.slug.toLowerCase()}</h1>
          <Button variant={"ghost"}>
            <Link
              href={`/room/${room.id}`}
              className="flex gap-6 items-center"
            >
              Join Room
              <ArrowBigRight className="" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
