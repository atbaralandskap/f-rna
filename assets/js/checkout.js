// Stage B scaffold only. Real endpoint and submit flow come later.
export const ORDER_ENDPOINT = "https://example.invalid/order";

export async function submitOrder(_payload) {
  throw new Error("Not implemented");
}

export function initCheckout() {
  // no-op
}
