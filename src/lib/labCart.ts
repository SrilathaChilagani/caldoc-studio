export type LabCartItem = {
  name: string;
  qty: number;
};

const STORAGE_KEY = "labDeliveryCart";
export const LAB_CART_EVENT = "lab-cart-updated";

function normalizeItem(item: LabCartItem): LabCartItem | null {
  const name = String(item.name || "").trim();
  if (!name) return null;
  const qty = Math.max(1, Number(item.qty) || 1);
  return { name, qty };
}

export function loadLabCart(): LabCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LabCartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter(Boolean) as LabCartItem[];
  } catch {
    return [];
  }
}

export function saveLabCart(items: LabCartItem[]) {
  const normalized = items.map(normalizeItem).filter(Boolean) as LabCartItem[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(LAB_CART_EVENT));
}

export function clearLabCart() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(LAB_CART_EVENT));
}
