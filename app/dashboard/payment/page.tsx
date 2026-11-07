"use client";
import { useState } from "react";
import Link from "next/link";

const plans = [
  { id: "basic", name: "Basic", price: 0, tag: "For Starters", desc: "Try karala balanna", features: ["1 Property Listing", "30 Days Live", "Standard Support", "Basic Analytics"], icon: "🌱", style: "bg-white border", btn: "bg-zinc-100 text-black" },
  { id: "boost", name: "Boost", price: 2500, tag: "MOST POPULAR", desc: "Sell 10x Faster", features: ["Everything in Basic", "Top of Search Results", "Featured Badge ⭐", "60 Days Live", "Priority Views"], icon: "🚀", style: "bg-zinc-900 text-white border-zinc-900 scale-[1.03] shadow-2xl shadow-zinc-900/20", btn: "bg-orange-500 text-white" },
  { id: "premium", name: "Premium", price: 5000, tag: "FOR AGENTS", desc: "Full Business Pack", features: ["Unlimited Properties", "Everything in Boost", "Social Media Promo", "Dedicated Manager"], icon: "👑", style: "bg-white border", btn: "bg-black text-white" },
];

export default function Payment() {
  const [selected, setSelected] = useState(plans[1]);
  const [payMethod, setPayMethod] = useState("card");
  const [card, setCard] = useState({ num: "", name: "", exp: "", cvv: "" });

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[240px] bg-white border-r flex-col sticky top-0 h-screen p-6 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center font-black">P</span>
          <span className="font-black text-xl">Property<span className="text-orange-500">LK</span></span>
        </Link>
        <nav className="mt-8 space-y-1 text-sm font-medium">
          <Link href="/dashboard" className="flex gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:bg-zinc-50">🏠 Dashboard</Link>
          <Link href="/dashboard/payment" className="flex gap-3 px-3 py-2.5 rounded-xl bg-black text-white">💳 Payments <span className="ml-auto bg-orange-500 text-[10px] px-2 py-0.5 rounded-full">NEW</span></Link>
          <Link href="/dashboard/new" className="flex gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:bg-zinc-50">➕ Add Property</Link>
          <Link href="/" className="flex gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:bg-zinc-50">🌍 Browse</Link>
          <Link href="/" className="flex gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:bg-zinc-50">⚙️ Settings</Link>
        </nav>
        <div className="mt-auto bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-4 rounded-2xl">
          <p className="font-bold text-sm">💎 Pro Tip</p>
          <p className="text-white/80 text-xs mt-1 leading-relaxed">Boosted listings sell 3x faster in Colombo area.</p>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        {/* TOP NAV */}
        <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-10">
          <div className="max-w-[1000px] mx-auto px-5 h-[64px] flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm"><Link href="/dashboard" className="text-zinc-500 hover:text-black">Dashboard</Link><span className="text-zinc-300">/</span><span className="font-bold">Checkout</span></div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-bold bg-green-50 text-green-600 px-3 py-1.5 rounded-full">● Secure Checkout</span>
              <span className="w-9 h-9 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-sm">A</span>
            </div>
          </div>
        </div>

        <main className="max-w-[1000px] mx-auto p-5 md:p-8">
          {/* STEPS */}
          <div className="flex items-center gap-2 md:gap-3 text-[12px] md:text-sm font-bold">
            <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0">1</span><span>Choose Plan</span>
            <span className="flex-1 h-[2px] bg-zinc-200"></span>
            <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0">2</span><span>Payment</span>
            <span className="flex-1 h-[2px] bg-zinc-200"></span>
            <span className="bg-zinc-200 w-7 h-7 rounded-full flex items-center justify-center shrink-0">3</span><span className="text-zinc-400">Done ✓</span>
          </div>

          <h1 className="text-[30px] md:text-[36px] font-black tracking-tight mt-6 leading-none">Upgrade & Sell Faster.</h1>
          <p className="text-zinc-500 mt-2">Pick a plan that fits you. Cancel anytime.</p>

          {/* PLANS */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {plans.map(p => (
              <div key={p.id} onClick={() => setSelected(p)} className={`${p.style} rounded-[24px] p-6 cursor-pointer transition hover:-translate-y-1 relative`}>
                {p.id === "boost" && <span className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider">✨ MOST POPULAR</span>}
                <div className="flex justify-between"><span className="text-3xl">{p.icon}</span><span className="text-[10px] font-black bg-white/20 border px-2 py-1 rounded-full h-fit">{p.tag}</span></div>
                <h3 className="font-black text-xl mt-3">{p.name}</h3>
                <p className="text-sm opacity-70">{p.desc}</p>
                <p className="text-[32px] font-black mt-2">Rs. {p.price.toLocaleString()} <span className="text-sm font-normal opacity-60">/ once</span></p>
                <ul className="space-y-2.5 mt-4 text-[13px]">{p.features.map(f => <li key={f} className="flex gap-2"><span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span>{f}</li>)}</ul>
                <div className={`text-center py-3 rounded-full text-sm font-bold mt-5 ${p.btn}`}>{selected.id === p.id ? "✓ Selected" : "Choose This Plan"}</div>
              </div>
            ))}
          </div>

          {/* PAYMENT + SUMMARY */}
          <div className="grid md:grid-cols-[1fr_340px] gap-4 mt-6 items-start">
            {/* CARD */}
            <div className="bg-white rounded-[24px] border p-6">
              <h3 className="font-black text-lg">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { id: "card", label: "💳 Card", sub: "Visa / Master" },
                  { id: "koko", label: "🛍️ Koko", sub: "Pay in 3" },
                  { id: "bank", label: "🏦 Bank", sub: "Transfer" },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)} className={`border rounded-2xl p-3 text-left transition ${payMethod === m.id ? "border-black ring-2 ring-black/10 bg-zinc-50" : "hover:border-zinc-300"}`}>
                    <p className="font-bold text-sm">{m.label}</p><p className="text-[11px] text-zinc-500">{m.sub}</p>
                  </button>
                ))}
              </div>

              {payMethod === "card" && (
                <div className="mt-5 space-y-3">
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-700 text-white rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-2xl">💳</div>
                    <p className="text-[11px] tracking-widest text-zinc-400">CARD NUMBER</p>
                    <p className="font-mono text-lg tracking-widest mt-1">{card.num || "•••• •••• •••• ••••"}</p>
                    <div className="flex justify-between mt-4 text-sm"><span>{card.name || "YOUR NAME"}</span><span>{card.exp || "MM/YY"}</span></div>
                  </div>
                  <input value={card.num} onChange={e => setCard({...card, num: e.target.value})} placeholder="Card Number  4242 4242 4242 4242" className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black/10" />
                  <input value={card.name} onChange={e => setCard({...card, name: e.target.value})} placeholder="Name on Card" className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black/10" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={card.exp} onChange={e => setCard({...card, exp: e.target.value})} placeholder="MM / YY" className="border rounded-xl px-4 py-3 text-sm outline-none" />
                    <input value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} placeholder="CVV" className="border rounded-xl px-4 py-3 text-sm outline-none" />
                  </div>
                </div>
              )}
              {payMethod === "koko" && <div className="mt-5 bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm">🛍️ <b>Koko</b> - Rs. {Math.round(selected.price/3).toLocaleString()} x 3 months. Interest free! Just click Pay Now.</div>}
              {payMethod === "bank" && <div className="mt-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm">🏦 <b>Bank Transfer</b><br/>Acc: 1234567890 • Sampath Bank • PropertyLK (Pvt) Ltd<br/>Receipt eka WhatsApp karanna.</div>}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-[24px] border p-6 sticky top-[84px]">
              <h3 className="font-black">Order Summary</h3>
              <div className="flex gap-3 items-center mt-4 pb-4 border-b">
                <span className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center text-xl">{selected.icon}</span>
                <div><p className="font-bold text-sm">{selected.name} Plan</p><p className="text-xs text-zinc-500">{selected.desc}</p></div>
                <b className="ml-auto">Rs. {selected.price.toLocaleString()}</b>
              </div>
              <div className="space-y-2 text-sm mt-4 text-zinc-600"><div className="flex justify-between"><span>Subtotal</span><span>Rs. {selected.price.toLocaleString()}</span></div><div className="flex justify-between"><span>Service Fee</span><span className="text-green-600 font-bold">FREE</span></div><div className="flex justify-between"><span>Discount</span><span>- Rs. 0</span></div></div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t"><span className="font-bold">Total</span><span className="text-[22px] font-black">Rs. {selected.price.toLocaleString()}</span></div>
              <button onClick={() => alert(`Demo Payment: ${selected.name} - Rs. ${selected.price}\n\nPayHere connect kalama meken real payment yanne!`)} className="w-full bg-black text-white py-3.5 rounded-full font-bold mt-4 hover:scale-[1.01] transition shadow-lg">Pay Rs. {selected.price.toLocaleString()} →</button>
              <p className="text-center text-[11px] text-zinc-400 mt-3">🔒 256-bit SSL Secured • PayHere • Visa / Master / Koko</p>
              <div className="flex justify-center gap-2 mt-3 text-xl"><span>💳</span><span>🛍️</span><span>🏦</span></div>
            </div>
          </div>
          <p className="text-center text-zinc-400 text-xs mt-8">© 2026 PropertyLK • Secure Payments in Sri Lanka 🇱🇰</p>
        </main>
      </div>
    </div>
  );
}