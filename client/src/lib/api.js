const API_BASE = import.meta.env.VITE_API_URL || "/api";
const SERVER_BASE = API_BASE.startsWith("http") ? new URL(API_BASE).origin : "";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
} 

export async function api(path, options = {}) {
  const token = localStorage.getItem("campusmarket_token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("campusmarket_token");
      window.dispatchEvent(new Event("campusmarket:unauthorized"));
    }
    throw new ApiError(payload.message || "Unable to complete that request.", response.status, payload.details);
  }
  return payload.data;
}

export function resolveImage(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `${SERVER_BASE}${image}`;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export const categories = [
  "All",
  "Books",
  "Electronics",
  "Hostel Essentials",
  "Cycles",
  "Notes",
  "Lab Equipment",
  "Other",
];
