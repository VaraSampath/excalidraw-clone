"use server";

import { room } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await axios.post("http://localhost:3005/signin", {
      email,
      password,
    });
    if (data.token) {
      (await cookies()).set("token", data.token);
    }
    return data.token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRooms = async () => {
  try {
    const { data } = await axios.get("http://localhost:3005/get-rooms", {
      headers: {
        Authorization: `${(await cookies()).get("token")?.value}`,
      },
    });
    return data as room[];
  } catch (_e) {
    console.log(_e);
    return null;
  }
};

export const createRoom = async (name: string) => {
  try {
    const { data } = await axios.post(
      "http://localhost:3005/room",
      { name },
      {
        headers: {
          Authorization: `${(await cookies()).get("token")?.value}`,
        },
      }
    );
    return data;
  } catch (_e) {
    console.log(_e);
    return null;
  }
};

export const getRoomChats = async (id: string) => {
  try {
    const { data } = await axios.get(`http://localhost:3005/get-room-chat`, {
      params: {
        roomId: id,
      },
      headers: {
        Authorization: `${(await cookies()).get("token")?.value}`,
      },
    });
    return data;
  } catch (_e) {
    console.log(_e);
    return null;
  }
};

export const getToken = async () => {
  return (await cookies()).get("token")?.value;
};
