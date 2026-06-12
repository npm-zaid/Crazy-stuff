import { useState, useEffect, useRef, useCallback } from "react";

// ── constants ──────────────────────────────────────────────────────────────
const FREE_SHIP = 50;

const PRODUCTS = [
  {
    id: 1,
    name: "The Classic",
    price: 15,
    tag: { label: "NEW", color: "bg-lime-300" },
    img: "https://images.unsplash.com/photo-1643946404043-178456b0e3f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "The Classic mug",
    accent: "#ff4d97",
    description:
      "Caramelization single origin, doppio, extraction macchiato wings bar. Spoon variety to go, coffee instant barista irish crema latte cinnamon.",
    fields: [
      {
        name: "color",
        label: "Color",
        type: "select",
        options: [
          { value: "white", label: "white" },
          { value: "blue", label: "blue" },
          { value: "red", label: "red" },
          { value: "orange", label: "orange (sold out)", disabled: true },
          { value: "black", label: "black" },
        ],
      },
    ],
    wide: false,
  },
  {
    id: 2,
    name: "The Camper",
    price: 18,
    tag: { label: "FREE SHIP", color: "bg-teal-300" },
    img: "https://images.unsplash.com/photo-1481973946307-512988dde8b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "A black camping mug with three pine trees.",
    accent: "#14d6c4",
    description:
      "Macchiato medium saucer body mug cream, medium crema galão extra single shot. Ristretto aromatic, kopi-luwak affogato half and half.",
    fields: [
      {
        name: "design",
        label: "Design",
        type: "select",
        options: [
          { value: "trees", label: "trio of trees" },
          { value: "paw", label: "paw prints" },
          { value: "tent", label: "tent" },
          { value: "campfire", label: "campfire" },
        ],
      },
    ],
    wide: false,
  },
  {
    id: 3,
    name: "The Couple",
    price: 32,
    tag: { label: "COUPLES PICK", color: "bg-pink-400 text-white" },
    img: "https://images.unsplash.com/photo-1618124436088-0d7e0da9df34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "A pair of black ceramic mugs with Mrs. and Mr.",
    accent: "#ffd633",
    description:
      "Sugar macchiato coffee wings sweet iced fair trade saucer. Cortado seasonal mocha, doppio siphon plunger pot blue mountain percolator sweet rich wings. Sold as a matched pair — pick your inscriptions.",
    fields: [
      {
        name: "mug1",
        label: "Mug 1",
        type: "select",
        options: [
          { value: "mr", label: "Mr" },
          { value: "mrs", label: "Mrs" },
        ],
      },
      {
        name: "mug2",
        label: "Mug 2",
        type: "select",
        options: [
          { value: "mr", label: "Mr" },
          { value: "mrs", label: "Mrs" },
        ],
      },
    ],
    wide: true,
  },
  {
    id: 4,
    name: "The Ridge",
    price: 15,
    tag: null,
    img: "https://images.unsplash.com/photo-1711915534479-1528c78e918b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "A cream-colored coffee mug with a ridged texture.",
    accent: "#b4e82a",
    description:
      "Affogato, trifecta organic mocha beans as brewed. Decaffeinated whipped, sit acerbic skinny flavour sweet turkish black filter. Instant cream body.",
    fields: [
      {
        name: "color",
        label: "Color",
        type: "select",
        options: [
          { value: "ivory", label: "ivory" },
          { value: "antique-blue", label: "antique blue" },
          { value: "moss-green", label: "moss green" },
          { value: "purple", label: "purple" },
          { value: "burgundy", label: "burgundy" },
          { value: "dark-gray", label: "dark gray" },
          { value: "black", label: "black" },
        ],
      },
    ],
    wide: false,
  },
  {
    id: 5,
    name: "Dreams",
    price: 20,
    tag: { label: "FREE SHIP", color: "bg-teal-300" },
    img: "https://images.unsplash.com/photo-1615659412252-25aef364d405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "Coffee mug inscribed: dreams are only dreams until you wake up and make them real.",
    accent: "#8b5cf6",
    description:
      "Caffeine organic froth extra dark aroma robust at plunger pot, percolator skinny variety, half and half aromatic, coffee turkish instant to go grinder galão.",
    fields: [],
    wide: false,
  },
  {
    id: 6,
    name: "Van Life",
    price: 21,
    tag: { label: "LIMITED · 150 MADE", color: "bg-orange-400" },
    img: "https://images.unsplash.com/photo-1608662160901-f5a2422fc575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "Van Life mug",
    accent: "#ff7a3d",
    description:
      "Crema, beans irish percolator galão, grinder, spoon macchiato, flavour pumpkin spice caramelization sugar ristretto, filter, cinnamon, blue mountain organic fair trade robust froth iced flavour.",
    fields: [],
    wide: true,
  },
  {
    id: 7,
    name: "The Bold",
    price: 17,
    tag: null,
    img: "https://images.unsplash.com/photo-1521304243632-16b1b1d1cb51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "A white ceramic mug printed with the letter C.",
    accent: "#ff4d97",
    description:
      "Filter, single shot body strong single origin caffeine grounds wings milk. Aroma in cup white barista espresso medium pumpkin spice macchiato.",
    fields: [
      {
        name: "letter",
        label: "Letter",
        type: "text",
        maxLength: 1,
        placeholder: "A",
      },
    ],
    wide: false,
  },
  {
    id: 8,
    name: "The Traveler",
    price: 25,
    tag: null,
    img: "https://images.unsplash.com/photo-1666779484261-1e171bc19dcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    alt: "A person pouring coffee into a copper-colored travel mug.",
    accent: "#14d6c4",
    description:
      "Spoon seasonal cream sit froth cup half and half chicory irish cinnamon shop organic cup body. Mazagran, froth grinder filter aroma caffeine, cup extraction dark.",
    fields: [
      {
        name: "finish",
        label: "Finish",
        type: "select",
        options: [
          { value: "coppertone", label: "coppertone" },
          { value: "silvertone", label: "silvertone" },
          { value: "matte-black", label: "matte black" },
        ],
      },
    ],
    wide: false,
  },
];

// ── tiny helpers ────────────────────────────────────────────────────────────
function CoffeeIcon() {
  return (
    <svg viewBox="0 0 512 512" width="18" aria-hidden="true" className="fill-[#16101f]">
      <path d="M127.1 146.5c1.3 7.7 8 13.5 16 13.5h16.5c9.8 0 17.6-8.5 16.3-18-3.8-28.2-16.4-54.2-36.6-74.7-14.4-14.7-23.6-33.3-26.4-53.5C111.8 5.9 105 0 96.8 0H80.4C70.6 0 63 8.5 64.1 18c3.9 31.9 18 61.3 40.6 84.4 12 12.2 19.7 27.5 22.4 44.1zm112 0c1.3 7.7 8 13.5 16 13.5h16.5c9.8 0 17.6-8.5 16.3-18-3.8-28.2-16.4-54.2-36.6-74.7-14.4-14.7-23.6-33.3-26.4-53.5C223.8 5.9 217 0 208.8 0h-16.4c-9.8 0-17.5 8.5-16.3 18 3.9 31.9 18 61.3 40.6 84.4 12 12.2 19.7 27.5 22.4 44.1zM400 192H32c-17.7 0-32 14.3-32 32v192c0 53 43 96 96 96h192c53 0 96-43 96-96h16c61.8 0 112-50.2 112-112s-50.2-112-112-112zm0 160h-16v-96h16c26.5 0 48 21.5 48 48s-21.5 48-48 48z" />
    </svg>
  );
}

// ── Marquee ─────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
    "★ NEW DROP",
    "GET 'EM WHILE THEY'RE 🔥 HOT",
    "★ FREE SHIP OVER $50",
    "★ SMALL BATCH CERAMICS",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-[#16101f] text-[#ece7ff] border-b-[3px] border-[#16101f] overflow-hidden whitespace-nowrap py-[9px]">
      <div
        className="inline-flex gap-10 font-mono text-[12.5px] tracking-widest"
        style={{ animation: "marqueeScroll 22s linear infinite" }}
      >
        {doubled.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function Header({ cartCount, onCartOpen }) {
  const [bump, setBump] = useState(false);
  const prevCount = useRef(cartCount);
  useEffect(() => {
    if (cartCount !== prevCount.current) {
      setBump(true);
      setTimeout(() => setBump(false), 320);
      prevCount.current = cartCount;
    }
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-5 px-6 py-[14px] bg-[#ece7ff] border-b-[3px] border-[#16101f]">
      <a href="#" className="flex items-center gap-[10px] font-display font-extrabold text-[22px] tracking-tight no-underline text-[#16101f]">
        <span
          className="grid place-items-center w-[38px] h-[38px] bg-[#ffd633] border-[3px] border-[#16101f]"
          style={{ boxShadow: "4px 4px 0 #16101f", transform: "rotate(-4deg)" }}
        >
          <CoffeeIcon />
        </span>
        Mugsy's Mugs
      </a>

      <nav className="hidden sm:flex gap-1.5">
        {["Shop", "Hot List", "About"].map((label, i) => (
          <a
            key={label}
            href="#"
            className={`font-mono text-[13px] px-[14px] py-2 border-2 transition-all ${
              i === 0
                ? "bg-[#8b5cf6] text-white border-[#16101f]"
                : "border-transparent hover:border-[#16101f] hover:bg-white"
            }`}
            style={i === 0 ? { boxShadow: "4px 4px 0 #16101f" } : {}}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        onClick={onCartOpen}
        className="flex items-center gap-2.5 bg-[#ff4d97] text-[#16101f] border-[3px] border-[#16101f] px-4 py-2.5 font-display font-extrabold text-sm tracking-widest transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
        style={{ boxShadow: "4px 4px 0 #16101f" }}
      >
        <span>CART</span>
        <span
          className={`bg-[#16101f] text-white min-w-[24px] h-6 rounded-full grid place-items-center font-mono text-xs transition-transform duration-300 ${
            bump ? "scale-[1.4] rotate-[8deg]" : ""
          }`}
        >
          {cartCount}
        </span>
      </button>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="max-w-[1240px] mx-auto px-6 pt-10 pb-8 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-stretch">
      <div className="relative">
        <div
          className="absolute top-[-6px] right-5 bg-[#b4e82a] border-[3px] border-[#16101f] font-display font-extrabold text-base leading-none text-center px-[14px] py-3 z-10"
          style={{ boxShadow: "4px 4px 0 #16101f", transform: "rotate(8deg)" }}
        >
          NEW<br />DROP
        </div>
        <h1 className="font-display font-extrabold leading-[0.86] tracking-[-0.03em]" style={{ fontSize: "clamp(3.2rem,11vw,8rem)" }}>
          MUGS<br />
          THAT{" "}
          <span className="text-transparent" style={{ WebkitTextStroke: "3px #16101f" }}>
            SLAP.
          </span>
        </h1>
        <p className="mt-5 text-[17px] font-medium max-w-[460px]">
          Eight fresh ceramics, fired this week. Pick your poison, pick your color, get 'em while they're{" "}
          <b className="bg-[#ffd633] px-1">hot</b>. ☕
        </p>
      </div>

      <div
        className="bg-[#8b5cf6] text-white border-[3px] border-[#16101f] p-[18px] flex flex-col"
        style={{ boxShadow: "6px 6px 0 #16101f" }}
      >
        {[["STATUS", "IN STOCK"], ["PRODUCTS", "08"], ["RATING", "4.9 ★"], ["SHIPS IN", "2 DAYS"]].map(([k, v]) => (
          <div key={k} className="flex justify-between items-center font-mono text-xs py-[7px] border-b border-white/25">
            <span>{k}</span><b className="font-medium">{v}</b>
          </div>
        ))}
        <div className="font-display font-extrabold text-[2.6rem] mt-auto pt-4 leading-none">NEW IN</div>
        <div className="text-[13px] opacity-85 mt-1">Get 'em while they're hot!</div>
      </div>
    </section>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [values, setValues] = useState(() => {
    const init = { quantity: "" };
    product.fields.forEach((f) => (init[f.name] = ""));
    return init;
  });
  const [invalid, setInvalid] = useState({});
  const [added, setAdded] = useState(false);
  const imgRef = useRef(null);

  const set = (name, val) =>
    setValues((prev) => ({ ...prev, [name]: val }));

  const handleAdd = () => {
    const errs = {};
    let ok = true;
    product.fields.forEach((f) => {
      if (!values[f.name]?.trim()) { errs[f.name] = true; ok = false; }
    });
    if (!values.quantity) { errs.quantity = true; ok = false; }
    if (!ok) {
      setInvalid(errs);
      setTimeout(() => setInvalid({}), 600);
      onAdd(null, "PICK YOUR OPTIONS! ☝️");
      return;
    }

    const opts = product.fields
      .filter((f) => values[f.name])
      .map((f) => values[f.name]);

    onAdd(
      {
        id: Date.now() + Math.random(),
        name: product.name,
        price: product.price,
        img: product.img,
        opts,
        qty: +values.quantity || 1,
      },
      null,
      imgRef.current
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  const sharedSelect =
    "w-full font-sans text-[13px] font-semibold text-[#16101f] bg-white border-[3px] border-[#16101f] px-[9px] py-2 appearance-none cursor-pointer focus:outline-none transition-all focus:-translate-x-px focus:-translate-y-px";

  return (
    <article
      className={`bg-white border-[3px] border-[#16101f] flex flex-col overflow-hidden transition-all duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] ${
        product.wide ? "col-span-2 md:col-span-2" : ""
      }`}
      style={{
        backgroundColor: product.accent + "22",
        boxShadow: "6px 6px 0 #16101f",
        "--hover-shadow": "9px 9px 0 #16101f",
      }}
    >
      {/* Media */}
      <div
        className={`relative border-b-[3px] border-[#16101f] bg-white overflow-hidden ${
          product.wide ? "aspect-[2/1]" : "aspect-square"
        }`}
      >
        {product.tag && (
          <span
            className={`absolute top-3 left-3 z-10 font-display font-extrabold text-xs tracking-wider px-[10px] py-[6px] border-[3px] border-[#16101f] ${product.tag.color}`}
            style={{ boxShadow: "4px 4px 0 #16101f", transform: "rotate(-4deg)" }}
          >
            {product.tag.label}
          </span>
        )}
        <img
          ref={imgRef}
          src={product.img}
          alt={product.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07] group-hover:-rotate-1"
        />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <div className="flex justify-between items-start gap-2.5">
          <h3 className="font-display font-extrabold text-2xl leading-none tracking-tight">{product.name}</h3>
          <span
            className="font-display font-extrabold text-[1.1rem] bg-[#16101f] text-white px-[10px] py-[5px] whitespace-nowrap"
            style={{ transform: "rotate(3deg)", boxShadow: "4px 4px 0 #16101f" }}
          >
            ${product.price}
          </span>
        </div>

        <p className="text-[13px] font-medium leading-relaxed line-clamp-3">{product.description}</p>

        {/* Options */}
        <div
          className={`mt-auto grid gap-2 ${
            product.fields.length === 2
              ? "grid-cols-[1fr_1fr_56px]"
              : product.fields.length === 0
              ? "grid-cols-[90px]"
              : "grid-cols-[1fr_64px]"
          }`}
        >
          {product.fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="font-mono text-[10px] font-medium uppercase tracking-widest">
                {f.label}
              </label>
              {f.type === "select" ? (
                <div className="relative">
                  <select
                    className={`${sharedSelect} pr-6 ${invalid[f.name] ? "bg-red-100 animate-[shake_0.4s]" : ""}`}
                    value={values[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2316101f' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                      backgroundSize: "10px",
                    }}
                  >
                    <option value="">pick…</option>
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value} disabled={o.disabled}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  maxLength={f.maxLength}
                  placeholder={f.placeholder}
                  className={`${sharedSelect} text-center uppercase ${
                    invalid[f.name] ? "bg-red-100 animate-[shake_0.4s]" : ""
                  }`}
                  value={values[f.name]}
                  onChange={(e) => set(f.name, e.target.value.toUpperCase())}
                />
              )}
            </div>
          ))}

          {/* Qty */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] font-medium uppercase tracking-widest">Qty</label>
            <div className="relative">
              <select
                className={`${sharedSelect} pr-6 ${invalid.quantity ? "bg-red-100 animate-[shake_0.4s]" : ""}`}
                value={values.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2316101f' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  backgroundSize: "10px",
                }}
              >
                <option value="">–</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          className={`w-full border-[3px] border-[#16101f] py-[13px] font-display font-extrabold text-sm tracking-widest transition-all ${
            added
              ? "bg-[#b4e82a] text-[#16101f] pointer-events-none"
              : "bg-[#16101f] text-white hover:bg-white hover:text-[#16101f] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px]"
          }`}
          style={{ boxShadow: "4px 4px 0 #16101f" }}
        >
          {added ? "ADDED ✓" : "ADD TO CART"}
        </button>
      </div>
    </article>
  );
}

// ── Cart Line ────────────────────────────────────────────────────────────────
function CartLine({ line, onRemove }) {
  const opt = line.opts.length ? line.opts.join(" · ").replace(/-/g, " ") : "standard";
  return (
    <div
      className="flex gap-3 p-3 mb-3 bg-white border-[3px] border-[#16101f]"
      style={{ boxShadow: "4px 4px 0 #16101f", animation: "lineIn 0.3s" }}
    >
      <img src={line.img} alt={line.name} className="w-[60px] h-[60px] object-cover border-[3px] border-[#16101f] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-display font-extrabold text-[1.05rem]">{line.name}</div>
        <div className="font-mono text-[11px] opacity-60 capitalize mt-0.5 mb-1.5">{opt} · qty {line.qty}</div>
        <div className="flex justify-between items-center">
          <span className="font-display font-extrabold">${line.price * line.qty}</span>
          <button onClick={onRemove} className="font-mono text-[11px] underline opacity-60 hover:opacity-100 hover:text-[#ff4d97] transition-all bg-transparent border-0 cursor-pointer">
            remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({ cart, isOpen, onClose, onRemove }) {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const pct = Math.min(100, (subtotal / FREE_SHIP) * 100);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#16101f]/50 z-[90] transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[92vw] bg-[#ece7ff] border-l-[3px] border-[#16101f] z-[100] flex flex-col transition-transform duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-[18px] border-b-[3px] border-[#16101f] bg-[#8b5cf6] text-white">
          <h3 className="font-display font-extrabold text-[1.4rem]">
            YOUR CART{" "}
            <span className="font-mono text-[0.9rem] opacity-80">({totalQty})</span>
          </h3>
          <button
            onClick={onClose}
            className="bg-white text-[#16101f] border-[3px] border-[#16101f] w-9 h-9 text-base transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
            style={{ boxShadow: "4px 4px 0 #16101f" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-[3.5rem] mb-3">🫙</div>
              <p className="font-display font-extrabold text-[1.3rem]">NOTHING HERE YET</p>
              <span className="text-[13px] opacity-60">go grab a mug!</span>
            </div>
          ) : (
            cart.map((line) => (
              <CartLine key={line.id} line={line} onRemove={() => onRemove(line.id)} />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t-[3px] border-[#16101f] px-5 py-[18px] bg-white">
            <div className="mb-3.5">
              <div className="h-3 border-[3px] border-[#16101f] bg-[#ece7ff] overflow-hidden mb-1.5">
                <span
                  className="block h-full bg-[#b4e82a] transition-[width_.4s_cubic-bezier(.16,1,.3,1)]"
                  style={{ width: pct + "%" }}
                />
              </div>
              <p className="font-mono text-[11.5px]">
                {subtotal >= FREE_SHIP ? (
                  "🎉 FREE SHIPPING UNLOCKED!"
                ) : (
                  <>Add <b className="text-[#ff4d97]">${FREE_SHIP - subtotal}</b> for FREE shipping</>
                )}
              </p>
            </div>
            <div className="flex justify-between items-center mb-3.5">
              <span className="font-mono text-[13px]">TOTAL</span>
              <b className="font-display font-extrabold text-[1.8rem]">${subtotal}</b>
            </div>
            <button
              className="w-full bg-[#ff4d97] text-[#16101f] border-[3px] border-[#16101f] py-[15px] font-display font-extrabold text-[15px] tracking-widest transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] cursor-pointer"
              style={{ boxShadow: "6px 6px 0 #16101f" }}
            >
              CHECKOUT →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 bg-[#b4e82a] text-[#16101f] border-[3px] border-[#16101f] px-5 py-[13px] font-display font-extrabold text-[15px] z-[110] transition-transform duration-[400ms] ease-[cubic-bezier(.34,1.56,.64,1)]`}
      style={{
        boxShadow: "6px 6px 0 #16101f",
        transform: `translateX(-50%) translateY(${show ? "0" : "150%"}) rotate(-2deg)`,
      }}
    >
      {message}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#16101f] text-[#ece7ff] border-t-[3px] border-[#16101f] px-6 pt-11 pb-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
      <div
        className="font-display font-extrabold leading-[0.85] tracking-tight text-transparent"
        style={{
          fontSize: "clamp(2.5rem,8vw,5rem)",
          WebkitTextStroke: "2px #ece7ff",
        }}
      >
        MUGSY'S<br />MUGS
      </div>
      <div className="flex flex-wrap gap-11">
        {[
          ["SHOP", ["New In", "Hot List", "Gift Cards"]],
          ["HELP", ["Shipping", "Returns", "FAQ"]],
          ["SOCIAL", ["Instagram", "Bluesky", "TikTok"]],
        ].map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-mono text-[11px] tracking-[0.1em] mb-3 text-[#ffd633]">{heading}</h4>
            {links.map((l) => (
              <a key={l} href="#" className="block text-[14px] font-medium mb-2 opacity-85 hover:opacity-100 hover:translate-x-[3px] transition-all">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="col-span-full font-mono text-[12px] opacity-50 border-t border-white/20 pt-[18px]">
        © 2026 · brewed with chaos &amp; caffeine · 100% <b>Chathura</b> roasted ☕
      </div>
    </footer>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function spawnConfetti(x, y) {
  const colors = ["#ff4d97", "#14d6c4", "#ffd633", "#b4e82a", "#8b5cf6", "#ff7a3d"];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;z-index:199;border:2px solid #16101f;pointer-events:none;width:${8 + Math.random() * 8}px;height:${8 + Math.random() * 8}px;background:${colors[i % colors.length]};left:${x}px;top:${y}px;${Math.random() > 0.5 ? "border-radius:50%" : ""}`;
    document.body.appendChild(el);
    const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const dist = 70 + Math.random() * 70;
    el.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist - 30}px) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.16,1,.3,1)" }
    );
    setTimeout(() => el.remove(), 1100);
  }
}

function flyToCart(imgEl, targetEl) {
  if (!imgEl || !targetEl) return;
  const r = imgEl.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  const clone = imgEl.cloneNode();
  Object.assign(clone.style, {
    position: "fixed", zIndex: 200, border: "3px solid #16101f",
    objectFit: "cover", pointerEvents: "none",
    left: r.left + "px", top: r.top + "px",
    width: r.width + "px", height: r.height + "px",
    transition: "all .7s cubic-bezier(.5,-.2,.7,1)",
  });
  document.body.appendChild(clone);
  void clone.offsetWidth;
  Object.assign(clone.style, {
    left: t.left + t.width / 2 - 22 + "px",
    top: t.top + t.height / 2 - 22 + "px",
    width: "44px", height: "44px", opacity: "0.3", transform: "rotate(220deg)",
  });
  setTimeout(() => clone.remove(), 720);
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function MugsyMugs2() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "Added!" });
  const toastTimer = useRef(null);
  const cartBtnRef = useRef(null);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);

  const handleAdd = useCallback((item, errMsg, imgEl) => {
    if (!item) { showToast(errMsg); return; }
    setCart((prev) => [...prev, item]);
    flyToCart(imgEl, cartBtnRef.current);
    if (imgEl) {
      const r = imgEl.getBoundingClientRect();
      spawnConfetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    showToast(`${item.name.toUpperCase()} ADDED!`);
  }, [showToast]);

  const handleRemove = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }
        .font-sans    { font-family: 'Space Grotesk', system-ui, sans-serif; }
        body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        @keyframes marqueeScroll { to { transform: translateX(-50%); } }
        @keyframes lineIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
      `}</style>

      <div
        className="min-h-screen text-[#16101f] font-sans text-[15px] leading-relaxed"
        style={{
          background: "#ece7ff",
          backgroundImage: "radial-gradient(#16101f 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
          backgroundPosition: "-13px -13px",
        }}
      >
        <Marquee />
        <Header cartCount={totalQty} onCartOpen={() => setDrawerOpen(true)} cartBtnRef={cartBtnRef} />
        <Hero />

        <main className="max-w-[1240px] mx-auto px-6 pb-16 grid grid-cols-2 md:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </main>

        <Footer />

        {/* invisible anchor for fly animation */}
        <div ref={cartBtnRef} className="fixed top-[56px] right-6 w-1 h-1 pointer-events-none" />

        <CartDrawer
          cart={cart}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onRemove={handleRemove}
        />
        <Toast message={toast.msg} show={toast.show} />
      </div>
    </>
  );
}