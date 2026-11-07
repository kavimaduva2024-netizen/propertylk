"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DISTRICTS = ["All Districts","Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar","Mullaitivu","Vavuniya","Batticaloa","Ampara","Trincomalee","Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla","Moneragala","Ratnapura","Kegalle"];

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [showDistricts, setShowDistricts] = useState(false);
  const [fav, setFav] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
      if (data) setProperties(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = properties.filter(p => {
    const text = (p.title + " " + p.location).toLowerCase();
    return text.includes(search.toLowerCase()) && (cat === "All" || p.type === cat) && (district === "All Districts" || text.includes(district.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* NAVBAR */}
      <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 h-[68px] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2"><span className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">P</span><span className="font-black text-[22px]">Property<span className="text-orange-500">LK</span></span></Link>
          <nav className="hidden md:flex gap-7 text-sm font-medium text-zinc-600"><Link href="/" className="text-black font-bold">Home</Link><Link href="/" className="hover:text-black">Buy</Link><Link href="/" className="hover:text-black">Rent</Link><Link href="/dashboard" className="hover:text-black">Dashboard</Link></nav>
          <div className="flex gap-2"><Link href="/dashboard" className="hidden sm:block text-sm font-bold bg-zinc-100 px-4 py-2.5 rounded-full">Login</Link><Link href="/dashboard/new" className="text-sm font-bold bg-black text-white px-5 py-2.5 rounded-full shadow-lg">+ List Property</Link></div>
        </div>
      </header>

      {/* HERO - SUPIRI */}
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-5 py-14 md:py-[84px]">
          <span className="bg-orange-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg">🔥 🇱🇰 #1 IN SRI LANKA • 25 DISTRICTS</span>
          <h1 className="text-white text-[42px] md:text-[62px] font-black leading-[0.98] tracking-tight mt-4">Find Your<br/>Dream Home<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">in Sri Lanka.</span></h1>
          <p className="text-zinc-300 mt-4 max-w-md text-[15px] leading-relaxed">2,500+ verified properties. No brokers. Direct from owners. Colombo to Jaffna, Galle to Trincomalee.</p>

          {/* SEARCH + DISTRICT 25 */}
          <div className="bg-white rounded-[20px] md:rounded-full p-2 mt-7 max-w-[780px] flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-2 px-4"><span className="text-lg">🔍</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Colombo, Kandy, Villa..." className="w-full py-3.5 outline-none text-sm font-medium" /></div>
            <div className="relative">
              <button onClick={() => setShowDistricts(!showDistricts)} className="w-full md:w-[210px] flex justify-between items-center bg-zinc-100 hover:bg-zinc-200 transition px-4 py-3.5 rounded-full text-sm font-bold">📍 {district} <span>▼</span></button>
              {showDistricts && (
                <div className="absolute right-0 top-[56px] w-[290px] bg-white rounded-[20px] shadow-2xl border p-2 z-40 max-h-[340px] overflow-y-auto">
                  <p className="text-[11px] font-black tracking-widest text-zinc-400 px-3 py-2">SELECT DISTRICT • 25 DISTRICTS</p>
                  {DISTRICTS.map(d => (
                    <button key={d} onClick={() => { setDistrict(d); setShowDistricts(false); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-50 flex justify-between ${district === d ? "bg-black text-white" : ""}`}>{d} {district === d && <span>✓</span>}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-800">Search →</button>
          </div>

          {/* QUICK DISTRICTS */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {["Colombo","Kandy","Galle","Jaffna","Kurunegala"].map(l => (
              <button key={l} onClick={() => setDistrict(l)} className={`text-xs font-bold px-4 py-2 rounded-full border transition ${district === l ? "bg-white text-black border-white" : "bg-white/15 backdrop-blur border-white/20 text-white hover:bg-white/25"}`}>📍 {l}</button>
            ))}
            <button onClick={() => setShowDistricts(true)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full">+ All 25 Districts →</button>
          </div>

          <div className="flex gap-8 md:gap-12 mt-9 text-white">
            <div><p className="text-2xl md:text-3xl font-black">{properties.length || "2,500"}+</p><p className="text-zinc-400 text-xs">Properties</p></div>
            <div><p className="text-2xl md:text-3xl font-black">25</p><p className="text-zinc-400 text-xs">Districts</p></div>
            <div><p className="text-2xl md:text-3xl font-black">⭐ 4.9</p><p className="text-zinc-400 text-xs">Rating</p></div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-5 pb-16">
        {/* DISTRICT SELECTED BADGE */}
        {district !== "All Districts" && (
          <div className="bg-black text-white rounded-full px-5 py-3.5 mt-6 flex justify-between items-center text-sm font-bold shadow-lg">📍 Showing <span className="text-orange-400 mx-1">{district}</span> • {filtered.length} properties found <button onClick={() => setDistrict("All Districts")} className="bg-white/20 px-3 py-1 rounded-full text-xs">Clear ✕</button></div>
        )}

        {/* CATEGORIES */}
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
          {[{name:"All",icon:"🌍"},{name:"Villa",icon:"🏡"},{name:"House",icon:"🏠"},{name:"Apartment",icon:"🏢"},{name:"Land",icon:"🌾"}].map(c => (
            <button key={c.name} onClick={() => setCat(c.name)} className={`shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-bold border transition ${cat === c.name ? "bg-black text-white border-black shadow-lg scale-[1.02]" : "bg-white hover:border-zinc-300"}`}><span className="text-lg">{c.icon}</span>{c.name}</button>
          ))}
        </div>

        <div className="flex justify-between items-end mt-8">
          <div><h2 className="text-[28px] md:text-[34px] font-black tracking-tight leading-none">Featured Properties ✨</h2><p className="text-zinc-500 text-sm mt-2">{filtered.length} properties • {district} • {cat}</p></div>
          <Link href="/dashboard/new" className="hidden md:block text-sm font-bold bg-white border px-4 py-2.5 rounded-full hover:bg-zinc-50">+ Add Yours →</Link>
        </div>

        {loading ? <div className="grid md:grid-cols-3 gap-5 mt-6">{[1,2,3].map(i => <div key={i} className="bg-white rounded-[24px] h-[380px] animate-pulse"></div>)}</div> : filtered.length === 0 ? (
          <div className="bg-white rounded-[28px] border p-12 text-center mt-6"><p className="text-6xl">📍</p><p className="font-black text-xl mt-3">{district} wala property ekak na!</p><p className="text-zinc-500 text-sm mt-1">Thawa district ekak try karanna.</p><button onClick={() => { setDistrict("All Districts"); setCat("All"); setSearch(""); }} className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm mt-4">Show All Properties</button></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {filtered.map(p => (
              <Link key={p.id} href={`/property/${p.id}`} className="group bg-white rounded-[24px] overflow-hidden border hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1.5 transition duration-300">
                <div className="h-[240px] relative overflow-hidden bg-zinc-100">
                  <img src={p.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <span className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full text-[11px] font-black shadow">● {p.status || "Active"}</span>
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full text-[11px] font-bold">{p.type || "Villa"}</span>
                  <button onClick={(e) => { e.preventDefault(); setFav(fav.includes(p.id) ? fav.filter(f => f !== p.id) : [...fav, p.id]); }} className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-lg hover:scale-110 transition">{fav.includes(p.id) ? "❤️" : "🤍"}</button>
                  <span className="absolute bottom-3 left-3 bg-white px-3.5 py-1.5 rounded-full text-sm font-black shadow">Rs. {Number(p.price).toLocaleString()}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-[17px] leading-snug line-clamp-1 group-hover:text-orange-600 transition">{p.title}</h3>
                  <p className="text-zinc-500 text-sm mt-1">📍 {p.location}</p>
                  <div className="flex gap-4 text-xs text-zinc-500 mt-3 pt-3 border-t"><span>🛏️ 3 Beds</span><span>🛁 2 Baths</span><span>📐 2,400 sqft</span><span className="ml-auto font-bold text-black group-hover:translate-x-1 transition">View →</span></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* BROWSE BY DISTRICT - 25 */}
        <h3 className="text-[24px] font-black mt-14">Browse by District 🗺️</h3>
        <p className="text-zinc-500 text-sm mt-1">Sri Lankawe district 25 ma - click karanna, e district eke properties balanna</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 mt-5">
          {DISTRICTS.slice(1).map(d => (
            <button key={d} onClick={() => { setDistrict(d); window.scrollTo({ top: 400, behavior: "smooth" }); }} className={`rounded-[20px] p-3.5 text-left border transition hover:-translate-y-0.5 ${district === d ? "bg-black text-white border-black shadow-lg" : "bg-white hover:border-black hover:shadow-md"}`}>
              <p className="text-xl">📍</p><p className="font-bold text-[13px] mt-1.5 leading-tight">{d}</p><p className="text-[11px] opacity-60 mt-0.5">Explore →</p>
            </button>
          ))}
        </div>

        {/* CTA + WHY US */}
        <div className="mt-12 relative overflow-hidden rounded-[28px] bg-zinc-900 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative"><h3 className="text-[28px] font-black leading-tight">Have a property<br/>to sell? 🏡</h3><p className="text-zinc-300 text-sm mt-2">Free listing • Sell in 30 days • No broker fees</p></div>
          <Link href="/dashboard/new" className="relative bg-white text-black px-7 py-3.5 rounded-full font-bold text-sm shrink-0 shadow-xl hover:scale-105 transition">List Your Property →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-5">
          {[["🛡️","Verified Only","Every property is verified. No fake listings."],["💬","Direct Contact","Chat directly with owners on WhatsApp."],["⚡","Sell Fast","Boosted listings sell 3x faster. Avg 14 days."]].map(([icon,title,desc]) => (
            <div key={title} className="bg-white rounded-[24px] border p-6 hover:shadow-lg transition"><span className="text-3xl">{icon}</span><h4 className="font-black mt-3">{title}</h4><p className="text-zinc-500 text-sm mt-1 leading-relaxed">{desc}</p></div>
          ))}
        </div>
      </main>
      <footer className="bg-white border-t"><div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row justify-between gap-4 items-center"><p className="font-black text-lg">Property<span className="text-orange-500">LK</span> <span className="text-zinc-400 font-normal text-sm">© 2026 • 25 Districts • Made in Sri Lanka 🇱🇰</span></p><div className="flex gap-5 text-sm text-zinc-500"><Link href="/">About</Link><Link href="/">Contact</Link><Link href="/dashboard">Dashboard</Link></div></div></footer>
    </div>
  );
}