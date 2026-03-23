const STORAGE_KEY = "forna_cart_v1";
const CART_EVENT = "forna:cart-updated";
const DISCOUNT_TIERS = [
  { minimumQty: 100, rate: 0.4 },
  { minimumQty: 50, rate: 0.3 },
  { minimumQty: 10, rate: 0.2 },
  { minimumQty: 5, rate: 0.1 },
];
function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toPrice(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function roundSek(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function getDiscountTier(itemCount) {
  return DISCOUNT_TIERS.find((tier) => itemCount >= tier.minimumQty) ?? null;
}
function normalizeCartItem(item) {
  if (!item || typeof item.id !== "string" || item.id.trim() === "") {
    return null;
  }

  const qty = toInt(item.qty, 0);
  if (qty <= 0) return null;

  return {
    id: item.id.trim(),
    name:
      typeof item.name === "string" && item.name.trim() !== ""
        ? item.name.trim()
        : item.id.trim(),
    size:
      typeof item.size === "string" && item.size.trim() !== ""
        ? item.size.trim()
        : "",
    priceSek: toPrice(item.priceSek ?? item.price),
    qty,
  };
}

function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];

  const merged = new Map();

  for (const rawItem of cart) {
    const item = normalizeCartItem(rawItem);
    if (!item) continue;

    const existing = merged.get(item.id);
    if (!existing) {
      merged.set(item.id, item);
      continue;
    }

    merged.set(item.id, {
      ...existing,
      ...item,
      qty: existing.qty + item.qty,
    });
  }

  return Array.from(merged.values());
}

function emitCartUpdate(cart) {
  if (typeof window === "undefined") return;
  const summary = getCartSummary(cart);
  window.dispatchEvent(
    new CustomEvent(CART_EVENT, {
      detail: { cart, summary },
    })
  );
}

export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalizeCart(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function setCart(cart) {
  const safeCart = normalizeCart(cart);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeCart));
  emitCartUpdate(safeCart);
  return safeCart;
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
  emitCartUpdate([]);
}

export function getCartItemQty(id) {
  if (typeof id !== "string") return 0;
  const found = getCart().find((item) => item.id === id);
  return found ? found.qty : 0;
}

export function setCartItemQty(item, qty) {
  if (!item || typeof item.id !== "string" || item.id.trim() === "") {
    return getCart();
  }

  const id = item.id.trim();
  const nextQty = Math.max(0, toInt(qty, 0));
  const cart = getCart();
  const idx = cart.findIndex((entry) => entry.id === id);

  if (idx < 0) {
    if (nextQty <= 0) return cart;

    const nextItem = normalizeCartItem({ ...item, id, qty: nextQty });
    if (!nextItem) return cart;
    cart.push(nextItem);
    return setCart(cart);
  }

  if (nextQty <= 0) {
    cart.splice(idx, 1);
    return setCart(cart);
  }

  const merged = normalizeCartItem({
    ...cart[idx],
    ...item,
    id,
    qty: nextQty,
  });

  if (!merged) {
    cart.splice(idx, 1);
  } else {
    cart[idx] = merged;
  }

  return setCart(cart);
}

export function addToCart(item) {
  if (!item || typeof item.id !== "string") return getCart();
  const step = Math.max(1, toInt(item.qty, 1));
  return setCartItemQty(item, getCartItemQty(item.id) + step);
}

export function removeFromCart(id) {
  if (typeof id !== "string") return getCart();
  const cart = getCart().filter((item) => item.id !== id);
  return setCart(cart);
}

export function updateCartQty(id, qty) {
  if (typeof id !== "string") return getCart();
  const existing = getCart().find((item) => item.id === id);
  if (!existing) return getCart();
  return setCartItemQty(existing, qty);
}

export function getCartSummary(cart = getCart()) {
  let itemCount = 0;
  let subtotalSek = 0;

  for (const item of cart) {
    itemCount += item.qty;
    subtotalSek += item.qty * item.priceSek;
  }

  const discountTier = getDiscountTier(itemCount);
  const discountRate = discountTier?.rate ?? 0;
  const discountPercent = Math.round(discountRate * 100);
  const discountSek = roundSek(subtotalSek * discountRate);
  const totalSek = Math.max(0, subtotalSek - discountSek);

  return {
    itemCount,
    distinctCount: cart.length,
    subtotalSek,
    discountRate,
    discountPercent,
    discountMinimumQty: discountTier?.minimumQty ?? 0,
    discountSek,
    totalSek,
  };
}

export function formatSek(amount) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(Number(amount)) ? Number(amount) : 0);
}

export function subscribeCart(listener) {
  if (typeof window === "undefined" || typeof listener !== "function") {
    return () => {};
  }

  const handler = (event) => {
    const cart = event.detail?.cart ?? getCart();
    const summary = event.detail?.summary ?? getCartSummary(cart);
    listener(cart, summary);
  };

  window.addEventListener(CART_EVENT, handler);
  listener(getCart(), getCartSummary());

  return () => window.removeEventListener(CART_EVENT, handler);
}

export { STORAGE_KEY, CART_EVENT };
