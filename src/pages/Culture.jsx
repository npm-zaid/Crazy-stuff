import React from 'react'
import {Twitter , Facebook , Instagram ,Linkedin} from 'lucide-react'
import Text1 from '../components/Text1'
import CultureShowcase from '../components/CultureShowcase';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useRef ,useEffect } from 'react';
import ASCIIWaveEffect from '../components/stuff/Asciiwaveeffect';
import Shieldlayout from '../components/stuff/Shieldlayout';
import Circletextanimation from '../components/stuff/Circletextanimation';
import Carousel from '../components/stuff/Carousel';
gsap.registerPlugin(ScrollTrigger)

const Culture = () => {

    const sections = [
  {
    id: 1,
    number: "01",
    title: "Tune in",
    desc:
      "We actually listen. We listen to everyone around us and respect each other's opinions, whether it’s our team, our clients, or our friends and family. Two heads are often better than one.",
    img: "https://kota-content.b-cdn.net/app/uploads/2023/11/culture-row-2-768x802.jpg",
  },
  {
    id: 2,
    number: "02",
    title: "Collaborate",
    desc:
      "We work together as a team, combining our strengths to solve challenges creatively and efficiently.",
    img: "https://kota-content.b-cdn.net/app/uploads/2023/11/culture-row-2-768x802.jpg",
  },
  {
    id: 3,
    number: "03",
    title: "Be Bold",
    desc:
      "We take creative risks, think differently, and push boundaries to create meaningful work.",
    img: "https://kota-content.b-cdn.net/app/uploads/2023/11/culture-row-2-768x802.jpg",
  },
  {
    id: 4,
    number: "04",
    title: "Grow",
    desc:
      "We constantly learn, evolve, and improve ourselves to deliver our best every day.",
    img: "https://kota-content.b-cdn.net/app/uploads/2023/11/culture-row-2-768x802.jpg",
  },
   {
    id: 5,
    number: "05",
    title: "Grow",
    desc:
      "We constantly learn, evolve, and improve ourselves to deliver our best every day.",
    img: "https://kota-content.b-cdn.net/app/uploads/2023/11/culture-row-2-768x802.jpg",
  },
];

const sectionRef = useRef(null);

useEffect(() => {
  const rows = gsap.utils.toArray(".culture-row");

  rows.forEach((row) => {
    const img = row.querySelector(".culture-img img");
    const text = row.querySelector(".culture-text");

    gsap.fromTo(
      row,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          toggleActions: 'play none none reverse'
        },
      }
    );

    // IMAGE ANIMATION
    gsap.fromTo(
      img,
      {
        scale: 0.8,
        rotate: -8,
        y: 50,
        opacity: 0,
      
      },
      {
        scale: 1,
        rotate: 0,
        y: 0,
        opacity: 1,
        
        ease: "elastic.out(1, 0.4)",
        duration: 1.6,
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
          toggleActions: 'play none none reverse'
        },
      }
    );

    // TEXT ANIMATION
    gsap.fromTo(
      text,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 75%",
          toggleActions: 'play none none reverse' 
        },
      }
    );
  });
}, []);


  return (
    <div>
      <Circletextanimation/>
       <Shieldlayout/>
      <ASCIIWaveEffect/>
      <Carousel/>
     
        <div className='min-h-screen relative '>

           <div className='absolute inset-0 z-0' >
             <video className='h-full w-full object-cover'  loop autoPlay muted src="https://kota-content.b-cdn.net/app/uploads/2024/02/culture-header.mp4"></video>
           </div>

           <div className='absolute inset-0 z-10 text-white px-24 bg-zinc-800/50 flex flex-col justify-between'>

  <div className="flex-1 flex items-center ">
    <h2 className='text-[7vw] leading-[7vw] max-w-[70%]'>
      Be part of a great team, but work from anywhere.
    </h2>
  </div>
   
 <h1 className=' text-[4vw] font-bold leading-[4vw] px-4 border-l-2 border-white'>
   culture
  </h1>

         </div>

       

        </div>

          {/* sec 2 */}
         <div className='px-20 py-10'>
            <h3 className='text-[4vw] leading-[4vw] max-w-[50%] ml-auto'>Why we love what we
                do, even on a Monday.
            </h3>
            <div className='flex justify-between'>
                <div className='text-[11vw] leading-[11vw]'>
                <Text1 text="OUR" />
                <h2 className='ml-[8vw]'><Text1 text="VALUES" /></h2>
                </div>

                <div className=' self-end flex gap-4'>
                    <div className='border-2 border-black p-3  rounded-full'><Twitter  size={30}/></div>
                    <div className='border-2 border-black p-3  rounded-full'> <Facebook  size={30}/></div>
                    <div className='border-2 border-black p-3  rounded-full'> <Instagram  size={30}/></div>
                    <div className='border-2 border-black p-3  rounded-full'><Linkedin  size={30}/></div>   
                </div>

            </div>
         </div>


         {/* sec 3  */}
    
<div className="w-full py-20 px-10 md:px-24" ref={sectionRef}>
  {sections.map((item, index) => {
    const isEven = index % 2 !== 0;

    return (
      <div
        key={item.id}
        className="culture-row grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-20 mb-32 opacity-0"
      >
        {/* LEFT / RIGHT */}
        {isEven ? (
          <>
            <div className="culture-img flex justify-center">
              <img
                src={item.img}
                className="w-full max-w-[500px] rounded-[40px] object-cover"
              />
            </div>

            <div className="culture-text">
              <h2 className="text-3xl font-light mb-3">{item.number}/</h2>
              <button className="px-8 py-3 bg-[#BAEEF2] rounded-full text-xl mb-6">
                {item.title}
              </button>
              <p className="text-lg font-light text-zinc-700 leading-relaxed max-w-[450px]">
                {item.desc}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="culture-text">
              <h2 className="text-3xl font-light mb-3">{item.number}/</h2>
              <button className="px-8 py-3 bg-[#BAEEF2] rounded-full text-xl mb-6">
                {item.title}
              </button>
              <p className="text-lg font-light text-zinc-700 leading-relaxed max-w-[450px]">
                {item.desc}
              </p>
            </div>

            <div className="culture-img flex justify-center">
              <img
                src={item.img}
                className="w-full max-w-[500px] rounded-[40px] object-cover"
              />
            </div>
          </>
        )}
      </div>
    );
  })}
</div>


    {/* sec 4 */}
    <CultureShowcase/>
         
    </div>
  )
}

export default Culture
