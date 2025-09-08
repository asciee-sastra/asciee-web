import React from "react";
import Image from "next/image";
import { Marquee } from "../magicui/marquee";

const MarqueeImg = () => {
  const imgurl = [
    "https://wfnzbcuxhjvjwmazysms.supabase.co/storage/v1/object/public/marquee/1.jpg",
    "https://wfnzbcuxhjvjwmazysms.supabase.co/storage/v1/object/public/marquee/3.jpg",
    "https://wfnzbcuxhjvjwmazysms.supabase.co/storage/v1/object/public/marquee/IMG_20250228_162950.jpg",
    "https://wfnzbcuxhjvjwmazysms.supabase.co/storage/v1/object/public/marquee/IMG_20250413_164116.jpg",
    "https://wfnzbcuxhjvjwmazysms.supabase.co/storage/v1/object/public/marquee/IMG_5864.JPG",
  ];

  return (
    <div className="mt-16 mx-auto h-[450px] md:h-[600px] w-full max-w-7xl relative">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('/vv_illus_mob.png')] md:bg-[url('/vv_illus.png')] w-11/12 mx-auto bg-no-repeat bg-contain bg-center" />

      {/* Marquee overlay */}
      <div className="absolute md:-top-12 left-0 w-full px-2 sm:px-4">
        <Marquee pauseOnHover className="gap-4 sm:gap-6 md:gap-8">
          {imgurl.map((src, i) => (
            <div
              key={i}
              className="relative h-32 w-56 sm:h-36 sm:w-56 md:h-56 md:w-80 flex-shrink-0"
            >
              <Image
                src={src}
                alt={`marquee-img-${i}`}
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default MarqueeImg;
