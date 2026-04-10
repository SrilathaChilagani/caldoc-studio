export type RxCartItem = {
  name: string;
  qty: number;
  category?: string | null;
  form?: string | null;
  strength?: string | null;
  generic?: string | null;
};

const STORAGE_KEY = "rxDeliveryCart";
export const RX_CART_EVENT = "rx-cart-updated";

function normalizeItem(item: RxCartItem): RxCartItem | null {
  const name = String(item.name || "").trim();
  if (!name) return null;
  const qty = Math.max(1, Number(item.qty) || 1);
  return { name, qty, category: item.category ?? null, form: item.form ?? null, strength: item.strength ?? null, generic: item.generic ?? null };
}

export function loadRxCart(): RxCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RxCartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter(Boolean) as RxCartItem[];
  } catch {
    return [];
  }
}

export function saveRxCart(items: RxCartItem[]) {
  const normalized = items.map(normalizeItem).filter(Boolean) as RxCartItem[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(RX_CART_EVENT));
}

export function clearRxCart() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(RX_CART_EVENT));
}
