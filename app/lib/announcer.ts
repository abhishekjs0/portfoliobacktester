export function announce(message: string) {
  if (typeof document === "undefined") return;
  const region = document.getElementById("toast-announcer");
  if (!region) return;
  region.textContent = message;
}
