# Roadmap

## Later

Noted so the earlier work doesn't close them off; not planned yet.

- **Online payments (placeholder): WaafiPay or ZAAD e-Payment.** A customer pays
  an invoice through a hosted payment page (for example from the guest share
  link) and the payment is recorded against the invoice automatically. `Zaad` is
  already a payment method that staff can record by hand. Two routes, and we
  have not picked one:
  - **WaafiPay** takes Zaad, EVC Plus, Sahal and WAAFI wallets. Its docs are
    public but incomplete, and no fees are published. We sent an enquiry and
    have had no reply.
  - **Telesom's ZAAD e-Payment** takes Zaad only. Telesom publishes the cost: a
    one-time $100 application charge and 1% per transaction. It needs a
    physical address in Somaliland and a business licence. No API docs or
    sandbox are public. Start with the call centre on 151 or their WhatsApp.
  - Either way we still need: sandbox access and test wallet numbers, the API
    URLs, the callback and error details, and what they need to onboard us. Ask
    both whether the licence must be a registered company, and whether Telesom
    and WaafiPay are in fact the same route.
  - Decide first how a gateway payment is recorded: created from the callback,
    and only refunded or voided afterwards, never edited by staff.
