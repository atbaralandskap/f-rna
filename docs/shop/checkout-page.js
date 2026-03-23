import { clearCart, formatSek, getCart, getCartSummary } from "../assets/js/store.js";

const ORDER_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const CUSTOMER_KEY = "forna_checkout_customer_v1";

function getConfig() {
  const config = window.FORNA_EMAIL_CONFIG ?? {};
  const emailjs = config.emailjs ?? {};

  return {
    sellerName: config.sellerName ?? "Fabian",
    sellerEmail: config.sellerEmail ?? "",
    internalCopyEmail: config.internalCopyEmail ?? "",
    pickupLocation: config.pickupLocation ?? "Bästekille i växthuset",
    pickupNote:
      config.pickupNote ??
      "Fabian hör av sig och återkommer med datum då varorna kan hämtas upp i Bästekille i växthuset.",
    mode: config.mode ?? "emailjs",
    emailjs: {
      publicKey: emailjs.publicKey ?? "",
      serviceId: emailjs.serviceId ?? "",
      sellerTemplateId: emailjs.sellerTemplateId ?? "",
      buyerTemplateId: emailjs.buyerTemplateId ?? "",
    },
  };
}

function isPlaceholder(value) {
  return String(value || "").startsWith("REPLACE_WITH_");
}

function getCheckoutMode(config) {
  const hasSellerEmail =
    config.sellerEmail.includes("@") && !isPlaceholder(config.sellerEmail);
  const hasEmailJs =
    !isPlaceholder(config.emailjs.publicKey) &&
    !isPlaceholder(config.emailjs.serviceId) &&
    !isPlaceholder(config.emailjs.sellerTemplateId) &&
    !isPlaceholder(config.emailjs.buyerTemplateId);

  if (config.mode === "emailjs" && hasSellerEmail && hasEmailJs) {
    return "emailjs";
  }

  if (hasSellerEmail) {
    return "mailto";
  }

  return "unconfigured";
}

function makeOrderId() {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `FORNA-${timestamp}-${suffix}`;
}

function formatOrderDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
function toLinesText(cart) {
  return cart
    .map(
      (item) =>
        `- ${item.name} (${item.size || "-"}) x ${item.qty} = ${formatSek(
          item.qty * item.priceSek
        )}`
    )
    .join("\n");
}
function toPricingText(summary) {
  const lines = [`- Delsumma: ${formatSek(summary.subtotalSek)}`];

  if (summary.discountSek > 0) {
    lines.push(
      `- Mängdrabatt (${summary.discountPercent} % vid ${summary.discountMinimumQty}+ varor): -${formatSek(summary.discountSek)}`
    );
  }

  lines.push(`- Totalt att betala vid upphämtning: ${formatSek(summary.totalSek)}`);
  return lines.join("\n");
}
function buildOrderPayload(formData) {
  const cart = getCart();
  const summary = getCartSummary(cart);

  const createdAtIso = new Date().toISOString();

  return {
    id: makeOrderId(),
    createdAtIso,
    createdAtText: formatOrderDateTime(createdAtIso),
    customer: {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      note: String(formData.get("note") || "").trim(),
    },
    cart,
    summary,
    linesText: toLinesText(cart),
    pricingText: toPricingText(summary),
  };
}

function setFormMessage(node, type, text) {
  if (!node) return;
  node.textContent = text;
  node.dataset.state = type;
}

function setConfigMessage(node, type, text) {
  if (!node) return;
  node.textContent = text;
  node.dataset.state = type;
}

function loadSavedCustomer(form) {
  if (!form) return;

  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);

    for (const name of ["name", "email", "phone", "note"]) {
      const field = form.elements.namedItem(name);
      if (!field || typeof saved[name] !== "string") continue;
      if ("value" in field && !field.value) {
        field.value = saved[name];
      }
    }
  } catch {
    // Ignore malformed saved state.
  }
}

function saveCustomer(formData) {
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    note: String(formData.get("note") || "").trim(),
  };

  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(payload));
}

async function sendEmail(config, templateId, templateParams) {
  const response = await fetch(ORDER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicKey: config.emailjs.publicKey,
      service_id: config.emailjs.serviceId,
      template_id: templateId,
      user_id: config.emailjs.publicKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mejltjänsten svarade ${response.status}: ${body}`);
  }
}

async function submitViaEmailJs(config, payload) {
  const baseParams = {
    order_id: payload.id,
    order_created_at: payload.createdAtIso,
    order_created_at_display: payload.createdAtText,
    customer_name: payload.customer.name,
    customer_email: payload.customer.email,
    customer_phone: payload.customer.phone || "Ej angivet",
    customer_note: payload.customer.note || "Ingen kommentar",
    order_lines: payload.linesText,
    order_subtotal: formatSek(payload.summary.subtotalSek),
    order_discount: formatSek(payload.summary.discountSek),
    order_discount_rate:
      payload.summary.discountSek > 0 ? `${payload.summary.discountPercent} %` : "0 %",
    order_pricing: payload.pricingText,
    order_total: formatSek(payload.summary.totalSek),
    pickup_location: config.pickupLocation,
    pickup_note: config.pickupNote,
    seller_name: config.sellerName,
  };

  await sendEmail(config, config.emailjs.sellerTemplateId, {
    ...baseParams,
    to_email: config.sellerEmail,
  });

  await sendEmail(config, config.emailjs.buyerTemplateId, {
    ...baseParams,
    to_email: payload.customer.email,
  });
}

function submitViaMailto(config, payload) {
  const subject = `Beställning ${payload.id} från ${payload.customer.name}`;
  const body = [
    "Hej Fabian,",
    "",
    "Tack för att du tar emot min beställning från Förna.",
    "Här kommer allt samlat så att det blir lätt att läsa och svara på.",
    "",
    "Beställning",
    `- Beställningsnummer: ${payload.id}`,
    `- Skapad: ${payload.createdAtText}`,
    "",
    "Mina uppgifter",
    `- Namn: ${payload.customer.name}`,
    `- E-post: ${payload.customer.email}`,
    `- Telefon: ${payload.customer.phone || "Ej angivet"}`,
    `- Meddelande: ${payload.customer.note || "Ingen kommentar"}`,
    "",
    "Jag vill beställa",
    payload.linesText,
    "",
    "Prissammanställning",
    payload.pricingText,
    "",
    "Upphämtning",
    config.pickupNote,
    "",
    "Tack för allt arbete ni gör på Förna.",
    "Jag ser fram emot att höra från dig när det är dags att hämta upp beställningen.",
    "",
    "Varma hälsningar,",
    payload.customer.name,
  ].join("\n");

  const params = new URLSearchParams({ subject, body });
  if (config.internalCopyEmail.includes("@")) {
    params.set("bcc", config.internalCopyEmail);
  }

  window.location.href = `mailto:${config.sellerEmail}?${params.toString()}`;
}

function renderConfigStatus(config, mode, statusEl, introEl, submitButton) {
  if (mode === "emailjs") {
    setConfigMessage(
      statusEl,
      "ready",
      `Mejl är aktivt. Beställningen skickas till ${config.sellerName} och en kopia går till kunden.`
    );
    if (introEl) {
      introEl.textContent =
        "Fyll i dina uppgifter så skickas din beställning direkt vidare. Om något är oklart kontaktar Fabian dig före upphämtning.";
    }
    if (submitButton) submitButton.textContent = "Skicka beställning";
    return;
  }

  if (mode === "mailto") {
    setConfigMessage(
      statusEl,
      "fallback",
      `Direktmejl är inte klart ännu. När du skickar öppnas din mejlklient med beställningen färdigifylld till ${config.sellerEmail}.`
    );
    if (introEl) {
      introEl.textContent =
        "Fyll i dina uppgifter så förbereds ett varmt och tydligt mejl med din beställning i din egen mejlklient. Mejlet du skickar fungerar som din orderkopia tills Fabian återkopplar.";
    }
    if (submitButton) submitButton.textContent = "Öppna mejl med beställning";
    return;
  }

  setConfigMessage(
    statusEl,
    "error",
    "Checkouten är inte färdigkonfigurerad ännu. Fyll i uppgifterna i shop/email-config.js."
  );
  if (submitButton) submitButton.textContent = "Konfigurera mejl först";
}

export function initCheckoutPage() {
  const config = getConfig();
  const mode = getCheckoutMode(config);

  const form = document.getElementById("checkout-form");
  const message = document.getElementById("checkout-message");
  const configStatus = document.getElementById("checkout-config-status");
  const intro = document.getElementById("checkout-intro");
  const submitButton = document.getElementById("checkout-submit");

  if (!form) return;

  loadSavedCustomer(form);
  renderConfigStatus(config, mode, configStatus, intro, submitButton);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setFormMessage(
        message,
        "error",
        "Kontrollera att alla obligatoriska fält är korrekt ifyllda."
      );
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      setFormMessage(message, "error", "Varukorgen är tom. Lägg till produkter först.");
      return;
    }

    if (mode === "unconfigured") {
      setFormMessage(
        message,
        "error",
        "Mejl saknar konfiguration. Fyll i shop/email-config.js först."
      );
      return;
    }

    const formData = new FormData(form);
    saveCustomer(formData);
    const payload = buildOrderPayload(formData);

    if (submitButton) submitButton.disabled = true;
    setFormMessage(
      message,
      "loading",
      mode === "emailjs" ? "Skickar beställning..." : "Öppnar mejlklient..."
    );

    try {
      if (mode === "emailjs") {
        await submitViaEmailJs(config, payload);
        clearCart();
        setFormMessage(
          message,
          "success",
          `Beställning ${payload.id} skickad. ${config.pickupNote}`
        );
      } else {
        submitViaMailto(config, payload);
        setFormMessage(
          message,
          "success",
          `Tack för beställningen. Mejlutkast för ${payload.id} öppnat. Läs gärna igenom det, skicka det när det känns bra, och använd sedan ditt skickade mejl som orderkopia tills Fabian svarar.`
        );
      }
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
  document.addEventListener("DOMContentLoaded", initCheckoutPage, { once: true });
} else {
  initCheckoutPage();
}

