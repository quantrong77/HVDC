"use client";

import React, { useEffect } from "react";
import { selectProgressPercent, useProgressStore } from "@/store/progress";

const LEGACY_KEY = "hvdc-progress-v1";

/** Nạp tiến độ từ localStorage sau khi mount (tránh lệch hydration giữa server và client) */
export function LearningProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      // Bản Context trước lưu object thuần; bọc lại theo định dạng của zustand persist
      const raw = window.localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && !("state" in parsed)) {
          window.localStorage.setItem(LEGACY_KEY, JSON.stringify({ state: parsed, version: 1 }));
        }
      }
    } catch {
      // Bỏ qua: trình duyệt chặn storage thì vẫn học được, chỉ không lưu
    }
    Promise.resolve(useProgressStore.persist.rehydrate()).finally(() => useProgressStore.setState({ isHydrated: true }));
  }, []);

  return <>{children}</>;
}

/** Hook tiện dụng giữ nguyên giao diện cũ cho các component */
export function useLearning() {
  const state = useProgressStore();
  return { ...state, progressPercent: selectProgressPercent(state) };
}
