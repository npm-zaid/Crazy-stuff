import React, { useState } from 'react';

export default function GooCardReveal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#ECECEC] p-4 selection:bg-purple-200">
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Open+Sans');
        .font-opensans { font-family: 'Open Sans', sans-serif; }
        
        /* Custom timing and layout vars matching the original pen */
        :root {
          --color-primary: #6B04FF;
          --duration: .5s;
          --lag-duration: calc(var(--duration) * 1.5);
          --easing: cubic-bezier(.7, 0, .2, 1);
        }

        /* SVG Filter Layering Keyframes */
        .animate-up-down {
          animation: up-down var(--lag-duration) var(--easing) both;
        }
        .animate-down-up {
          animation: down-up var(--lag-duration) var(--easing) both;
        }

        @keyframes up-down {
          0%, 100% { transform: none; }
          20% { transform: scale(.75, 1.25) translateY(-100%); }
        }
        @keyframes down-up {
          0%, 20%, 100% { transform: none; }
          30% { transform: scale(.75, 1.25) translateY(100%); }
        }
      `}</style>

      {/* Hidden SVG Gooey Filter */}
      <svg className="absolute top-0 left-0 invisible w-px h-px" viewBox="0 0 1 1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -20" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Application Grid Wrapper */}
      <div className="font-opensans text-white text-[3vmin] grid grid-gap-[7vmin] grid-template-rows-[2fr_1fr] grid-template-columns-[1fr] p-[10vmin] relative">
        
        {/* Background Goo Layers */}
        <div 
          className="col-start-1 row-start-1 row-end-3 grid z-[-1]"
          style={{ filter: "url(#goo)", gridTemplate: 'inherit' }}
        >
          {/* Main Card Background */}
          <div className="bg-[#6B04FF] rounded-[5vmin] w-[40vmin] h-[40vmin] relative transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)]">
            <div className={`absolute bottom-0 left-[5%] h-[10vmin] w-[7vmin] bg-[#6B04FF] rounded-[5vmin] ${isOpen ? 'animate-down-up' : ''}`} />
            <div 
              className={`absolute bottom-0 left-[30%] h-[10vmin] w-[14vmin] bg-[#6B04FF] rounded-[5vmin] ${isOpen ? 'animate-down-up' : ''}`} 
              style={isOpen ? { animationDuration: 'calc(var(--lag-duration) * 1.2)' } : {}}
            />
            <div className={`absolute bottom-0 right-[2%] h-[12vmin] w-[7vmin] bg-[#6B04FF] rounded-[5vmin] ${isOpen ? 'animate-down-up' : ''}`} />
          </div>

          {/* Slid-out Description Background */}
          <div 
            className="bg-[#6B04FF] rounded-[5vmin] relative transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
            style={{ transform: isOpen ? 'translateY(0)' : 'translateY(-140%)' }}
          >
            <div className={`absolute top-0 left-[7%] h-[10vmin] w-[7vmin] bg-[#6B04FF] rounded-[5vmin] ${isOpen ? 'animate-up-down' : ''}`} />
            <div 
              className={`absolute top-0 left-[35%] h-[10vmin] w-[14vmin] bg-[#6B04FF] rounded-[5vmin] ${isOpen ? 'animate-up-down' : ''}`} 
              style={isOpen ? { animationDuration: 'calc(var(--lag-duration) * 1.2)' } : {}}
            />
            <div className={`absolute top-0 right-[4%] h-[12vmin] w-[7vmin] bg-[#6B04FF] rounded-[5vmin] ${isOpen ? 'animate-up-down' : ''}`} />
          </div>
        </div>

        {/* Foreground Content Card */}
        <div className="z-30 col-start-1 row-start-1 w-[40vmin] h-[40vmin] flex flex-col justify-center items-center text-center p-4 relative">
          <div className="w-[15vmin] h-[15vmin] bg-white flex justify-center items-center rounded-[5vmin] mb-[3vmin] text-[7vmin] select-none shadow-sm">
            💺
          </div>
          <header className="text-[1.2em] font-semibold">Un sillón</header>
          <p className="text-[3vmin] leading-tight text-white/80 m-2">
            🔈 see-yawn
          </p>
          
          {/* Action Trigger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle description"
            className="cursor-pointer rounded-[3vmin] flex justify-center items-center w-[10vmin] h-[10vmin] absolute -bottom-[5vmin] z-50 bg-white text-black shadow-[0_2vmin_2vmin_rgba(0,0,0,0.2)] transition-transform duration-250 ease-[cubic-bezier(.7,0,.2,1)] hover:scale-90 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-purple-400"
          >
            <span 
              className={`absolute h-[2vmin] w-[2vmin] border-b-[0.5vmin] border-r-[0.5vmin] border-black transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
                isOpen ? 'rotate-[-135deg] -translate-y-[0.25vmin]' : 'rotate-[45deg] -translate-y-[0.5vmin]'
              }`}
            />
          </button>
        </div>

        {/* Slid-out Description Text */}
        <div 
          className="row-start-2 col-start-1 w-[40vmin] z-20 flex flex-col justify-center items-center text-center p-4 transition-all duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
          style={{ 
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-80%)'
          }}
        >
          <header className="text-[1.2em] font-semibold">A chair!</header>
          <p className="text-white/80 m-2 text-[0.9em]">
            We literally did an entire episode on chairs.
          </p>
        </div>

      </div>
    </div>
  );
}