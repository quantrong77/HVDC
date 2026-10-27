import { create } from "zustand";
import { SIDEBAR_STORAGE_KEY } from "@/lib/theme";

/**
 * Trạng thái sidebar:
 * - desktop (≥ lg): cột cố định, ẩn/hiện được, lựa chọn lưu ở localStorage và phản ánh qua <html data-sidebar>
 * - mobile: ngăn kéo trượt ra, mặc định đóng, không lưu
 */
interface UiState {
  desktopOpen: boolean;
  mobileOpen: boolean;
  syncDesktopFromDom: () => void;
  toggleSidebar: () => void;
  closeMobile: () => void;
}

const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

export const useUiStore = create<UiState>()((set, get) => ({
  desktopOpen: true,
  mobileOpen: false,
  syncDesktopFromDom: () => set({ desktopOpen: document.documentElement.dataset.sidebar !== "closed" }),
  toggleSidebar: () => {
    if (!isDesktop()) {
      set({ mobileOpen: !get().mobileOpen });
      return;
    }
    const next = !get().desktopOpen;
    document.documentElement.dataset.sidebar = next ? "open" : "closed";
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "open" : "closed");
    } catch {
      // Không lưu được thì chỉ áp dụng cho phiên này
    }
    set({ desktopOpen: next });
  },
  closeMobile: () => set({ mobileOpen: false }),
}));
