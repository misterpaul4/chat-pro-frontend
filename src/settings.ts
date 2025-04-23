export const authLayoutPrimaryColor = "#0d0c22";
export const layoutPrimaryColor = "#ea4c89";
export const transparentTextColor = "lightgray";
export const hoverColor = "rgb(247, 247, 247)";
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const THREAD_MEMORY = new Map(); // { messageId as key }, IThreadMemory as type
export const SETTINGS = {
  maxLastScrolls: 5,
};

// CALL: all in seconds
export const MAX_CALL_WAIT_TIME = 20
export const END_CALL_DELAY = 1
export const CALL_RETRY_INTERVAL = 5