"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { CircuitBoard, Package } from "lucide-react";
import { Button } from "@/components/ui/button"; // shadcn button

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/components/mcus`;

type MCU = {
  id: number;
  name: string;
  path?: string;
  stock: number;
};

export default function Mcus() {
  const [mcus, setMcus] = useState<MCU[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchMcus = async () => {
      const { data, error } = await supabase.from("mcus").select("*");
      if (error) {
        setErrorMsg(error.message);
      } else {
        setMcus(data || []);
      }
      setLoading(false);
    };
    fetchMcus();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        Loading MCUs...
      </p>
    );

  if (errorMsg)
    return (
      <p className="text-center py-10 text-lg font-medium text-red-400">
        ⚠️ {errorMsg}
      </p>
    );

  if (mcus.length === 0)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        No MCUs found.
      </p>
    );

  return (
    <section className="mt-4 bg-transparent px-6">
      <h1 className="flex items-center justify-center text-xl md:text-4xl font-bold mb-4 text-white text-center">
        Microcontrollers & Components
      </h1>

      <div className="grid gap-4 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mcus.map((mcu) => (
          <div
            key={mcu.id}
            className="group flex flex-col items-center rounded-3xl overflow-hidden shadow-lg border glass-card w-fit px-2 py-2 max-h-[500px] transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative w-[280px] h-[280px] rounded-2xl overflow-hidden mb-4 bg-white">
              {mcu.path ? (
                <Image
                  src={`${STORAGE_URL}/${mcu.path}`}
                  alt={mcu.name}
                  fill
                  className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Centered Details */}
            <h3 className="text-lg font-semibold mb-2 text-white text-center">
              {mcu.name}
            </h3>
            <p className="flex items-center gap-2 bg-foreground text-md text-white rounded-3xl px-5 py-2 border border-white/20 backdrop-blur-sm hover:scale-105 hover:bg-white/20 hover:text-white transition-all">
              <Package className="w-4 h-4 inline-block" />
              In Stock:
              <span
                className={
                  mcu.stock > 0
                    ? "font-semibold text-green-500"
                    : "font-semibold text-red-400 text-2xl"
                }
              >
                {mcu.stock}
              </span>
            </p>
          </div>
        ))}
      </div>

    
    </section>
  );
}
