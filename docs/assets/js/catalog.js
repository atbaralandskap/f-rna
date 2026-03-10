import {
  formatSek,
  getCartItemQty,
  setCartItemQty,
  subscribeCart,
} from "./store.js";

function parseProductRow(row) {
  const id = row.dataset.id?.trim();
  const name = row.dataset.name?.trim();
  const size = row.dataset.size?.trim() ?? "";
  const priceSek = Number(row.dataset.priceSek);

  if (!id || !name || !Number.isFinite(priceSek)) return null;

  return {
    id,
    name,
    size,
    priceSek,
  };
}

function initCatalogRows() {
  const rows = new Map();

  for (const row of document.querySelectorAll(".js-product-row")) {
    const product = parseProductRow(row);
    const qtyNode = row.querySelector(".js-cart-qty");

    if (!product || !qtyNode) continue;
    rows.set(product.id, { product, qtyNode });
  }

  return rows;
}

function renderCartStatus(summary) {
  const statusEl = document.getElementById("catalog-cart-status");
  if (!statusEl) return;

  if (summary.itemCount <= 0) {
    statusEl.innerHTML =
      '<p class="catalog-cart-copy">Varukorgen är tom.</p><a class="catalog-cart-link" href="kassa.html">Gå till köp</a>';
    return;
  }

  const label = summary.itemCount === 1 ? "planta" : "plantor";
  statusEl.innerHTML = [
    '<p class="catalog-cart-copy">',
    `I varukorgen: <strong>${summary.itemCount} ${label}</strong> (${formatSek(summary.totalSek)})`,
    "</p>",
    '<a class="catalog-cart-link" href="kassa.html">Gå till köp</a>',
  ].join("");
}

export function initCatalog() {
  const rows = initCatalogRows();
  if (rows.size === 0) return;

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action][data-id]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const entry = rows.get(id);
    if (!entry) return;

    const currentQty = getCartItemQty(id);
    const delta = action === "plus" ? 1 : action === "minus" ? -1 : 0;
    if (delta === 0) return;

    setCartItemQty(entry.product, currentQty + delta);
  });

  subscribeCart((cart, summary) => {
    for (const [id, entry] of rows.entries()) {
      const item = cart.find((cartItem) => cartItem.id === id);
      entry.qtyNode.textContent = String(item ? item.qty : 0);
    }

    renderCartStatus(summary);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCatalog, { once: true });
} else {
  initCatalog();
}

export default initCatalog;
