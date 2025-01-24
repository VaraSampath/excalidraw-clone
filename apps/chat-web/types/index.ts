export type room = {
  id: number;
  slug: string;
  admin: string;
  createdAt: string;
};

export type wsMessage = {
  roomId: number;
  content: string;
  method: string;
};
