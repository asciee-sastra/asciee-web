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
  presidents: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fourthyr`,
  secretaries: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thirdyr`,
  jointsecretaries: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/secondyr`,
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

const formatRole = (role: string) =>
  role
    .replace(/^Technical Affairs\s*-\s*/i, "")
    .replace(/^Operations & Admin\s*-\s*/i, "")
    .replace(/^External Relations\s*-\s*/i, "")
    .trim();

const yearTabs: { label: string; key: "secondyr" | "thirdyr" | "fourthyr" }[] = [
  { label: "4th Year", key: "fourthyr" },
  { label: "3rd Year", key: "thirdyr" },
  { label: "2nd Year", key: "secondyr" },
];

type HeadsTabKey = "clusterheads" | "technicalaffairs" | "opsadmin" | "externalrelations";

const headsTabs: { label: string; key: HeadsTabKey; filter: (role: string) => boolean }[] = [
  {
    label: "Cluster Heads",
    key: "clusterheads",
    filter: (role) =>
      !role.startsWith("Technical Affairs") &&
      !role.startsWith("Operations & Admin") &&
      !role.startsWith("External Relations"),
  },
  {
    label: "Technical Affairs",
    key: "technicalaffairs",
    filter: (role) => role.startsWith("Technical Affairs"),
  },
  {
    label: "Operations & Admin",
    key: "opsadmin",
    filter: (role) => role.startsWith("Operations & Admin"),
  },
  {
    label: "External Relations",
    key: "externalrelations",
    filter: (role) => role.startsWith("External Relations"),
  },
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

  const [activeYearTab, setActiveYearTab] = useState<"secondyr" | "thirdyr" | "fourthyr">("fourthyr");
  const [activeHeadsTab, setActiveHeadsTab] = useState<HeadsTabKey>("clusterheads");

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
          style={{ width: "260px", height: "320px" }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {member.path ? (
              <Image
                src={`${STORAGE[bucket]}/${member.path}`}
                alt={member.name}
                fill
                placeholder="blur"
                blurDataURL="/asciee.jpg"
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
              <p className="text-xs text-gray-200">{formatRole(member.role)}</p>
            </div>
          </div>
        </Tilt>
      ))}
      {members.length === 0 && (
        <p className="text-center text-gray-400 py-10">No members found.</p>
      )}
    </div>
  );

  const activeHeadsFilter = headsTabs.find((t) => t.key === activeHeadsTab)!.filter;
  const filteredHeads = heads.filter((m) => activeHeadsFilter(m.role));

  return (
    <section className="mt-24 mb-6 bg-transparent px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-sm">
          Coordinators
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-300">
          The ones who make it all possible
        </p>
      </div>

      {renderGrid(presidents, "presidents")}
      {renderGrid(secretaries, "secretaries")}
      {renderGrid(jointSecretaries, "jointsecretaries")}

      <h1 className="flex items-center justify-center text-xl md:text-4xl font-bold mt-16 mb-4 text-white text-center">
        Cluster Heads
      </h1>

      <div className="w-fit mx-auto">
        <div className="flex w-fit mx-auto items-center gap-2 bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10 z-10 mb-6 flex-wrap justify-center">
          {headsTabs.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setActiveHeadsTab(key)}
              className={`flex items-center justify-center px-4 py-2 cursor-pointer rounded-full text-sm transition whitespace-nowrap ${
                activeHeadsTab === key
                  ? "text-white bg-gradient-to-r from-[#720E9E] to-[#9D4EDD]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeHeadsTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderGrid(filteredHeads, "heads")}
          </motion.div>
        </AnimatePresence>
      </div>

      <h1 className="flex items-center justify-center text-xl md:text-4xl font-bold mt-16 mb-4 text-white text-center">
        Core Members
      </h1>

      <div className="w-fit mx-auto">
        <div className="flex w-fit mx-auto items-center gap-2 bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10 z-10 mb-6">
          {yearTabs.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setActiveYearTab(key)}
              className={`flex items-center justify-center px-4 py-2 cursor-pointer rounded-full text-sm transition ${
                activeYearTab === key
                  ? "text-white bg-gradient-to-r from-[#720E9E] to-[#9D4EDD]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeYearTab === "secondyr" && (
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
          {activeYearTab === "thirdyr" && (
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
          {activeYearTab === "fourthyr" && (
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
