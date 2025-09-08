"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { CircuitBoard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/components/sensors`;

type Sensor = {
  id: number;
  name: string;
  path?: string;
  stock: number;
};

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchSensors = async () => {
      const { data, error } = await supabase.from("sensors").select("*");
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSensors(data || []);
      }
      setLoading(false);
    };
    fetchSensors();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        Loading Sensors...
      </p>
    );

  if (errorMsg)
    return (
      <p className="text-center py-10 text-lg font-medium text-red-400">
        ⚠️ {errorMsg}
      </p>
    );

  if (sensors.length === 0)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        No Sensors found.
      </p>
    );

  // Only show up to visibleCount
  const visibleSensors = sensors.slice(0, visibleCount);

  return (
    <section className="mt-24 bg-transparent px-6">
      <h1 className="flex items-center justify-center text-2xl md:text-4xl font-bold mb-4 text-white">
        Sensors
      </h1>

      <div className="grid gap-4 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleSensors.map((sensor) => (
          <div
            key={sensor.id}
            className="group flex flex-col items-center rounded-3xl overflow-hidden shadow-lg border glass-card px-2 py-2 max-h-[500px] transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative w-[280px] h-[280px] rounded-2xl overflow-hidden mb-4">
              <Image
                unoptimized
                src={`${STORAGE_URL}/${sensor.path}`}
                alt={sensor.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Text */}
            <h3 className="text-lg font-semibold mb-1 text-white text-center">
              {sensor.name}
            </h3>
            <p className="flex items-center gap-2 bg-foreground/70 text-md text-white rounded-3xl px-5 py-2 border border-white/20 backdrop-blur-sm hover:scale-105 hover:bg-white/20 hover:text-white transition-all">
              <Package className="w-4 h-4 inline-block" />
              In Stock:
              <span className="font-semibold text-green-500">
                {sensor.stock}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {sensors.length > visibleCount && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="flex items-center gap-2 bg-foreground/70 text-md text-white rounded-3xl px-8 py-5 border border-white/20 backdrop-blur-sm hover:scale-105 hover:bg-white/20 hover:text-white transition-all"
            variant="secondary"
          >
            Show More
          </Button>
        </div>
      )}

      {visibleCount > 6 && (
        <div className="flex justify-center mt-3">
          <Button
            onClick={() => setVisibleCount(6)}
            className="flex items-center gap-2 bg-red-500/80 text-md text-white rounded-3xl px-8 py-5 border border-white/20 backdrop-blur-sm hover:scale-105 hover:bg-red-600 hover:text-white transition-all"
            variant="secondary"
          >
            Show Less
          </Button>
        </div>
      )}
    </section>
  );
}
