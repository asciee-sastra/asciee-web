import React from "react";
import Image from "next/image";
import design from "@/public/design.jpg";
import content from "@/public/content.jpg";
import inventory from "@/public/inventory.jpg";
import pr from "@/public/pr.jpg";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";

const Clusters = () => {
  const teams = [
    { id: 1, image: design, title: "Design" },
    { id: 2, image: pr, title: "Promotions and Outreach" },
    { id: 3, image: content, title: "Content Writing" },
    { id: 4, image: inventory, title: "Inventory Management" },
  ];

  return (
    <div className="w-full flex flex-col mb-16 items-center text-center">
      <h2 className="text-4xl text-white font-bold mb-6">Clusters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="relative w-[320px] h-[320px] rounded-4xl overflow-hidden group cursor-pointer"
          >
            {/* Image */}
            <Image
              src={team.image}
              alt={team.title}
              width={300}
              height={300}
              className="w-full h-full rounded-4xl object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Progressive blur caption */}
            <ProgressiveBlur height="25%" position="bottom" />
            <div
              className="overflow-hidden text-xl text-black font-semibold z-50 absolute bottom-0 left-0 right-0 p-2 text-center
                transition-all duration-500 transform group-hover:scale-110 group-hover:opacity-90"
            >
              {team.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clusters;
