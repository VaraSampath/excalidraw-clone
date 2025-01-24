"use client";

import { Label } from "@radix-ui/react-label";

import { Mail, ArrowRight, DoorOpen } from "lucide-react";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { createRoom } from "@/actions";
import { useRouter } from "next/navigation";

const CreateRoom = () => {
  const [roomname, setRoomname] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoom(roomname);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create a new room
          </h1>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomname">Room name</Label>
              <div className="relative">
                <DoorOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="roomname"
                  type="roomname"
                  placeholder="Enter your room name"
                  className="pl-9"
                  value={roomname}
                  onChange={(e) => setRoomname(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
            >
              Create
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default CreateRoom;
