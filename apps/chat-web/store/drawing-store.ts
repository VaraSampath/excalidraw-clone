import { create, ExtractState, useStore } from "zustand";

interface DrawState {
  drawings: { x1: number; y1: number; x2: number; y2: number }[];
  increase: (by: {
    x1: number;

    y1: number;

    x2: number;

    y2: number;
  }) => void;
}
const useDrawingStore = create<DrawState>((set) => ({
  drawings: [],
  increase: (by) => set((state) => ({ drawings: [...state.drawings, by] })),
}));

export type storeState = ExtractState<typeof useStore>;

export default useDrawingStore;
