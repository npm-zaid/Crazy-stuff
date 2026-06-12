import React, { useEffect, useState } from 'react';
import gsap from 'gsap';



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
   gsap.fromTo('.sidebar',{
    opacity: 0,
    scale: 0,
    pointerEvents: 'none',
   },{
    opacity: isOpen ? 1 : 0,
    scale: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    duration: .5,
    ease: 'power3.inOut',
   })

  },[isOpen])

  return (
    <div className="fixed top-0 flex justify-between p-4 w-full z-50">
      <div>logo</div>

      <div className="border-2 border-black p-2 rounded-full">
        {/* HAMBURGER BUTTON */}
        <label className="hamburger cursor-pointer">
          <input 
            type="checkbox" 
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />
          <svg viewBox="0 0 32 32">
            <path
              className="line line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            ></path>
            <path className="line" d="M7 16 27 16"></path>
          </svg>
        </label>

        {/* SIDEBAR */}
        <div
          className={`sidebar h-[30vh] w-[30vw] absolute top-14 right-0 z-50 bg-amber-900/90 p-4 rounded-md transition-all duration-300 
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        >
          <div className="text-white">Home</div>
          <div className="text-white">Work</div>
          <div className="text-white">Contact</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
