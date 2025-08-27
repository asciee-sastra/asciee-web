import Image from 'next/image'
import React from 'react'
import logo from "@/public/asciee.jpg"
import { Tilt } from './motion-primitives/tilt'
import vv from "@/public/vv_illus.png"
import { Button } from './ui/button'

const Hero = () => {
  return (
    <>
    <div 
      className="w-full z-50 mt-8 flex flex-col justify-center items-center relative" 
      >
      <Tilt rotationFactor={24} isRevese>
        <Image 
          src={logo} 
          width={280} 
          height={280} 
          alt="ASCIEE Logo" 
          className="rounded-full" 
        />
      </Tilt>
      <div className='flex justify-center flex-col items-center'>
        <div><h1 className="text-5xl font-bold text-white">ASCIEE</h1></div>
        <p className='text-xl text-center w-3/4 md:w-1/2 text-white'>Association for the Students of Communication, Instrumentation, Electrical & Electronics</p>
        <div className='flex justify-center mt-4 items-center gap-4'>
          <Button className='bg-foreground/80 rounded-4xl p-5 text-white '>Upcoming Events</Button>
          <Button className='bg-foreground/80 rounded-4xl p-5 text-white '>Inventory</Button>
        </div>
      </div>
    </div>
    
    
  </>
  )
}

export default Hero
