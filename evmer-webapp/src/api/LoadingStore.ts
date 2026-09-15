import {create} from "zustand"

type LoadingState =  {
    activeRequests: number;
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    
}

let loadingTimer: ReturnType<typeof setTimeout> | null = null;

export const useLoadingStore = create<LoadingState>((set) => ({
    activeRequests: 0,
    loading: false,

startLoading: () => {
  set((state) => ({
    activeRequests: state.activeRequests + 1,
  }));
// timer kada loader treba tj. ne treba da se ucitava.
// todo probati da se namesti umesto tajmera nesto drugo
  if (!loadingTimer) {
    loadingTimer = setTimeout(() => {
      set((state) => ({
        loading: state.activeRequests > 0,
      }));

      loadingTimer = null;
    }, 200);
  }
},


stopLoading: () => {
    set((state) => {
        const activeRequests = Math.max(0, state.activeRequests - 1);

    if (activeRequests === 0 && loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }

    return {
        activeRequests,
        loading: activeRequests > 0 ? state.loading : false,
      };
    });
  },
}));