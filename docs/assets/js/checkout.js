import { clearCart, formatSek, getCart, getCartSummary } from "./store.js";

export const ORDER_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const PICKUP_LOCATION = "Bästekille i växthuset";
const PICKUP_NOTE =
  "Fabian hör av sig och återkommer med datum då varorna kan hämtas upp i Bästekille i växthuset.";

// Configure with your EmailJS public keys/template IDs.
// Both templates should support these params:
// to_email, order_id, customer_name, customer_email, customer_phone,
// customer_note, order_lines, order_total, pickup_location, pickup_note, seller_name
const EMAILJS_CONFIG = {
  publicKey: "REPLACE_WITH_EMAILJS_PUBLIC_KEY",
  serviceId: "REPLACE_WITH_EMAILJS_SERVICE_ID",
  sellerTemplateId: "REPLACE_WITH_EMAILJS_SELLER_TEMPLATE_ID",
  buyerTemplateId: "REPLACE_WITH_EMAILJS_BUYER_TEMPLATE_ID",
  sellerName: "Fabian",
  sellerEmail: "REPLACE_WITH_FABIAN_EMAIL",
};

function isEmailConfigured() {
  return (
    !Object.values(EMAILJS_CONFIG).some((value) =>
      String(value).startsWith("REPLACE_WITH_")
    ) && EMAILJS_CONFIG.sellerEmail.includes("@")
  );
}

function makeOrderId() {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `FORNA-${timestamp}-${suffix}`;
}

function toLinesText(cart) {
  return cart
    .map(
      (item) =>
        `${item.name} (${item.size || "-"}) x ${item.qty} = ${formatSek(
          item.qty * item.priceSek
        )}`
    )
    .join("\n");
}

function buildOrderPayload(formData) {
  const cart = getCart();
  const summary = getCartSummary(cart);

  return {
    id: makeOrderId(),
    createdAtIso: new Date().toISOString(),
    customer: {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      note: String(formData.get("note") || "").trim(),
    },
    cart,
    summary,
    linesText: toLinesText(cart),
  };
}

async function sendEmail(templateId, templateParams) {
  const response = await fetch(ORDER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicKey: EMAILJS_CONFIG.publicKey,
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mejltjänsten svarade ${response.status}: ${body}`);
  }
}

export async function submitOrder(payload) {
  if (!isEmailConfigured()) {
    throw new Error(
      "Mejl är inte konfigurerat ännu. Fyll i EmailJS-uppgifter i assets/js/checkout.js."
    );
  }

  const baseParams = {
    order_id: payload.id,
    order_created_at: payload.createdAtIso,
    customer_name: payload.customer.name,
    customer_email: payload.customer.email,
    customer_phone: payload.customer.phone || "Ej angivet",
    customer_note: payload.customer.note || "Ingen kommentar",
    order_lines: payload.linesText,
    order_total: formatSek(payload.summary.totalSek),
    pickup_location: PICKUP_LOCATION,
    pickup_note: PICKUP_NOTE,
    seller_name: EMAILJS_CONFIG.sellerName,
  };

  await sendEmail(EMAILJS_CONFIG.sellerTemplateId, {
    ...baseParams,
    to_email: EMAILJS_CONFIG.sellerEmail,
  });

  await sendEmail(EMAILJS_CONFIG.buyerTemplateId, {
    ...baseParams,
    to_email: payload.customer.email,
  });
}

function setFormMessage(node, type, text) {
  if (!node) return;
  node.textContent = text;
  node.dataset.state = type;
}

export function initCheckout() {
  const form = document.getElementById("checkout-form");
  const message = document.getElementById("checkout-message");
  const submitButton = document.getElementById("checkout-submit");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setFormMessage(message, "error", "Kontrollera att alla obligatoriska fält är korrekt ifyllda.");
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      setFormMessage(message, "error", "Varukorgen är tom. Lägg till produkter först.");
      return;
    }

    const formData = new FormData(form);
    const payload = buildOrderPayload(formData);

    if (submitButton) submitButton.disabled = true;
    setFormMessage(message, "loading", "Skickar beställning...");

    try {
      await submitOrder(payload);
      clearCart();
      form.reset();
      setFormMessage(
        message,
        "success",
        `Beställning ${payload.id} skickad. ${PICKUP_NOTE}`
      );
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Okänt fel vid beställning.";
      setFormMessage(message, "error", messageText);
    } finally {
      if (submitButton) {
        submitButton.disabled = getCart().length === 0;
      }
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCheckout, { once: true });
} else {
  initCheckout();
}
