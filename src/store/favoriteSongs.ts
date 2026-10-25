import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavoritesStore = {
  favoriteSong: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
};

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteSong: [],
      addItem: (item) => set((state) => ({ favoriteSong: state.favoriteSong.includes(item) ? 
        state.favoriteSong : [...state.favoriteSong, item]})),
      removeItem: (item) => set((state) => ({ favoriteSong: state.favoriteSong.filter((i) => i !== item)})),
    }),
    {
      name: "favorites",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
