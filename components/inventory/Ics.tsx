"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microchip } from "lucide-react"; // icon for IC

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type IC = {
  id: number;
  name: string;
  stock: number;
};

export default function ICsList() {
  const [ics, setICs] = useState<IC[]>([]);

  useEffect(() => {
    const fetchICs = async () => {
      const { data } = await supabase.from("ics").select();
      if (data) setICs(data);
    };
    fetchICs();
  }, []);

  return (
    <div className="p-6">
      {/* Top Heading */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Microchip className="w-6 h-6 text-primary" />
        ICs
      </h1>

      {/* IC List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ics.map((ic) => (
          <Card key={ic.id} className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{ic.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Stock: <span className="font-semibold">{ic.stock}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
