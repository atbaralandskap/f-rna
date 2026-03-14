import {
  clearCart,
  formatSek,
  getCart,
  setCartItemQty,
  subscribeCart,
} from "../assets/js/store.js";

function createQtyButton({ id, action, label, text }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "qty-btn";
  button.dataset.id = id;
  button.dataset.action = action;
  button.setAttribute("aria-label", label);
  button.textContent = text;
  return button;
}

function createCartItem(item) {
  const li = document.createElement("li");
  li.className = "cart-item";

  const details = document.createElement("div");
  details.className = "cart-item-details";

  const title = document.createElement("p");
  title.className = "cart-item-title";
  title.textContent = item.size ? `${item.name} (${item.size})` : item.name;

  const price = document.createElement("p");
  price.className = "cart-item-price";
  price.textContent = `${formatSek(item.priceSek)} per enhet`;

  details.append(title, price);

  const controls = document.createElement("div");
  controls.className = "cart-item-controls";
  controls.append(
    createQtyButton({
      id: item.id,
      action: "minus",
      label: `Minska antal ${item.name}`,
      text: "-",
    })
  );

  const qty = document.createElement("output");
  qty.className = "qty-value";
  qty.setAttribute("aria-live", "polite");
  qty.textContent = String(item.qty);
  controls.append(qty);

  controls.append(
    createQtyButton({
      id: item.id,
      action: "plus",
      label: `Öka antal ${item.name}`,
      text: "+",
    })
  );

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "cart-remove";
  removeBtn.dataset.id = item.id;
  removeBtn.dataset.action = "remove";
  removeBtn.textContent = "Ta bort";
  controls.append(removeBtn);

  const lineTotal = document.createElement("p");
  lineTotal.className = "cart-item-total";
  lineTotal.textContent = `Radtotal: ${formatSek(item.qty * item.priceSek)}`;

  li.append(details, controls, lineTotal);
  return li;
}

function renderOverview(summary, overviewEl) {
  if (!overviewEl) return;

  if (summary.itemCount <= 0) {
    overviewEl.hidden = true;
    overviewEl.replaceChildren();
    return;
  }

  overviewEl.hidden = false;
  overviewEl.innerHTML = [
    `<span class="cart-pill">${summary.itemCount} st totalt</span>`,
    `<span class="cart-pill">${summary.distinctCount} olika produkter</span>`,
  ].join("");
}

function renderCart({
  cart,
  summary,
  cartItemsEl,
  cartEmptyEl,
  cartTotalEl,
  cartOverviewEl,
  buyBtn,
  clearBtn,
}) {
  if (!cartItemsEl || !cartEmptyEl || !cartTotalEl) return;

  cartItemsEl.replaceChildren(...cart.map(createCartItem));
  renderOverview(summary, cartOverviewEl);

  const empty = cart.length === 0;
  cartEmptyEl.hidden = !empty;
  cartTotalEl.textContent = `Totalt: ${formatSek(summary.totalSek)}`;

  if (buyBtn) buyBtn.disabled = empty;
  if (clearBtn) clearBtn.disabled = empty;
}

function handleCartAction(action, id) {
  const item = getCart().find((entry) => entry.id === id);
  if (!item) return;

  if (action === "plus") {
    setCartItemQty(item, item.qty + 1);
    return;
  }

  if (action === "minus") {
    setCartItemQty(item, item.qty - 1);
    return;
  }

  if (action === "remove") {
    setCartItemQty(item, 0);
  }
}

export function initCartPage() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const cartTotalEl = document.getElementById("cart-total");
  const cartOverviewEl = document.getElementById("cart-overview");
  const buyBtn = document.getElementById("checkout-submit");
  const clearBtn = document.getElementById("cart-clear");

  if (!cartItemsEl || !cartEmptyEl || !cartTotalEl) return;

  cartItemsEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action][data-id]");
    if (!button) return;
    handleCartAction(button.dataset.action, button.dataset.id);
  });

  clearBtn?.addEventListener("click", () => {
    clearCart();
  });

  subscribeCart((cart, summary) => {
    renderCart({
      cart,
      summary,
      cartItemsEl,
      cartEmptyEl,
      cartTotalEl,
      cartOverviewEl,
      buyBtn,
      clearBtn,
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCartPage, { once: true });
} else {
  initCartPage();
}
