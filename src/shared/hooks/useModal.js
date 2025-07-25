import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isOpen: false,
  title: '',
  content: null,
  props: {},

  openModal: (title, content, props = {}) => set({ isOpen: true, title, content, props }),
  closeModal: () => set({ isOpen: false, title: '', content: null, props: {} }),
}));
