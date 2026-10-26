import { create } from "zustand";

type PlaybackStore = {
  timeMs: number;
  setTimeMs: (timeMs: number) => void;
};

export const usePlayback = create<PlaybackStore>()((set, get) => ({
  timeMs: 0,
  setTimeMs: (timeMs) => set({ timeMs }),
}));
