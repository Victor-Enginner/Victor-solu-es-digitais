"use client";

import { useEffect, useState, useRef } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleInterval?: number;
}

export function TextScramble({ text, className = "", scrambleInterval = 5000 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const chars = "!<>-_\\/[]{}—=+*^?#________0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const scramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let frame = 0;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const from = text[i];
      const to = text[i];
      // Random delay for each letter resolving
      const start = Math.floor(Math.random() * 12);
      const end = start + Math.floor(Math.random() * 12) + 6;
      queue.push({ from, to, start, end });
    }

    let animationFrameId: number;

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        isScramblingRef.current = false;
      } else {
        frame++;
        animationFrameId = requestAnimationFrame(update);
      }
    };

    update();

    return () => cancelAnimationFrame(animationFrameId);
  };

  useEffect(() => {
    // Initial scramble on mount
    scramble();
    
    // Periodical scramble
    const interval = setInterval(() => {
      scramble();
    }, scrambleInterval);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span 
      onMouseEnter={scramble}
      className={`${className} cursor-default font-mono transition-all duration-300`}
    >
      {displayText}
    </span>
  );
}
