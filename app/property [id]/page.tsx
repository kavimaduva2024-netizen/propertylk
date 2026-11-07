"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PropertyDetail() {
  const params = useParams();
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("properties").select("*").eq("id", params.id).single();
      setP(data);
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F4F5F7]"><span className="text-5xl animate-bounce">🏠</span><p className="font-bold">Loading property...</p></div>;
  if (!p) return <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#F4F5F7]"><p className="text-6xl">😢</p><p className="font-black text-xl">Property eka hoyaganna ba!</p><Link href="/" className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold">Back to Home →</Link></div>;

  const images = [
    p.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
  ];
  const waLink = `https://wa.me/94771234567?text=${encodeURIComponent(`Hi! I'm interested in ${p.title} - Rs. ${Number(p.price).toLocaleString()} | PropertyLK`)}`;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* NAV */}
      <div className="bg-white/90 backdrop-blur border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 h-[64px] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2"><span className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center font-black">P</span><span className="font-black text-xl">Property<span className="text-orange-500">LK</span></span></Link>
          <div className="flex gap-2">
            <button onClick={() => setFav(!fav)} className={`px-4 py-2 rounded-full text-sm font-bold border ${fav ? "bg-red-50 border-red-200 text-red-500" : "bg-zinc-100"}`}>{fav ? "❤️ Saved" : "🤍 Save"}</button>
            <Link href="/" className="text-sm font-bold bg-black text-white px-4 py-2 rounded-full hidden sm:block">← Back</Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* BREADCRUMB + TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <p className="text-[13px] text-zinc-500">Home <span className="mx-1">/</span> {p.location} <span className="mx-1">/</span> <span className="text-black font-bold">{p.type}</span></p>
            <h1 className="text-[28px] md:text-[38px] font-black tracking-tight leading-[1.05] mt-2">{p.title}</h1>
            <p className="text-zinc-500 mt-1.5 text-sm">📍 {p.location} • 👁️ 1,248 views • ⭐ 4.9 (32 reviews) • <span className="text-green-600 font-bold">● Available</span></p>
          </div>
          <div className="flex gap-2 shrink-0"><button className="bg-white border px-4 py-2.5 rounded-full text-sm font-bold">↗️ Share</button><button className="bg-white border px-4 py-2.5 rounded-full text-sm font-bold">🖨️ Print</button></div>
        </div>

        {/* GALLERY - MAIN + THUMBNAILS */}
        <div className="mt-5">
          <div className="h-[300px] md:h-[460px] rounded-[28px] overflow-hidden bg-zinc-200 relative group">
            <img key={activeImg} src={images[activeImg]} className="w-full h-full object-cover transition" />
            <span className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full text-[11px] font-black shadow">● ACTIVE • FOR SALE</span>
            <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold">{activeImg + 1} / {images.length} Photos</span>
            <button onClick={() => setActiveImg((activeImg - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition">←</button>
            <button onClick={() => setActiveImg((activeImg + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition">→</button>
          </div>
          <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <img key={i} src={img} onClick={() => setActiveImg(i)} className={`w-[110px] h-[74px] md:w-[140px] md:h-[90px] object-cover rounded-2xl cursor-pointer shrink-0 border-2 transition ${activeImg === i ? "border-black scale-[1.02] shadow-lg" : "border-transparent opacity-70 hover:opacity-100"}`} />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-5 mt-6 items-start">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="bg-white rounded-[24px] border p-6 md:p-7">
              <h3 className="font-black text-[18px]">About this property</h3>
              <p className="text-zinc-600 leading-relaxed text-[15px] mt-3">{p.description || "This stunning property is located in a prime area with easy access to schools, hospitals, supermarkets and main roads. Bright and spacious living area, modern kitchen, beautiful garden and ample parking. Perfect for families looking for comfort, peace and luxury in one place."}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { icon: "🛏️", v: "3", l: "Bedrooms" },
                  { icon: "🛁", v: "2", l: "Bathrooms" },
                  { icon: "📐", v: "2,400", l: "Sqft Area" },
                  { icon: "🏠", v: p.type || "Villa", l: "Type" },
                ].map((f, i) => <div key={i} className="bg-[#F4F5F7] rounded-2xl p-4 text-center hover:bg-zinc-100 transition"><div className="text-[28px]">{f.icon}</div><p className="font-black mt-1">{f.v}</p><p className="text-[11px] text-zinc-500">{f.l}</p></div>)}
              </div>
              <h4 className="font-black mt-7">✨ Features & Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {["🏊 Swimming Pool", "🚗 2 Parking", "🌳 Garden", "📶 Free WiFi", "🔒 24/7 Security", "☀️ Solar Power", "🏋️ Gym", "🍳 Modern Kitchen", "❄️ A/C", "🔥 Hot Water", "🐕 Pet Friendly", "🏢 Balcony"].map(f => <span key={f} className="bg-zinc-50 border px-3 py-2.5 rounded-xl text-[12px] font-bold text-center">{f}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-[24px] border p-6 md:p-7">
              <h3 className="font-black text-[18px]">📍 Location & Nearby</h3>
              <div className="h-[220px] rounded-[20px] mt-4 bg-gradient-to-br from-green-100 via-blue-50 to-amber-50 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-5xl animate-bounce">📍</span>
                <p className="font-black mt-2">{p.location}</p><p className="text-xs text-zinc-500">Colombo, Sri Lanka • Prime Location</p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                <div className="bg-zinc-50 rounded-xl p-3"><p className="text-lg">🏫</p><p className="font-bold mt-1">School</p><p className="text-zinc-500">5 min</p></div>
                <div className="bg-zinc-50 rounded-xl p-3"><p className="text-lg">🏥</p><p className="font-bold mt-1">Hospital</p><p className="text-zinc-500">8 min</p></div>
                <div className="bg-zinc-50 rounded-xl p-3"><p className="text-lg">🛒</p><p className="font-bold mt-1">Supermarket</p><p className="text-zinc-500">3 min</p></div>
              </div>
            </div>
          </div>

          {/* RIGHT - PRICE CARD */}
          <div className="lg:sticky lg:top-[84px] space-y-4">
            <div className="bg-white rounded-[28px] border p-6 shadow-xl shadow-black/5">
              <div className="flex justify-between items-start"><div><p className="text-[11px] font-black tracking-widest text-zinc-400">ASKING PRICE</p><p className="text-[34px] font-black leading-none mt-1">Rs. {Number(p.price).toLocaleString()}</p><p className="text-zinc-500 text-xs mt-1">≈ Rs. {Math.round(Number(p.price)/2400).toLocaleString()} / sqft</p></div><span className="bg-green-100 text-green-700 text-[11px] font-black px-2.5 py-1 rounded-full">✓ NEGOTIABLE</span></div>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t">
                <span className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black text-white rounded-full flex items-center justify-center font-black text-lg">A</span>
                <div className="flex-1"><p className="font-bold text-sm">Admin Owner <span className="text-blue-500">✓</span></p><p className="text-xs text-zinc-500">Verified Seller • Response in 5 min</p></div>
              </div>
              <a href={waLink} target="_blank" className="block text-center bg-[#25D366] hover:bg-[#1eb856] transition text-white py-4 rounded-full font-bold text-[15px] mt-5 shadow-lg shadow-green-500/25">💬 Chat on WhatsApp</a>
              <a href="tel:0771234567" className="block text-center bg-black text-white py-4 rounded-full font-bold text-[15px] mt-2">📞 Call Owner</a>
              <div className="grid grid-cols-2 gap-2 mt-2"><button className="bg-zinc-100 py-3 rounded-full font-bold text-sm">📅 Book Visit</button><button className="bg-zinc-100 py-3 rounded-full font-bold text-sm">💰 Make Offer</button></div>
              <p className="text-center text-[11px] text-zinc-400 mt-4">🔒 Secure • Your number is private until you contact</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-700 text-white rounded-[24px] p-6">
              <p className="font-black">Love this place? 😍</p><p className="text-zinc-300 text-xs mt-1 leading-relaxed">Book a FREE site visit. Our team will pick you up and show you around.</p>
              <button className="w-full bg-white text-black py-3.5 rounded-full font-bold text-sm mt-4">Book Free Site Visit →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}