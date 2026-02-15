const STORAGE_KEY = "forna_cart_v1";

function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];
  return cart.filter((item) => item && typeof item.id === "string");
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
  return safeCart;
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
}

export function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex((entry) => entry.id === item.id);

  if (idx >= 0) {
    const currentQty = Number(cart[idx].qty || 1);
    cart[idx] = { ...cart[idx], qty: currentQty + Number(item.qty || 1) };
  } else {
    cart.push({ ...item, qty: Number(item.qty || 1) });
  }

  return setCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  return setCart(cart);
}

export function updateCartQty(id, qty) {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, qty: Number(qty) } : item
  );
  return setCart(cart);
}

export { STORAGE_KEY };
