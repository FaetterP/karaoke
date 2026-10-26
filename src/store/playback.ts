import { create } from "zustand";

type PlaybackStore = {
  timeMs: number;
  isHide: boolean;
  setTimeMs: (timeMs: number) => void;
  setIsHide: (isHide: boolean) => void;
};

export const usePlayback = create<PlaybackStore>()((set, get) => ({
  timeMs: 0,
  isHide: false,
  setTimeMs: (timeMs) => set({ timeMs }),
  setIsHide: (isHide) => set({ isHide }),
}));
