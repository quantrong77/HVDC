/** Dùng chung cho server (script trong <head>) và client (nút chuyển theme) - không đặt trong module "use client" */
export const THEME_STORAGE_KEY = "hvdc-theme";

/** Áp dụng theme đã lưu trước khi trình duyệt vẽ trang, tránh chớp nền sáng khi người dùng đã chọn nền tối */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;
