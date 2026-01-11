import {create} from "zustand";

interface WindowsState {
  windowsList: any[];
  loadWindowsList: () => Promise<any>;
}

const getBaseUri = () => process.env.NEXT_PUBLIC_BASE_URI || ""

export const useWindowsStore = create<WindowsState>((set, get) => ({
  windowsList: [],

  loadWindowsList: async () => {
    const response = await fetch(getBaseUri() + "windows/read.php");
    const data = await response.json();
    set({windowsList: data});
  }
}));
