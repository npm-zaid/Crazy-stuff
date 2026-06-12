import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const Text1 = ({ text }) => {
  const element = useRef(null);
  const split = useRef(null);


  useEffect(() => {
    // Split only this element
    split.current = new SplitText(element.current, {
      type: "chars",
    });

    gsap.fromTo(
      split.current.chars,
      { yPercent: 100 },
      {
        yPercent: 0,
        delay: 0.5,
        duration: .8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        
        },
      }
    );
  }, []);

  return (
    <h2
      ref={element}
      className="cursor-pointer overflow-hidden"
    >
      {text}
    </h2>
  );
};

export default Text1;
