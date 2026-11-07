"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Karla_Tamil_Upright } from "next/font/google";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ===== MOCK MESSAGES =====
const MOCK_MSGS = [
  { id: 1, name: "Nimal Perera", avatar: "N", msg: "Colombo villa eka thiyenawada? Price eka adu karanna puluwanda?", time: "2m ago", unread: 2, prop: "Luxury Villa in Colombo 07", color: "from-blue-400 to-cyan-500" },
  { id: 2, name: "Kavindu Silva", avatar: "K", msg: "Kandy house eka balanna enna puluwan da Saturday?", time: "1h ago", unread: 1, prop: "Modern House in Kandy", color: "from-orange-400 to-pink-500" },
  { id: 3, name: "Sanduni Fernando", avatar: "S", msg: "Thanks! Document tika ewanna puluwanda?", time: "3h ago", unread: 0, prop: "Apartment in Dehiwala", color: "from-purple-400 to-pink-500" },
  { id: 4, name: "Ravindu Jay", avatar: "R", msg: "Land eka visit karanna enna ona. Time ekak kiyanna", time: "Yesterday", unread: 0, prop: "Land in Galle", color: "from-green-400 to-emerald-500" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [favs, setFavs] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState(MOCK_MSGS[0]);
  const [reply, setReply] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { from: "them", text: "Colombo villa eka thiyenawada? Price eka adu karanna puluwanda?", time: "10:30 AM" },
    { from: "me", text: "Ow thiyenawa! Visit karanna enna puluwan. Saturday 10 AM hodai da? 😊", time: "10:32 AM" },
    { from: "them", text: "Hari! Saturday ennam. Location eka ewanna. 🙏", time: "10:35 AM" },
  ]);

  // 🔐 LOGIN CHECK
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else { setUser(user); load(); }
      const saved = JSON.parse(localStorage.getItem("favs") || "[]");
      setFavs(saved);
    }
    checkUser();
  }, []);

  async function load() {
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (data) setProperties(data);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function deleteProp(id: string) {
    if (!confirm("Delete karanna sure da? 😢")) return;
    await supabase.from("properties").delete().eq("id", id);
    load();
  }

  function toggleFav(id: string) {
    const newFavs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    setFavs(newFavs);
    localStorage.setItem("favs", JSON.stringify(newFavs));
  }

  function sendReply() {
    if (!reply.trim()) return;
    setChatMessages([...chatMessages, { from: "me", text: reply, time: "Now" }]);
    setReply("");
  }

  const filtered = properties.filter(p => {
    const matchSearch = (p.title + " " + p.location).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter || (filter === "Active" && !p.status);
    return matchSearch && matchFilter;
  });

  const totalValue = properties.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const activeCount = properties.filter(p => p.status !== "Sold" && p.status !== "Draft").length;
  const soldCount = properties.filter(p => p.status === "Sold").length;
  const favProps = properties.filter(p => favs.includes(p.id));

  const menu = [
    { name: "Dashboard", icon: "🏠", badge: "" },
    { name: "My Properties", icon: "🏡", badge: `${properties.length}` },
    { name: "Favorites", icon: "❤️", badge: `${favs.length}` },
    { name: "Messages", icon: "💬", badge: "3" },
    { name: "Analytics", icon: "📊", badge: "" },
    { name: "Payments", icon: "💳", badge: "" },
    { name: "Settings", icon: "⚙️", badge: "" },
  ];

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-[#0F0F12]"><div className="text-center"><p className="text-4xl animate-bounce">🔐</p><p className="font-bold mt-2 text-white">Checking Login...</p></div></div>;

  function SidebarContent() {
    return (
      <>
        <Link href="/" className="flex items-center gap-2.5"><span className="w-10 h-10 bg-white text-black rounded-[12px] flex items-center justify-center font-black text-lg">P</span><div><p className="font-black text-[19px] leading-none">Property<span className="text-orange-500">LK</span></p><p className="text-[10px] text-zinc-400 tracking-widest font-bold mt-1">PRO • SRI LANKA</p></div></Link>
        <div className="bg-white/10 backdrop-blur border border-white/10 rounded-[20px] p-3.5 mt-6 flex items-center gap-3">
          <span className="w-11 h-11 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center font-black text-lg shrink-0">{user.email?.[0].toUpperCase()}</span>
          <div className="min-w-0"><p className="font-black text-sm truncate capitalize">{user.email?.split("@")[0]}</p><p className="text-[11px] text-zinc-400 truncate">{user.email}</p><span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">● PREMIUM</span></div>
        </div>
        <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500 mt-6 mb-2 px-2">MENU</p>
        <nav className="space-y-1">
          {menu.map(m => (
            <button key={m.name} onClick={() => { setActiveMenu(m.name); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-sm font-bold transition ${activeMenu === m.name ? "bg-white text-black shadow-lg" : "text-zinc-300 hover:bg-white/10 hover:text-white"}`}>
              <span className="text-lg">{m.icon}</span>{m.name}
              {m.badge && m.badge !== "0" && <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-black ${activeMenu === m.name ? "bg-black text-white" : "bg-white/15 text-white"}`}>{m.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-[20px] p-4"><p className="font-black text-sm">Boost Your Listing 🚀</p><p className="text-white/80 text-xs mt-1 leading-relaxed">10x more views. Sell in 14 days.</p><button className="bg-white text-black text-xs font-black px-4 py-2.5 rounded-full mt-3 w-full">Boost Now →</button></div>
          <button onClick={logout} className="w-full mt-3 flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/20 text-zinc-300 hover:text-red-300 py-3 rounded-[14px] text-sm font-bold transition">🚪 Logout</button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F3] flex">
      {/* ===== SIDEBAR DESKTOP ===== */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col sticky top-0 h-screen p-4">
        <div className="bg-[#111111] text-white rounded-[28px] p-5 flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full"></div>
          <div className="relative flex-1 flex flex-col"><SidebarContent /></div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* ===== FLOATING PILL NAV ===== */}
        <div className="sticky top-3 z-30 px-3 md:px-5">
          <div className="max-w-[1100px] mx-auto bg-white/85 backdrop-blur-xl border border-white shadow-lg shadow-black/5 rounded-full pl-2 pr-2 py-2 flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 bg-black text-white rounded-full font-bold">☰</button>
            <div className="hidden md:flex items-center gap-1 bg-zinc-100 rounded-full p-1">
              <Link href="/" className="px-4 py-2 rounded-full text-sm font-bold">Home</Link>
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-white shadow">{activeMenu}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-2.5 ml-1"><span>🔍</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..." className="w-full bg-transparent outline-none text-sm font-medium" /></div>
            <button className="relative w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-lg">🔔<span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span></button>
            <Link href="/dashboard/new" className="hidden sm:flex bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold shrink-0">+ Add</Link>
            <span className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 text-white rounded-full flex items-center justify-center font-black shrink-0">{user.email?.[0].toUpperCase()}</span>
          </div>
        </div>

        {/* ===== MOBILE SIDEBAR ===== */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="absolute left-3 top-3 bottom-3 w-[280px] bg-[#111111] text-white rounded-[28px] p-5 flex flex-col overflow-y-auto"><div className="flex justify-between items-center"><p className="font-black text-lg">Property<span className="text-orange-500">LK</span></p><button onClick={() => setSidebarOpen(false)} className="w-9 h-9 bg-white/10 rounded-full">✕</button></div><div className="mt-4 flex-1 flex flex-col"><SidebarContent /></div></div>
          </div>
        )}

        <main className="max-w-[1100px] mx-auto px-4 md:px-5 pb-28 pt-5">

          {/* ================= DASHBOARD ================= */}
          {(activeMenu === "Dashboard" || activeMenu === "My Properties") && (
            <>
              <div className="bg-[#111111] text-white rounded-[28px] p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/30 blur-[80px] rounded-full"></div>
                <div className="relative flex flex-col md:flex-row justify-between gap-5">
                  <div><span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-bold">✨ {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span><h1 className="text-[28px] md:text-[36px] font-black leading-[1.05] tracking-tight mt-4">Welcome back,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 capitalize">{user.email?.split("@")[0]}! 👋</span></h1><p className="text-zinc-400 text-sm mt-2 max-w-md">You have <b className="text-white">{activeCount} active listings</b> and <b className="text-white">{properties.length} total properties</b>.</p><div className="flex gap-2 mt-5"><Link href="/dashboard/new" className="bg-white text-black px-5 py-3 rounded-full text-sm font-bold">+ New Property</Link><button onClick={() => setActiveMenu("Analytics")} className="bg-white/10 border border-white/10 px-5 py-3 rounded-full text-sm font-bold">View Analytics →</button></div></div>
                  <div className="hidden md:block shrink-0"><div className="bg-white/10 backdrop-blur border border-white/10 rounded-[20px] p-4 w-[180px]"><p className="text-[11px] text-zinc-400 font-bold">TOTAL VALUE</p><p className="text-[24px] font-black mt-1">Rs. {(totalValue / 1000000).toFixed(1)}M</p><div className="flex gap-1 mt-3 items-end h-[50px]">{[40, 65, 50, 80, 95, 70, 100].map((h, i) => (<div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-pink-400 rounded-full" style={{ height: `${h * 0.5}px` }}></div>))}</div><p className="text-[11px] text-green-400 font-bold mt-2">↑ 24% this month</p></div></div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="bg-white rounded-[24px] border p-5"><div className="flex justify-between"><span className="text-2xl bg-blue-50 w-11 h-11 rounded-full flex items-center justify-center">🏠</span><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-[11px] font-black h-fit">+12%</span></div><p className="text-[28px] font-black mt-3 leading-none">{properties.length}</p><p className="text-zinc-500 text-xs font-bold mt-1">Total Properties</p></div>
                <div className="bg-white rounded-[24px] border p-5"><div className="flex justify-between"><span className="text-2xl bg-green-50 w-11 h-11 rounded-full flex items-center justify-center">✅</span><div className="h-2 w-16 bg-zinc-100 rounded-full self-center overflow-hidden"><div className="h-full bg-green-500" style={{ width: properties.length ? `${(activeCount / properties.length) * 100}%` : "0%" }}></div></div></div><p className="text-[28px] font-black mt-3 leading-none">{activeCount}</p><p className="text-zinc-500 text-xs font-bold mt-1">Active Listings</p></div>
                <div className="bg-white rounded-[24px] border p-5"><div className="flex justify-between"><span className="text-2xl bg-orange-50 w-11 h-11 rounded-full flex items-center justify-center">🎉</span><span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-[11px] font-black h-fit">🔥 Hot</span></div><p className="text-[28px] font-black mt-3 leading-none">{soldCount}</p><p className="text-zinc-500 text-xs font-bold mt-1">Sold Properties</p></div>
                <div className="bg-white rounded-[24px] border p-5"><div className="flex justify-between"><span className="text-2xl bg-purple-50 w-11 h-11 rounded-full flex items-center justify-center">👁️</span><span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-[11px] font-black h-fit">1.2k</span></div><p className="text-[28px] font-black mt-3 leading-none">8,432</p><p className="text-zinc-500 text-xs font-bold mt-1">Total Views</p></div>
              </div>

              <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
                {["All", "Active", "Sold", "Draft"].map(f => (<button key={f} onClick={() => setFilter(f)} className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition ${filter === f ? "bg-black text-white shadow-lg" : "bg-white border hover:border-black"}`}>{f} {f === "All" && `(${properties.length})`}</button>))}
                <span className="ml-auto hidden md:block self-center text-sm text-zinc-500 font-medium">Showing {filtered.length} results</span>
              </div>

              {loading ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">{[1, 2, 3].map(i => <div key={i} className="bg-white rounded-[24px] h-[380px] animate-pulse"></div>)}</div> : filtered.length === 0 ? (
                <div className="bg-white rounded-[28px] border p-12 text-center mt-4"><p className="text-6xl">🏡</p><p className="font-black text-xl mt-3">Thawama property ekak na!</p><p className="text-zinc-500 text-sm mt-1">Mulinma property ekak add karanna.</p><Link href="/dashboard/new" className="inline-block bg-black text-white px-7 py-3.5 rounded-full font-bold text-sm mt-4">+ Add Your First Property →</Link></div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                  {filtered.map(p => (
                    <div key={p.id} className="group bg-white rounded-[28px] overflow-hidden border hover:shadow-2xl hover:-translate-y-1 transition duration-300">
                      <Link href={`/property/${p.id}`}>
                        <div className="h-[210px] relative overflow-hidden bg-zinc-100">
                          <img src={p.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          <span className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-black shadow ${p.status === "Sold" ? "bg-red-500 text-white" : p.status === "Draft" ? "bg-zinc-900 text-white" : "bg-green-500 text-white"}`}>{p.status === "Sold" ? "● SOLD" : p.status === "Draft" ? "● DRAFT" : "● ACTIVE"}</span>
                          <span className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full text-[11px] font-bold">{p.type || "Villa"}</span>
                          <span className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full text-sm font-black shadow">Rs. {Number(p.price).toLocaleString()}</span>
                        </div>
                      </Link>
                      <div className="p-5">
                        <h3 className="font-black text-[17px] leading-snug line-clamp-1">{p.title}</h3>
                        <p className="text-zinc-500 text-sm mt-1">📍 {p.location}</p>
                        <div className="flex gap-3 text-xs text-zinc-500 mt-3"><span>🛏️ 3</span><span>🛁 2</span><span>📐 2400 sqft</span><span className="ml-auto">⭐ 4.9</span></div>
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Link href={`/property/${p.id}`} className="flex-1 text-center bg-black text-white py-2.5 rounded-full text-[13px] font-bold">View →</Link>
                          <button onClick={() => toggleFav(p.id)} className={`w-[42px] rounded-full flex items-center justify-center ${favs.includes(p.id) ? "bg-red-50 text-red-500" : "bg-zinc-100"}`}>{favs.includes(p.id) ? "❤️" : "🤍"}</button>
                          <button onClick={() => deleteProp(p.id)} className="w-[42px] bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-[28px] p-7 mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white"><div><h3 className="font-black text-[22px]">Want to sell faster? 🚀</h3><p className="text-white/80 text-sm mt-1">Boost your listing and reach 10x more buyers in Colombo.</p></div><button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm shrink-0">Boost Listing - Rs. 2,500 →</button></div>
            </>
          )}

          {/* ================= FAVORITES ================= */}
          {activeMenu === "Favorites" && (
            <>
              <h1 className="text-[32px] font-black tracking-tight">My Favorites ❤️</h1>
              <p className="text-zinc-500 text-sm mt-1">You saved <b className="text-black">{favs.length} properties</b>. Property eke 🤍 obala fav karanna.</p>
              {favProps.length === 0 ? (
                <div className="bg-white rounded-[28px] border p-8 mt-6">
                  <p className="font-black text-lg">Thawama fav ekak na! 😢</p><p className="text-zinc-500 text-sm mt-1">Pahala properties walin ekak fav karanna. Ethakota mehema enawa.</p>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    {properties.slice(0, 3).map(p => (
                      <div key={p.id} className="bg-white rounded-[24px] overflow-hidden border"><img src={p.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"} className="h-[180px] w-full object-cover" /><div className="p-4"><h3 className="font-black line-clamp-1">{p.title}</h3><p className="text-sm text-zinc-500">📍 {p.location} • Rs. {Number(p.price).toLocaleString()}</p><button onClick={() => toggleFav(p.id)} className="w-full mt-3 bg-black text-white py-2.5 rounded-full text-sm font-bold">{favs.includes(p.id) ? "❤️ Saved!" : "🤍 Add to Favorites"}</button></div></div>
                    ))}
                  </div>
                  {properties.length === 0 && <button onClick={() => setActiveMenu("Dashboard")} className="mt-4 bg-black text-white px-6 py-3 rounded-full font-bold text-sm">Go to Dashboard →</button>}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                  {favProps.map(p => (
                    <div key={p.id} className="bg-white rounded-[28px] overflow-hidden border hover:shadow-xl transition"><div className="h-[200px] relative"><img src={p.image_url} className="w-full h-full object-cover" /><button onClick={() => toggleFav(p.id)} className="absolute top-3 right-3 bg-white w-10 h-10 rounded-full text-lg shadow">❤️</button><span className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full text-sm font-black">Rs. {Number(p.price).toLocaleString()}</span></div><div className="p-5"><h3 className="font-black line-clamp-1">{p.title}</h3><p className="text-zinc-500 text-sm mt-1">📍 {p.location}</p><Link href={`/property/${p.id}`} className="block text-center bg-black text-white py-2.5 rounded-full text-sm font-bold mt-4">View Details →</Link></div></div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================= MESSAGES ================= */}
          {activeMenu === "Messages" && (
            <>
              <h1 className="text-[32px] font-black tracking-tight">Messages 💬</h1>
              <p className="text-zinc-500 text-sm">Buyers lagen messages tika mehema balanna.</p>
              <div className="grid md:grid-cols-[320px_1fr] gap-4 mt-6 h-[580px]">
                <div className="bg-white rounded-[24px] border overflow-hidden flex flex-col">
                  <div className="p-3 border-b"><input placeholder="🔍 Search chats..." className="w-full bg-zinc-100 rounded-full px-4 py-2.5 text-sm outline-none" /></div>
                  <div className="flex-1 overflow-y-auto">
                    {MOCK_MSGS.map(c => (
                      <button key={c.id} onClick={() => setSelectedChat(c)} className={`w-full flex gap-3 p-4 text-left border-b hover:bg-zinc-50 ${selectedChat.id === c.id ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                        <span className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.color} text-white flex items-center justify-center font-black shrink-0`}>{c.avatar}</span>
                        <div className="min-w-0 flex-1"><div className="flex justify-between"><p className="font-black text-sm truncate">{c.name}</p><span className="text-[11px] text-zinc-400 shrink-0">{c.time}</span></div><p className="text-xs text-zinc-500 truncate mt-0.5">{c.msg}</p><span className="text-[11px] bg-zinc-100 px-2 py-0.5 rounded-full font-bold inline-block mt-1 truncate max-w-full">🏠 {c.prop}</span></div>
                        {c.unread > 0 && <span className="w-6 h-6 bg-red-500 text-white rounded-full text-[11px] font-black flex items-center justify-center shrink-0">{c.unread}</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-[24px] border flex flex-col overflow-hidden">
                  <div className="p-4 border-b flex items-center gap-3"><span className={`w-11 h-11 rounded-full bg-gradient-to-br ${selectedChat.color} text-white flex items-center justify-center font-black`}>{selectedChat.avatar}</span><div><p className="font-black">{selectedChat.name}</p><p className="text-xs text-green-600 font-bold">● Online • {selectedChat.prop}</p></div><button className="ml-auto bg-zinc-100 px-4 py-2 rounded-full text-sm font-bold">📞 Call</button></div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#F9F9FB]">
                    <div className="flex justify-center"><span className="bg-white border text-[11px] px-3 py-1 rounded-full text-zinc-500">Today</span></div>
                    {chatMessages.map((m, i) => (
                      <div key={i} className={m.from === "me" ? "bg-black text-white rounded-[20px] rounded-br-md px-4 py-3 max-w-[80%] ml-auto" : "bg-white border rounded-[20px] rounded-bl-md px-4 py-3 max-w-[80%] shadow-sm"}><p className="text-sm">{m.text}</p><span className="text-[11px] text-zinc-400">{m.time}</span></div>
                    ))}
                  </div>
                  <div className="p-3 border-t flex gap-2"><input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} placeholder="Type a message..." className="flex-1 bg-zinc-100 rounded-full px-4 py-3 text-sm outline-none" /><button onClick={sendReply} className="bg-black text-white px-5 py-3 rounded-full text-sm font-bold shrink-0">Send →</button></div>
                </div>
              </div>
            </>
          )}

          {/* ================= ANALYTICS ================= */}
          {activeMenu === "Analytics" && (
            <>
              <h1 className="text-[32px] font-black tracking-tight">Analytics 📊</h1>
              <p className="text-zinc-500 text-sm">Oge listings walata ena views tika.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <div className="bg-white rounded-[24px] border p-5"><p className="text-3xl">👁️</p><p className="text-[28px] font-black mt-2">8,432</p><p className="text-zinc-500 text-xs font-bold">Total Views</p><p className="text-green-600 text-xs font-bold mt-2">↑ 24% vs last month</p></div>
                <div className="bg-white rounded-[24px] border p-5"><p className="text-3xl">💬</p><p className="text-[28px] font-black mt-2">128</p><p className="text-zinc-500 text-xs font-bold">Total Inquiries</p><p className="text-green-600 text-xs font-bold mt-2">↑ 12% vs last month</p></div>
                <div className="bg-white rounded-[24px] border p-5"><p className="text-3xl">❤️</p><p className="text-[28px] font-black mt-2">{favs.length}</p><p className="text-zinc-500 text-xs font-bold">Favorites</p><p className="text-orange-600 text-xs font-bold mt-2">🔥 Growing!</p></div>
                <div className="bg-white rounded-[24px] border p-5"><p className="text-3xl">🎉</p><p className="text-[28px] font-black mt-2">{soldCount}</p><p className="text-zinc-500 text-xs font-bold">Sold</p><p className="text-zinc-400 text-xs font-bold mt-2">Keep going!</p></div>
              </div>
              <div className="bg-white rounded-[28px] border p-6 mt-4">
                <h3 className="font-black text-lg">Views Last 7 Days</h3>
                <div className="flex items-end gap-2 h-[180px] mt-6">{[60, 85, 50, 110, 95, 140, 175].map((h, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-2"><div className="w-full bg-gradient-to-t from-orange-500 to-pink-400 rounded-t-[12px]" style={{ height: `${h}px` }}></div><span className="text-[11px] font-bold text-zinc-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span></div>))}</div>
              </div>
              <div className="bg-white rounded-[28px] border p-6 mt-4"><h3 className="font-black text-lg">Top Performing Listings 🏆</h3><div className="space-y-3 mt-4">{properties.slice(0, 3).map((p, i) => (<div key={p.id} className="flex gap-3 items-center bg-zinc-50 rounded-[16px] p-3"><span className="font-black text-xl w-8 text-center">{i + 1}</span><img src={p.image_url} className="w-14 h-14 rounded-[12px] object-cover" /><div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{p.title}</p><p className="text-xs text-zinc-500">{p.location}</p></div><span className="font-black text-sm">👁️ {(1200 - i * 300).toLocaleString()}</span></div>))}{properties.length === 0 && <p className="text-zinc-500 text-sm">Thawama property na - add karala balanna.</p>}</div></div>
            </>
          )}

          {/* ================= PAYMENTS ================= */}
          {activeMenu === "Payments" && (
            <>
              <h1 className="text-[32px] font-black tracking-tight">Payments 💳</h1>
              <p className="text-zinc-500 text-sm">Boost payments & earnings.</p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#111111] text-white rounded-[28px] p-6"><p className="text-zinc-400 text-xs font-bold">TOTAL EARNINGS</p><p className="text-[32px] font-black mt-2">Rs. {(totalValue * 0.02).toLocaleString()}</p><p className="text-green-400 text-xs font-bold mt-1">↑ Commission 2%</p><div className="flex gap-2 mt-5"><button className="bg-white text-black px-4 py-2.5 rounded-full text-xs font-black flex-1">Withdraw →</button><button className="bg-white/10 px-4 py-2.5 rounded-full text-xs font-bold flex-1">History</button></div></div>
                <div className="bg-white rounded-[28px] border p-6"><p className="text-3xl">💰</p><p className="font-black mt-2">Boost Payment</p><p className="text-zinc-500 text-sm mt-1">Rs. 2,500 / listing - 10x views</p><button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold mt-4 w-full">Pay Now</button></div>
                <div className="bg-white rounded-[28px] border p-6"><p className="text-3xl">🧾</p><p className="font-black mt-2">Last Transaction</p><p className="text-zinc-500 text-sm mt-1">Boost - Colombo Villa</p><p className="font-black text-green-600 mt-2">Rs. 2,500 • Paid ✅</p></div>
              </div>
              <div className="bg-white rounded-[28px] border p-6 mt-4"><h3 className="font-black">Recent Transactions</h3><div className="mt-4 space-y-3">{[["Boost - Villa Colombo", "Rs. 2,500", "Paid ✅", "bg-green-50 text-green-600"], ["Boost - House Kandy", "Rs. 2,500", "Paid ✅", "bg-green-50 text-green-600"], ["Premium Plan", "Rs. 4,900", "Pending ⏳", "bg-yellow-50 text-yellow-600"]].map((t, i) => (<div key={i} className="flex justify-between items-center bg-zinc-50 rounded-[16px] p-4"><div><p className="font-bold text-sm">{t[0]}</p><p className="text-xs text-zinc-500">2026 • Card •••• 4242</p></div><div className="text-right"><p className="font-black text-sm">{t[1]}</p><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${t[3]}`}>{t[2]}</span></div></div>))}</div></div>
            </>
          )}

          {/* ================= SETTINGS ================= */}
          {activeMenu === "Settings" && (
            <>
              <h1 className="text-[32px] font-black tracking-tight">Settings ⚙️</h1>
              <p className="text-zinc-500 text-sm">Oge account eka manage karanna.</p>
              <div className="bg-white rounded-[28px] border p-6 mt-6 flex items-center gap-4"><span className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 text-white rounded-full flex items-center justify-center font-black text-2xl shrink-0">{user.email?.[0].toUpperCase()}</span><div><p className="font-black text-lg capitalize">{user.email?.split("@")[0]}</p><p className="text-zinc-500 text-sm">{user.email}</p><span className="text-[11px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold">● PREMIUM • VERIFIED</span></div><button className="ml-auto bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold">Edit Profile</button></div>
              <div className="bg-white rounded-[28px] border p-6 mt-4 space-y-4">
                <div><label className="text-sm font-bold">Full Name</label><input defaultValue={user.email?.split("@")[0]} className="w-full bg-zinc-100 rounded-full px-4 py-3 mt-1 text-sm outline-none" /></div>
                <div><label className="text-sm font-bold">Email</label><input defaultValue={user.email} disabled className="w-full bg-zinc-50 rounded-full px-4 py-3 mt-1 text-sm outline-none text-zinc-500" /></div>
                <div><label className="text-sm font-bold">Phone</label><input placeholder="+94 77 123 4567" className="w-full bg-zinc-100 rounded-full px-4 py-3 mt-1 text-sm outline-none" /></div>
                <div className="flex justify-between items-center bg-zinc-50 rounded-[16px] p-4"><div><p className="font-bold text-sm">🔔 Email Notifications</p><p className="text-xs text-zinc-500">New messages walata email enawa</p></div><span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">ON</span></div>
                <div className="flex justify-between items-center bg-zinc-50 rounded-[16px] p-4"><div><p className="font-bold text-sm">🌙 Dark Mode</p><p className="text-xs text-zinc-500">Night time walata</p></div><span className="bg-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold">OFF</span></div>
                <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm">Save Changes ✅</button>
                <button onClick={logout} className="block w-full bg-red-50 text-red-600 py-3 rounded-full font-bold text-sm mt-2">🚪 Logout</button>
              </div>
            </>
          )}

        </main>

        {/* ===== BOTTOM FLOATING NAV MOBILE ===== */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#111111] text-white rounded-full px-2 py-2 flex gap-1 shadow-2xl shadow-black/40 border border-white/10">
          <button onClick={() => setActiveMenu("Dashboard")} className={`w-11 h-11 flex items-center justify-center rounded-full text-xl ${activeMenu === "Dashboard" ? "bg-white text-black" : ""}`}>🏠</button>
          <button onClick={() => setActiveMenu("Favorites")} className={`w-11 h-11 flex items-center justify-center rounded-full text-xl ${activeMenu === "Favorites" ? "bg-white text-black" : ""}`}>❤️</button>
          <Link href="/dashboard/new" className="w-11 h-11 bg-orange-500 flex items-center justify-center rounded-full text-xl font-black">+</Link>
          <button onClick={() => setActiveMenu("Messages")} className={`w-11 h-11 flex items-center justify-center rounded-full text-xl ${activeMenu === "Messages" ? "bg-white text-black" : ""}`}>💬</button>
          <button onClick={() => setActiveMenu("Settings")} className={`w-11 h-11 flex items-center justify-center rounded-full text-xl ${activeMenu === "Settings" ? "bg-white text-black" : ""}`}>⚙️</button>
        </div>
      </div>
    </div>
  );
}