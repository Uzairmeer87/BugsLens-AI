import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isAIAssistantOpen: boolean;
  isNotificationsOpen: boolean;
  activeProjectId: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAIAssistantOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setActiveProjectId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  isAIAssistantOpen: false,
  isNotificationsOpen: false,
  activeProjectId: null,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setAIAssistantOpen: (open) => set({ isAIAssistantOpen: open }),
  setNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
}));
