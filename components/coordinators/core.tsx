"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { User } from "lucide-react";
import { Tilt } from "@/components/motion-primitives/tilt";
import { AnimatePresence, motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STORAGE = {
  secondyr: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/secondyr`,
  thirdyr: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thirdyr`,
  fourthyr: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fourthyr`,
};

type Member = {
  id: string;
  name: string;
  role: string;
  path?: string;
};

const tabs: { label: string; key: "secondyr" | "thirdyr" | "fourthyr" }[] = [
  { label: "2nd Year", key: "secondyr" },
  { label: "3rd Year", key: "thirdyr" },
  { label: "4th Year", key: "fourthyr" },
];

export default function CoordinatorsPage() {
  const [secondYr, setSecondYr] = useState<Member[]>([]);
  const [thirdYr, setThirdYr] = useState<Member[]>([]);
  const [fourthYr, setFourthYr] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"secondyr" | "thirdyr" | "fourthyr">("secondyr");

  useEffect(() => {
    const fetchData = async () => {
      const [second, third, fourth] = await Promise.all([
        supabase.from("secondyr").select("*"),
        supabase.from("thirdyr").select("*"),
        supabase.from("fourthyr").select("*"),
      ]);

      if (second.error || third.error || fourth.error) {
        setErrorMsg(
          `${second.error?.message ?? ""} ${third.error?.message ?? ""} ${fourth.error?.message ?? ""}`.trim()
        );
      }

      setSecondYr(second.data || []);
      setThirdYr(third.data || []);
      setFourthYr(fourth.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-lg font-medium text-muted-foreground">
        Loading coordinators...
      </p>
    );

  if (errorMsg)
    return (
      <p className="text-center py-10 text-lg font-medium text-red-400">
        ⚠️ {errorMsg}
      </p>
    );

  const renderGrid = (members: Member[], bucket: keyof typeof STORAGE) => (
    <div className="grid gap-6 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member) => (
        <Tilt
          key={member.id}
          rotationFactor={10}
          springOptions={{ stiffness: 150, damping: 12 }}
          className="relative flex flex-col items-center rounded-3xl overflow-hidden shadow-lg border glass-card w-fit max-h-[480px]"
        >
          <div className="relative w-[260px] h-[320px] rounded-2xl overflow-hidden">
            {member.path ? (
              <Image
                src={`${STORAGE[bucket]}/${member.path}`}
                alt={member.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                <User className="w-10 h-10" />
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 bg-gradient-to-r from-black/70 via-black/40 to-black/70 backdrop-blur-lg border border-white/10 text-white px-5 py-2 rounded-full shadow-lg flex flex-col items-center">
              <h3 className="text-sm font-semibold">{member.name}</h3>
              <p className="text-xs text-gray-200">{member.role}</p>
            </div>
          </div>
        </Tilt>
      ))}
    </div>
  );

  return (
    <section className="mt-24 mb-6 bg-transparent px-6">
      <h1 className="flex items-center justify-center text-xl md:text-4xl font-bold mb-4 text-white text-center">
        Core Members
      </h1>

      <div className="w-fit mx-auto">
        {/* Tabs */}
        <div className="flex w-fit mx-auto items-center gap-2 bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10 z-10 mb-6">
          {tabs.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center justify-center px-4 py-2 cursor-pointer rounded-full text-sm transition ${
                activeTab === key
                  ? "text-white bg-gradient-to-r from-[#720E9E] to-[#9D4EDD]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content with fade animation */}
        <AnimatePresence mode="wait">
          {activeTab === "secondyr" && (
            <motion.div
              key="secondyr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderGrid(secondYr, "secondyr")}
            </motion.div>
          )}
          {activeTab === "thirdyr" && (
            <motion.div
              key="thirdyr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderGrid(thirdYr, "thirdyr")}
            </motion.div>
          )}
          {activeTab === "fourthyr" && (
            <motion.div
              key="fourthyr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderGrid(fourthYr, "fourthyr")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
