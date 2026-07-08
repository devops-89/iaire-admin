import { create } from "zustand";

export interface ModalConfig {
  width?: string;
  maxWidth?: string;
  size?: "sm" | "md" | "lg";
}

interface ModalState {
  content: boolean | any;
  config?: ModalConfig;
  showModal: (content: any, config?: ModalConfig) => void;
  hideModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  content: false,
  config: undefined,
  showModal: (content, config) => set({ content, config }),
  hideModal: () => set({ content: false, config: undefined }),
}));
