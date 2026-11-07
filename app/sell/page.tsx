"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SellPage() {
  const [form, setForm] = useState({ title: "", price: "", location: "", bedrooms: "3", bathrooms: "2", area: "", description: "", image_url: "" });
  const [msg, setMsg] = useState("");

  const handle = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e: any) {
    e.preventDefault();
    setMsg("Saving...");
    const { error } = await supabase.from("properties").insert([{ title: form.title, price: Number(form.price), location: form.location, bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), area: Number(form.area), description: form.description, image_url: form.image_url }]);
    if (error) setMsg("Error: " + error.message);
    else { setMsg("✅ Property eka add una! Buy page eke penawa!"); setForm({ title: "", price: "", location: "", bedrooms: "3", bathrooms: "2", area: "", description: "", image_url: "" }); }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-1">Sell Your Property</h1>
      <p className="text-gray-500 mb-6">Form eka purawala Sell karanna</p>
      <form onSubmit={submit} className="space-y-3">
        <input name="title" value={form.title} onChange={handle} required placeholder="Title - Ex: 3 Bed House in Colombo" className="w-full border p-3 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" value={form.price} onChange={handle} required type="number" placeholder="Price - Rs." className="border p-3 rounded-lg" />
          <input name="location" value={form.location} onChange={handle} required placeholder="Location - Ex: Colombo 03" className="border p-3 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input name="bedrooms" value={form.bedrooms} onChange={handle} type="number" placeholder="Bedrooms" className="border p-3 rounded-lg" />
          <input name="bathrooms" value={form.bathrooms} onChange={handle} type="number" placeholder="Bathrooms" className="border p-3 rounded-lg" />
          <input name="area" value={form.area} onChange={handle} type="number" placeholder="Area sqft" className="border p-3 rounded-lg" />
        </div>
        <input name="image_url" value={form.image_url} onChange={handle} placeholder="Photo Link - https://..." className="w-full border p-3 rounded-lg" />
        <textarea name="description" value={form.description} onChange={handle} placeholder="Description..." className="w-full border p-3 rounded-lg h-24" />
        <div className="rounded-xl overflow-hidden border">
          <p className="p-2 text-sm font-bold">📍 Map Preview - {form.location || "Location eka gahanna"}</p>
          <iframe src={`https://www.google.com/maps?q=${form.location || "Colombo,Sri Lanka"}&output=embed`} width="100%" height="250" style={{ border: 0 }} loading="lazy"></iframe>
        </div>
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">Sell Karanna - Publish</button>
        {msg && <p className="text-center font-bold">{msg}</p>}
      </form>
    </div>
  );
}
