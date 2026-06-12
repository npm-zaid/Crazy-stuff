import React, { useEffect } from 'react'
import gsap from 'gsap'

const Marquee = () => {
  useEffect(()=>{
    gsap.to('.mover',{
      xPercent:-100,
      duration:300,
      repeat:-1,
      yoyo:true,
      
    })
  })
  return (
    <div className='min-h-screen bg-black relative'>
        <video className='w-1/2 h-[95%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '  loop muted autoPlay src="https://kota-content.b-cdn.net/app/uploads/2024/01/blob-loop-uncompressed_1706098182.mp4"></video>
       <div className='inset-0 absolute flex flex-col justify-center items-center gap-4 text-white'>
        <h3 className='text-[2vw] uppercase'>Celebrating 12 years</h3>

       <div className='mover  flex gap-8 '>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
         <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
         <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
        <h1 className='text-[12vw]'>KOTAVERSE</h1>
       </div>

       <div className='px-6 py-2 border-2 border-white rounded-full'>explore</div>

       </div>
    </div>
  )
}

export default Marquee

