import { create } from "zustand";

interface DrawState {
  drawings: { x1: number; y1: number; x2: number; y2: number }[];
  increase: (by: {
    x1: number;

    y1: number;

    x2: number;

    y2: number;
  }) => void;
}

interface User {
  name: string;
  id: string;
}
const useDrawingStore = create<DrawState>((set) => ({
  drawings: [],
  increase: (by) => set((state) => ({ drawings: [...state.drawings, by] })),
}));

const useUserStore = create<User>((set) => ({
  name: "",
  id: "",
  setName: (name: string) => set(() => ({ name })),
  setId: (id: string) => set(() => ({ id })),
}));

export { useDrawingStore, useUserStore };
