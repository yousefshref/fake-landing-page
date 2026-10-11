import { useState, useEffect } from "react";

// ---- Edit these ----
const PRODUCT = {
  title: "Classic Leather Wallet",
  description:
    "Handmade from full-grain leather. Slim, durable and made to last for years. Fits 8 cards and cash.",
  price: "EGP 450",
  image:
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
};
const WEBHOOK_URL = "https://n8n.youssef.im/webhook/96bbedd4-de42-4210-a178-ead283b7b0cf";
// --------------------

const EMPTY = { name: "", phone: "", government: "", address: "" };

export default function App() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const close = () => {
    setOpen(false);
    if (status === "done") {
      setForm(EMPTY);
      setStatus("idle");
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!WEBHOOK_URL) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product: PRODUCT.title,
          price: PRODUCT.price,
        }),
      });
      if (!res.ok) throw new Error("Bad response");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="page">
      <img className="hero" src={PRODUCT.image} alt={PRODUCT.title} />
      <section className="info">
        <h1>{PRODUCT.title}</h1>
        <p className="price">{PRODUCT.price}</p>
        <p className="desc">{PRODUCT.description}</p>
      </section>

      <div className="bar">
        <button className="btn" onClick={() => setOpen(true)}>
          Buy now
        </button>
      </div>

      {open && (
        <div className="overlay" onClick={close}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={close} aria-label="Close">
              ×
            </button>

            {status === "done" ? (
              <div className="done">
                <h2>Thank you!</h2>
                <p>We received your order and will contact you soon.</p>
                <button className="btn" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2>Your details</h2>
                <label>
                  Name
                  <input
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                  />
                </label>
                <label>
                  Phone
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </label>
                <label>
                  Government
                  <input
                    required
                    autoComplete="address-level1"
                    value={form.government}
                    onChange={set("government")}
                  />
                </label>
                <label>
                  Address
                  <textarea
                    required
                    rows="3"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={set("address")}
                  />
                </label>

                {status === "error" && (
                  <p className="err">
                    {WEBHOOK_URL
                      ? "Something went wrong. Please try again."
                      : "Webhook URL is not set (VITE_WEBHOOK_URL)."}
                  </p>
                )}

                <button className="btn" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Confirm order"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
