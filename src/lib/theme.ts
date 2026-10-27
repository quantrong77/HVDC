/** Dùng chung cho server (script trong <head>) và client (nút chuyển theme, nút sidebar) - không đặt trong module "use client" */
export const THEME_STORAGE_KEY = "hvdc-theme";
export const SIDEBAR_STORAGE_KEY = "hvdc-sidebar";

/**
 * Áp dụng lựa chọn đã lưu trước khi trình duyệt vẽ trang, tránh chớp:
 * - nền tối: thêm class "dark" vào <html>
 * - sidebar desktop đã ẩn: đặt data-sidebar="closed" trên <html> (CSS trong globals.css ẩn cột sidebar)
 */
export const THEME_INIT_SCRIPT = `try{var d=document.documentElement;if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")d.classList.add("dark");d.dataset.sidebar=localStorage.getItem("${SIDEBAR_STORAGE_KEY}")==="closed"?"closed":"open"}catch(e){}`;
