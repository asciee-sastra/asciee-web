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
  presidents: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fourthyr`, // 👈 presidents images in 4th year bucket
  secretaries: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thirdyr`,
  jointsecretaries: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/secondyr`, // 👈 joint secretaries images in 2nd year bucket
  heads: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thirdyr`,
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
  { label: "4th Year", key: "fourthyr" },
  { label: "3rd Year", key: "thirdyr" },
  { label: "2nd Year", key: "secondyr" },
];

export default function CoordinatorsPage() {
  const [presidents, setPresidents] = useState<Member[]>([]);
  const [secretaries, setSecretaries] = useState<Member[]>([]);
  const [jointSecretaries, setJointSecretaries] = useState<Member[]>([]);
  const [heads, setHeads] = useState<Member[]>([]);
  const [secondYr, setSecondYr] = useState<Member[]>([]);
  const [thirdYr, setThirdYr] = useState<Member[]>([]);
  const [fourthYr, setFourthYr] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "secondyr" | "thirdyr" | "fourthyr"
  >("fourthyr");

  useEffect(() => {
    const fetchData = async () => {
      const [presRes, secRes, jointRes, headsRes, second, third, fourth] =
        await Promise.all([
          supabase.from("presidents").select("*").order("id", { ascending: true }),
          supabase.from("secretaries").select("*").order("id", { ascending: true }),
          supabase.from("jointsec").select("*").order("id", { ascending: true }),
          supabase.from("heads").select("*").order("id", { ascending: true }),
          supabase.from("secondyr").select("*").order("id", { ascending: true }),
          supabase.from("thirdyr").select("*").order("id", { ascending: true }),
          supabase.from("fourthyr").select("*").order("id", { ascending: true }),
        ]);

      if (
        presRes.error ||
        secRes.error ||
        jointRes.error ||
        headsRes.error ||
        second.error ||
        third.error ||
        fourth.error
      ) {
        setErrorMsg(
          `${presRes.error?.message ?? ""} ${secRes.error?.message ?? ""}
          ${jointRes.error?.message ?? ""} ${headsRes.error?.message ?? ""}
          ${second.error?.message ?? ""} ${third.error?.message ?? ""}
          ${fourth.error?.message ?? ""}`.trim()
        );
      }

      setPresidents(presRes.data || []);
      setSecretaries(secRes.data || []);
      setJointSecretaries(jointRes.data || []);
      setHeads(headsRes.data || []);
      setSecondYr(second.data || []);
      setThirdYr(third.data || []);
      setFourthYr(fourth.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-24 py-10 text-lg font-medium text-muted-foreground">
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
    <div className="flex flex-wrap justify-center gap-6 mb-16 px-6 sm:px-12 md:px-24">
      {members.map((member) => (
        <Tilt
          key={member.id}
          rotationFactor={10}
          springOptions={{ stiffness: 150, damping: 12 }}
          className="flex-shrink-0 relative flex flex-col items-center rounded-3xl overflow-hidden shadow-lg border glass-card max-h-[480px]"
          style={{ width: "260px", height: "320px" }} // 👈 fixed size like before
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {member.path ? (
              <Image
                src={`${STORAGE[bucket]}/${member.path}`}
                alt={member.name}
                fill
                className="object-cover"
                loading="lazy"
                unoptimized
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
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Coordinators
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-300">
          The ones who make it all possible
        </p>
      </div>

      {/* Presidents Section */}
      {renderGrid(presidents, "presidents")}
      {/* Secretaries Section */}

      {renderGrid(secretaries, "secretaries")}
      {/* Joint Secretaries Section */}
      {renderGrid(jointSecretaries, "jointsecretaries")}

      {/* Heads Section */}
      <h1 className="flex items-center justify-center text-xl md:text-4xl font-bold mt-16 mb-8 text-white text-center">
       Cluster Heads
      </h1>
      {renderGrid(heads, "heads")}

      {/* Core Members Section */}
      <h1 className="flex items-center justify-center text-xl md:text-4xl font-bold mt-16 mb-4 text-white text-center">
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
