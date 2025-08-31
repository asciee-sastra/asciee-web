"use client"

import React from "react";
import Image from "next/image";
import design from "@/public/design.jpg";
import content from "@/public/content.jpg";
import inventory from "@/public/inventory.jpg";
import pr from "@/public/pr.jpg";

const teams = [
  { id: 1, image: design, title: "Design" },
  { id: 2, image: pr, title: "Promotions & Outreach" },
  { id: 3, image: content, title: "Content Writing" },
  { id: 4, image: inventory, title: "Inventory Management" },
];

export default function Clusters() {
  return (
    <section className="w-full flex flex-col items-center text-center mb-16">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight">
        Clusters
      </h2>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map(({ id, image, title }) => (
          <div
            key={id}
            className="group flex flex-col items-center rounded-3xl overflow-hidden shadow-lg border border-white/10 
                       bg-foreground backdrop-blur-xl px-2 py-2 max-h-[500px] transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden mb-4">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Text */}
            <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
