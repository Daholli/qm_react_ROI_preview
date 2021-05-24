import create from "zustand";

const [storage] = create((set) => ({
    width: window.innerWidth,
    height: window.innerHeight,

    setSize: ({ width, height }) => set({ width, height }),

    playerWidth: 320,
    playerHeight: 180,

    setPlayerSize: (size) =>
        set(() => ({ playerWidth: size.width, playerHeight: size.height })),
    scale: 1,
    setScale: (scale) => set({ scale }),
    isDrawing: false,
    toggleDrawing: () => set((state) => ({ isDrawing: !state.isDrawing })),

    selectedMarkerID: null,
    selectMarker: (selectedMarkerID) => set({ selectedMarkerID }),
}));

export default storage;
