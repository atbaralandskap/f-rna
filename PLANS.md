# PLANS

## Goal
Build a tree-ordering flow with a shopping cart and email-based checkout, where customers pay on pickup.

## Scope
- Website remains static (Quarto + GitHub Pages)
- No online payment gateway
- Orders are sent by email and confirmed manually

## Implementation Plan

1. Define product data model
- Create `data/products.json` as single source of truth
- Fields: `id`, `name`, `size`, `price_sek`, `stock`, `image`

2. Add cart actions on products page
- Update `produkter.qmd` with "Add to cart" buttons
- Use JavaScript with `localStorage` to persist cart
- Show cart item count in page header/nav

3. Build checkout page
- Implement `kassa.qmd` as full cart/checkout UI
- Support quantity updates and item removal
- Calculate subtotal and total in SEK

4. Add customer order form
- Required fields: name, phone, email
- Optional fields: preferred pickup date/time, note
- Show clear text: "Payment is made on pickup"

5. Connect email order delivery
- Integrate a form backend (e.g. Formspree/Getform/Web3Forms)
- Send structured order details by email:
  - order id
  - customer info
  - line items
  - total amount
  - pickup preference

6. Add validation and anti-spam
- Client-side validation for required fields and format
- Add honeypot field and submission throttling where possible

7. Add confirmation state
- After submit: show success confirmation with next steps
- Clear cart only after successful submission

8. Update contact page copy
- Update `kontakt.qmd` to reflect pickup + on-site payment flow
- Keep phone/manual ordering option as fallback

9. QA and publish
- Test full flow on desktop and mobile
- Test edge cases: empty cart, invalid email, network failure
- Render site and push to GitHub Pages

## Acceptance Criteria
- Customer can add/remove/update tree items in cart
- Checkout sends a complete order email to site owner
- Payment is explicitly "on pickup" in UI and email
- Cart persists between page reloads
- Flow works on both desktop and mobile

## Nice-to-Have (After MVP)
- Inventory-aware UX ("low stock" / "sold out")
- Lightweight order number generation with timestamp
- Swedish copy polish and UTF-8 cleanup across pages
- Admin-friendly CSV copy of each order in email body
