"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Cable, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Misc = {
  id: number;
  name: string;
};

export default function MiscComponents() {
  const [misc, setMisc] = useState<Misc[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchLumps = async () => {
      const { data, error } = await supabase.from("miscellaneous").select("*");
      if (error) {
        setErrorMsg(error.message);
      } else {
        setMisc(data || []);
      }
      setLoading(false);
    };
    fetchLumps();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        Loading Miscellaneous Components...
      </p>
    );

  if (errorMsg)
    return (
      <p className="text-center py-10 text-lg font-medium text-red-400">
        ⚠️ {errorMsg}
      </p>
    );

  if (misc.length === 0)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        No Miscellaneous Components found.
      </p>
    );

  const visibleMisc = misc.slice(0, visibleCount);

  return (
    <section className="mt-8 bg-transparent px-6">
      <h1 className="text-center text-2xl md:text-4xl font-bold mb-6 text-white">
        Miscellaneous Components
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleMisc.map((misc ) => (
          <Card
            key={misc.id}
            className="group flex flex-col items-center justify-center rounded-3xl overflow-hidden 
                       shadow-lg border bg-white/5 backdrop-blur-md border-white/10 px-4 py-6 
                       transition-transform duration-500 hover:scale-105 hover:shadow-2xl text-center"
          >
            <Cable className="w-8 h-8 mb-3 text-primary" />
            <h2 className="text-lg font-semibold text-white">{misc.name}</h2>
          </Card>
        ))}
      </div>

      {/* Show More / Show Less */}
      {misc.length > visibleCount && (
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
