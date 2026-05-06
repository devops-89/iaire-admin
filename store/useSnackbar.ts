import { create } from "zustand";

interface SnackbarState {
  open: boolean;
  message: string;
  variant: "success" | "error" | "warning" | "info";
  setSnackbar: (
    message: string,
    variant: "success" | "error" | "warning" | "info"
  ) => void;
  hideSnackbar: () => void;
}

const useSnackbar = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  variant: "success",
  setSnackbar: (message, variant) => set({ open: true, message, variant }),
  hideSnackbar: () => set({ open: false }),
}));

export default useSnackbar;
