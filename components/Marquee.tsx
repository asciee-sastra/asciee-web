import React from 'react'
import Image from 'next/image'
import vv from "@/public/vv_illus.png"

const Marquee = () => {
  return (
    
  <div className="mt-8 mx-auto flex items-center justify-center w-full max-w-6xl">
    <Image 
      src={vv} 
      alt="Department Building Illustration" 
      className="w-full h-auto"
    />
  </div>
  )
}

export default Marquee
