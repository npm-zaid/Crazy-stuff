import { useEffect, useRef, useState } from "react";

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function HyperText({
  className = "",
  duration = 800,
  text='rehman',
  animateOnLoad = true,
}) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const iterations = useRef(0);
  const isFirstRender = useRef(true);

  const triggerAnimation = () => {
    iterations.current = 0;
    setTrigger(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!animateOnLoad && isFirstRender.current) {
        clearInterval(interval);
        isFirstRender.current = false;
        return;
      }
      if (iterations.current < text.length) {
        setDisplayText((t) =>
          t.map((l, i) =>
            l === " "
              ? l
              : i <= iterations.current
              ? text[i] ?? ""
              : alphabets[Math.floor(Math.random() * alphabets.length)]
          )
        );
        iterations.current = iterations.current + 0.1;
      } else {
        setTrigger(false);
        clearInterval(interval);
      }
    }, duration / (text.length * 10));

    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad]);

  return (
    <div
      className={`flex cursor-default overflow-hidden py-2 font-mono${className ? ` ${className}` : ""}`}
      onMouseEnter={triggerAnimation}
    >
      {displayText.map((letter, i) => (
        <span key={i} style={{ minWidth: "0.1em" }}>
          {letter}
        </span>
      ))}
    </div>
  );
}