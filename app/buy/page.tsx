"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function BuyPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
      setProperties(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = properties.filter((p) =>
    (p.title + " " + p.location).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Buy Property</h1>
      <p className="text-gray-500 mb-4">Sell karanna thiyena okkoma property tika meke thiyenawa</p>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Colombo, Kandy, Galle... search karanna" className="w-full border p-3 rounded-lg mb-4" />
      <div className="mb-6 rounded-xl overflow-hidden border">
        <iframe src="https://www.google.com/maps?q=Colombo,Sri+Lanka&output=embed" width="100%" height="350" style={{ border: 0 }} loading="lazy"></iframe>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.length === 0 && <p>Thawama property nehe. Sell karala add karanna!</p>}
        {filtered.map((p) => (
          <Link key={p.id} href={`/property/${p.id}`} className="border rounded-xl overflow-hidden hover:shadow-lg">
            <img src={p.image_url || "https://via.placeholder.com/400"} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-bold text-lg">{p.title}</h2>
              <p className="text-gray-500">{p.location}</p>
              <p className="text-blue-600 font-bold mt-2">Rs. {Number(p.price).toLocaleString()}</p>
              <p className="text-sm mt-1">{p.bedrooms} Bed • {p.bathrooms} Bath • {p.area} sqft</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg w-full">View Details</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
