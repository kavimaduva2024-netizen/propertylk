"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SAMPLES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
];

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", location: "", type: "Villa", beds: "3", baths: "2", area: "", description: "", image_url: SAMPLES[0], phone: "" });
  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  // Progress
  const filled = [form.title, form.price, form.location, form.description, form.image_url].filter(Boolean).length;
  const progress = Math.round((filled / 5) * 100);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) { alert("Title, Price, Location tika danna!"); return; }
    setLoading(true);
    const { error } = await supabase.from("properties").insert([{ title: form.title, price: Number(form.price), location: form.location, type: form.type, description: form.description, image_url: form.image_url, status: "active" }]);
    setLoading(false);
    if (error) { alert("Error: " + error.message); return; }
    alert("🎉 Supiri! Property eka live una!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-[248px] bg-white border-r flex-col sticky top-0 h-screen p-6 shrink-0">
        <Link href="/" className="flex items-center gap-2.5"><span className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-lg">P</span><span className="font-black text-[21px]">Property<span className="text-orange-500">LK</span></span></Link>
        <nav className="mt-10 space-y-1 text-sm font-medium">
          <Link href="/dashboard" className="flex gap-3 px-3.5 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50">🏠 Dashboard</Link>
          <Link href="/dashboard/new" className="flex gap-3 px-3.5 py-3 rounded-xl bg-black text-white shadow-lg shadow-black/20">➕ Add Property <span className="ml-auto bg-orange-500 text-[10px] px-2 py-0.5 rounded-full">YOU ARE HERE</span></Link>
          <Link href="/dashboard/payment" className="flex gap-3 px-3.5 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50">💳 Payments</Link>
          <Link href="/" className="flex gap-3 px-3.5 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50">🌍 Browse</Link>
        </nav>
        <div className="mt-auto bg-gradient-to-br from-orange-500 to-amber-500 text-white p-5 rounded-[20px]">
          <p className="font-bold">🔥 Pro Tip</p>
          <p className="text-white/90 text-xs mt-1 leading-relaxed">Title eka lassanata danna. “Luxury Villa with Pool” wage.</p>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* TOP */}
        <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
          <div className="max-w-[1000px] mx-auto px-5 h-[64px] flex justify-between items-center">
            <div className="flex gap-2 text-sm items-center"><Link href="/dashboard" className="text-zinc-500 hover:text-black">Dashboard</Link><span className="text-zinc-300">/</span><span className="font-bold">Add Property</span></div>
            <Link href="/dashboard" className="text-sm font-bold bg-zinc-100 px-4 py-2 rounded-full">Cancel ✕</Link>
          </div>
        </div>

        <form onSubmit={submit} className="max-w-[1000px] mx-auto p-5 md:p-8">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-[28px] bg-zinc-900 text-white p-7 md:p-8">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
            <div className="relative flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
              <div><span className="bg-white/15 backdrop-blur border border-white/20 text-[11px] font-bold px-3 py-1.5 rounded-full">✨ NEW LISTING</span><h1 className="text-[30px] md:text-[38px] font-black leading-[1.05] mt-3">List Your Property.<br/>Sell It Faster.</h1><p className="text-zinc-300 text-sm mt-2 max-w-md">Photo hodai nam, buyer la 3x wadiya enawa. Lassana photo ekak danna!</p></div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 w-full md:w-[200px]">
                <p className="text-[11px] font-bold tracking-widest text-zinc-300">COMPLETION</p><p className="text-2xl font-black mt-1">{progress}%</p><div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden"><div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-5 mt-5 items-start">
            {/* FORM */}
            <div className="space-y-5">
              <div className="bg-white rounded-[24px] border p-6 md:p-7 shadow-sm">
                <div className="flex items-center gap-3"><span className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</span><h3 className="font-black text-lg">Basic Details</h3></div>
                <label className="block text-[11px] font-black tracking-widest text-zinc-400 mt-5">PROPERTY TITLE *</label>
                <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Ex: Modern Luxury Villa with Pool in Colombo 07" className="w-full border rounded-2xl px-4 py-3.5 text-[15px] mt-1.5 outline-none focus:ring-2 ring-black/10 focus:border-black transition" />
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div><label className="block text-[11px] font-black tracking-widest text-zinc-400">PRICE (Rs.) *</label><div className="relative mt-1.5"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">Rs.</span><input type="number" value={form.price} onChange={e => update("price", e.target.value)} placeholder="25,000,000" className="w-full border rounded-2xl pl-12 pr-4 py-3.5 text-[15px] outline-none focus:ring-2 ring-black/10" /></div></div>
                  <div><label className="block text-[11px] font-black tracking-widest text-zinc-400">LOCATION *</label><input value={form.location} onChange={e => update("location", e.target.value)} placeholder="📍 Colombo 07, Sri Lanka" className="w-full border rounded-2xl px-4 py-3.5 text-[15px] mt-1.5 outline-none focus:ring-2 ring-black/10" /></div>
                </div>
                <label className="block text-[11px] font-black tracking-widest text-zinc-400 mt-5">PROPERTY TYPE</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["🏠 House", "🏡 Villa", "🏢 Apartment", "🌾 Land", "🏪 Commercial"].map(t => {
                    const name = t.split(" ")[1];
                    return <button key={t} type="button" onClick={() => update("type", name)} className={`px-4 py-2.5 rounded-full text-sm font-bold border transition ${form.type === name ? "bg-black text-white border-black scale-105 shadow-lg" : "bg-white hover:border-zinc-400"}`}>{t}</button>
                  })}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div><label className="text-[11px] font-black tracking-widest text-zinc-400">🛏️ BEDS</label><div className="flex gap-1.5 mt-1.5">{["1","2","3","4","5+"].map(n => <button key={n} type="button" onClick={() => update("beds", n)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${form.beds===n ? "bg-black text-white" : "bg-white"}`}>{n}</button>)}</div></div>
                  <div><label className="text-[11px] font-black tracking-widest text-zinc-400">🛁 BATHS</label><div className="flex gap-1.5 mt-1.5">{["1","2","3","4"].map(n => <button key={n} type="button" onClick={() => update("baths", n)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${form.baths===n ? "bg-black text-white" : "bg-white"}`}>{n}</button>)}</div></div>
                  <div><label className="text-[11px] font-black tracking-widest text-zinc-400">📐 AREA</label><input value={form.area} onChange={e => update("area", e.target.value)} placeholder="2400 sqft" className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1.5 outline-none" /></div>
                </div>
                <label className="block text-[11px] font-black tracking-widest text-zinc-400 mt-5">DESCRIPTION</label>
                <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4} placeholder="Tell the story... Private pool, garden, 2 floors, close to school..." className="w-full border rounded-2xl px-4 py-3.5 text-sm mt-1.5 outline-none focus:ring-2 ring-black/10 resize-none" />
              </div>

              <div className="bg-white rounded-[24px] border p-6 md:p-7 shadow-sm">
                <div className="flex items-center gap-3"><span className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">2</span><h3 className="font-black text-lg">Contact & Photo</h3></div>
                <label className="block text-[11px] font-black tracking-widest text-zinc-400 mt-5">PHONE / WHATSAPP</label>
                <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="077 123 4567" className="w-full border rounded-2xl px-4 py-3.5 text-sm mt-1.5 outline-none focus:ring-2 ring-black/10" />
                <label className="block text-[11px] font-black tracking-widest text-zinc-400 mt-4">IMAGE LINK</label>
                <input value={form.image_url} onChange={e => update("image_url", e.target.value)} placeholder="https://..." className="w-full border rounded-2xl px-4 py-3.5 text-sm mt-1.5 outline-none focus:ring-2 ring-black/10" />
              </div>
            </div>

            {/* LIVE PREVIEW */}
            <div className="lg:sticky lg:top-[84px] space-y-4">
              <p className="text-[11px] font-black tracking-widest text-zinc-400 px-1">👀 LIVE PREVIEW - Mehema penawa</p>
              <div className="bg-white rounded-[28px] overflow-hidden border shadow-xl shadow-black/5">
                <div className="h-[230px] relative overflow-hidden bg-zinc-100">
                  {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-6xl">🏠</div>}
                  <span className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full text-[11px] font-bold shadow">● Active</span>
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm font-black">Rs. {form.price ? Number(form.price).toLocaleString() : "—"}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-[17px] leading-snug">{form.title || "Your Property Title..."}</h3>
                  <p className="text-zinc-500 text-sm mt-1">📍 {form.location || "Location..."}</p>
                  <div className="flex gap-3 text-xs text-zinc-500 mt-3"><span>🛏️ {form.beds} Beds</span><span>🛁 {form.baths} Baths</span><span>📐 {form.area || "—"} sqft</span></div>
                  <p className="text-zinc-600 text-[13px] mt-3 line-clamp-2 leading-relaxed">{form.description || "Description eka methana penawa..."}</p>
                </div>
              </div>

              <div className="bg-zinc-900 text-white rounded-[24px] p-6">
                <p className="font-black">Ready to go live? 🚀</p>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">Publish kalama dashboard eke + home page eke penawa.</p>
                <button disabled={loading} className="w-full bg-white text-black py-3.5 rounded-full font-bold text-sm mt-4 hover:scale-[1.01] transition disabled:opacity-50">{loading ? "Publishing... ⏳" : "Publish Property →"}</button>
                <p className="text-center text-[11px] text-zinc-500 mt-3">Free • No hidden fees • Cancel anytime</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}