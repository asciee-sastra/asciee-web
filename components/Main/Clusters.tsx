"use client"

import React from "react";
import Image from "next/image";
import op_adm from "@/public/operation_admin.jpg";
import cre_media from "@/public/creative_media.jpg";
//import content from "@/public/content.jpg";
//import ind_re from "@/public/industrial_relation.jpg";
import tec_afr from  "@/public/Technical_affairs.jpg";
import ext from "@/public/External_Relation_colabration.jpg"
const teams = [
  { id: 1, image: op_adm, title: "Operation&Admin" },
  { id: 2, image: cre_media, title: "Creative Media/Design Team" },
 // { id: 3, image: content, title: "Content Team" },
  //{ id: 4, image: ind_re, title: "Industrial Relation" },
  { id: 3, image: tec_afr, title: "Technical Affairs" },
  {id: 4,image: ext,title: "External Relation & Colabration" },
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
            className="group flex flex-col items-center rounded-3xl overflow-hidden shadow-lg border glass-card px-2 py-2 max-h-[500px] transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden mb-4">
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
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
