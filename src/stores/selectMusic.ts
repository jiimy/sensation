import { create } from "zustand";

type selectMusicType = {
  selectMusic: string;
}

export const useSelectMusicStore = create<selectMusicType>((set) => ({
  selectMusic: "",
  setSelectMusic: (newState: string) => {
    set(() => ({ selectMusic: newState }));
  },
}));