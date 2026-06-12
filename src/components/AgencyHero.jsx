import React, { useEffect, useRef, useState } from 'react';

const logo = "https://kota-content.b-cdn.net/app/uploads/2023/10/cssda.svg";
const pic1 = "https://kota-content.b-cdn.net/app/uploads/2023/11/bento3.jpg";
const pic2 = "https://kota-content.b-cdn.net/app/uploads/2023/11/creative-web-design-768x744.jpg";
import Text1 from './Text1';



const AgencyHero = () => {
  const config = {
    imageLifespan: 1000,
    mouseThreshold: 150,
    inDuration: 750,
    outDuration: 1000,
    staggerIn: 100,
    staggerOut: 25,
    slideDuration: 1000,
    slideEasing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easing: "cubic-bezier(0.87, 0, 0.13, 1)",
  };

  const trailImageCount = 5;

  const images = [
    pic1,
    pic2,
    pic1,
    pic2,
    pic1,
    pic2,
    pic1,
    pic2,
    pic1,
    pic2,
   
   
  ];


  
  const trailContainerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1000);
  const trailRef = useRef([]);
  const animationStateRef = useRef(null);
  const currentImageIndexRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const interpolatedMousePosRef = useRef({ x: 0, y: 0 });

  const mathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  const getMouseDistance = () => {
    return mathUtils.distance(
      mousePosRef.current.x, 
      mousePosRef.current.y, 
      lastMousePosRef.current.x, 
      lastMousePosRef.current.y
    );
  };

  const isInTrailContainer = (x, y) => {
    if (!trailContainerRef.current) return false;
    const rect = trailContainerRef.current.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const createTrailImage = () => {
    if (!trailContainerRef.current) return;

    const imgContainer = document.createElement("div");
    imgContainer.className = "absolute w-[180px] h-[180px] pointer-events-none";

    const imgSrc = images[currentImageIndexRef.current];
    currentImageIndexRef.current = (currentImageIndexRef.current + 1) % trailImageCount;

    const rect = trailContainerRef.current.getBoundingClientRect();
    const startX = interpolatedMousePosRef.current.x - rect.left - 87.5;
    const startY = interpolatedMousePosRef.current.y - rect.top - 87.5;
    const targetX = mousePosRef.current.x - rect.left - 87.5;
    const targetY = mousePosRef.current.y - rect.top - 87.5;

    imgContainer.style.left = `${startX}px`;
    imgContainer.style.top = `${startY}px`;
    imgContainer.style.transition = `left ${config.slideDuration}ms ${config.slideEasing}, top ${config.slideDuration}ms ${config.slideEasing}`;

    const maskLayers = [];
    const imageLayers = [];
    
    for (let i = 0; i < 10; i++) {
      const layer = document.createElement("div");
      layer.className = "absolute top-0 left-0 w-full h-full bg-black will-change-[clip-path]";

      const imageLayer = document.createElement("div");
      imageLayer.className = "absolute top-0 left-0 w-full h-full";
      imageLayer.style.backgroundImage = `url(${imgSrc})`;
      imageLayer.style.backgroundSize = "cover";
      imageLayer.style.backgroundPosition = "center";

      const startY = i * 10;
      const endY = (i + 1) * 10;

      layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
      layer.style.transition = `clip-path ${config.inDuration}ms ${config.easing}`;
      layer.style.transform = "translateZ(0)";
      layer.style.backfaceVisibility = "hidden";

      layer.appendChild(imageLayer);
      imgContainer.appendChild(layer);
      maskLayers.push(layer);
      imageLayers.push(imageLayer);
    }

    trailContainerRef.current.appendChild(imgContainer);

    requestAnimationFrame(() => {
      imgContainer.style.left = `${targetX}px`;
      imgContainer.style.top = `${targetY}px`;

      maskLayers.forEach((layer, i) => {
        const startY = i * 10;
        const endY = (i + 1) * 10;
        const distanceFromMiddle = Math.abs(i - 4.5);
        const delay = distanceFromMiddle * config.staggerIn;

        setTimeout(() => {
          layer.style.clipPath = `polygon(0% ${startY}%, 100% ${startY}%, 100% ${endY}%, 0% ${endY}%)`;
        }, delay);
      });
    });

    trailRef.current.push({
      element: imgContainer,
      maskLayers: maskLayers,
      imageLayers: imageLayers,
      removeTime: Date.now() + config.imageLifespan,
    });
  };

  const removeOldImages = () => {
    const now = Date.now();
    if (trailRef.current.length === 0) return;

    const oldestImage = trailRef.current[0];
    if (now >= oldestImage.removeTime) {
      const imgToRemove = trailRef.current.shift();

      imgToRemove.maskLayers.forEach((layer, i) => {
        const startY = i * 10;
        const endY = (i + 1) * 10;
        const distanceFromEdge = 4.5 - Math.abs(i - 4.5);
        const delay = distanceFromEdge * config.staggerOut;

        layer.style.transition = `clip-path ${config.outDuration}ms ${config.easing}`;

        setTimeout(() => {
          layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
        }, delay);
      });

      imgToRemove.imageLayers.forEach((imageLayer) => {
        imageLayer.style.transition = `opacity ${config.outDuration}ms ${config.easing}`;
        imageLayer.style.opacity = "0.25";
      });

      setTimeout(() => {
        if (imgToRemove.element.parentNode) {
          imgToRemove.element.parentNode.removeChild(imgToRemove.element);
        }
      }, config.outDuration + 112);
    }
  };

  const render = () => {
    if (!isDesktop) return;

    const distance = getMouseDistance();

    interpolatedMousePosRef.current.x = mathUtils.lerp(
      interpolatedMousePosRef.current.x || mousePosRef.current.x,
      mousePosRef.current.x,
      0.1
    );
    interpolatedMousePosRef.current.y = mathUtils.lerp(
      interpolatedMousePosRef.current.y || mousePosRef.current.y,
      mousePosRef.current.y,
      0.1
    );

    if (
      distance > config.mouseThreshold &&
      isInTrailContainer(mousePosRef.current.x, mousePosRef.current.y)
    ) {
      createTrailImage();
      lastMousePosRef.current = { ...mousePosRef.current };
    }

    removeOldImages();
    animationStateRef.current = requestAnimationFrame(render);
  };

  const startAnimation = () => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationStateRef.current = requestAnimationFrame(render);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  };

  const stopAnimation = () => {
    if (animationStateRef.current) {
      cancelAnimationFrame(animationStateRef.current);
      animationStateRef.current = null;
    }

    trailRef.current.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trailRef.current = [];
  };

  const handleResize = () => {
    const wasDesktop = isDesktop;
    setIsDesktop(window.innerWidth > 1000);

    if (isDesktop && !wasDesktop) {
      startAnimation();
    } else if (!isDesktop && wasDesktop) {
      stopAnimation();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    if (isDesktop) {
      const cleanup = startAnimation();
      return () => {
        cleanup?.();
        stopAnimation();
      };
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      stopAnimation();
    };
  }, [isDesktop]);

  return (
    <section className="relative w-screen h-screen   overflow-hidden">
      
    
<div className='absolute w-full z-0 p-16 pb-0 h-full flex flex-col justify-around'>
     <div>
         <p className='text-[6.5vw]  w-[60%] leading-[6.5vw]  '>Proudly signing </p>
       <p className='text-[6.5vw]  w-[60%] leading-[6.5vw]  '>every piece</p>
     </div>
       
  <h1 className=' text-[4vw] font-bold w-1/2 leading-[4vw] px-4 border-l-2 border-black'><Text1 text="agency" /></h1>
  
</div>
      <div 
        ref={trailContainerRef}
        className="absolute w-full h-full overflow-hidden z-50"
      ></div>
    </section>
  );
};

export default AgencyHero;