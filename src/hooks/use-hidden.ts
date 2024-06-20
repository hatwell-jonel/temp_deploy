import { create } from "zustand";

interface HiddenState {
  isHidden: boolean;
  setIsHidden: (isHidden: boolean) => void;
}

export const useHidden = create<HiddenState>()((set) => ({
  isHidden: false,
  setIsHidden: (isHidden: boolean) => set({ isHidden }),
}));
