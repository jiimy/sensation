import { create } from "zustand";

type selectMusicType = {
  selectMusic: number;
  setSelectMusic: (state: number) => void;
}

export const selectMusicStore = create<selectMusicType>((set) => ({
  selectMusic: -1,
  setSelectMusic: (state: number) => {
    set(() => ({ selectMusic: state }));
  },
}));