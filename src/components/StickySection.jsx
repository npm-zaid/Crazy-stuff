import React, { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const StickySection = () => {
    const arr =[{bg:'bg-[#5227FF]'},{bg:'bg-[#FF9FFC]'},{bg:'bg-[#B19EEF]'},{bg:'bg-[#5227FF]'},{bg:'bg-[#FF9FFC]'}]

    useEffect(()=>{
        
        gsap.utils.toArray('.card').forEach((card,index)=>{
            gsap.fromTo(card,{
                scale:1,
                opacity:1,
                rotateZ:0,
            },{
                scale:.8,
                opacity:.5,
                rotateZ:5,
                
                scrollTrigger:{
                    trigger:card,
                    start:'top top',
                    end:'bottom top',
                    scrub:true,
                    
                }
            })
        })
     
    })

  return (
    <div className='min-h-screen'>
        <h1 className='text-8xl text-center my-20'>Our Services</h1>
        {arr.map((item,index)=>{
            return(
                <div key={index} className={`h-screen  w-[95%] rounded-[5vw] m-auto card sticky top-0  grid grid-cols-2 bg-white`}>
                    <div className='flex flex-col justify-center  gap-6 p-8'>
                        <h2 className='text-[6vw] leading-[7vw] font-semibold '>Web design & development</h2>
                        <div className='flex flex-wrap gap-5'>
                            <div className='px-4 py-2 rounded-full border border-zinc-400'>web Design</div>
                            <div className='px-4 py-2 rounded-full border border-zinc-400'>web Development</div>
                            <div className='px-4 py-2 rounded-full border border-zinc-400'>web Design</div>
                            <div className='px-4 py-2 rounded-full border border-zinc-400'>web Development</div>
                        </div>
                        <p>Crafting digital experiences where beauty meets ROI, turning heads and unlocking revenue potential with every click.</p>
                         <div className='px-4 py-2 rounded-full border border-zinc-400 w-fit'>Button</div>
                    
                    </div>

                    <div >
                        <div className='p-8 rounded-tr-[35vw] overflow-hidden'>
                           <video className='w-full h-full object-cover' src="https://kota-content.b-cdn.net/app/uploads/2024/02/homepage.mp4" autoPlay loop muted></video> 
                        </div>
                       
                    </div>
                </div>
            )
        })}
        </div>
  )
}

export default StickySection