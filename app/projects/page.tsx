"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Main/Navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
};

function Tag({ text }: { text: string }) {
  return (
    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white">
      {text}
    </span>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="glass-card overflow-hidden transition-transform transform hover:-translate-y-1">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white">{p.title}</h3>
        <p className="mt-3 text-md text-gray-300">{p.description}</p>
        {p.tags?.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {p.tags.map((t, i) => (
              <Tag key={i} text={t} />
            ))}
          </div>
        )}
        
      </div>
    </article>
  );
}

export default function AscieeProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, tags")
        .order("id", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center text-white p-8">Loading projects...</div>;
  }

  if (errorMsg) {
    return <div className="text-center text-red-400 p-8">{errorMsg}</div>;
  }

  return (
    <>
    <Navbar />
    <section
      id="projects"
      className="p-8 mt-20"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-6">Ongoing Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-400">No projects available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
    </>
  );
}
