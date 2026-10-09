"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleInterval?: number;
}

export function TextScramble({ text, className = "", scrambleInterval = 5000 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const chars = "!<>-_\\\/[]{}—=+*^?#________0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const scramble = useCallback(() => {
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

    const update = () => {
      let output = "";
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (frame >= item.end) {
          complete++;
          output += item.to;
        } else if (frame >= item.start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = chars[Math.floor(Math.random() * chars.length)];
          }
          output += item.char;
        } else {
          output += item.from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        isScramblingRef.current = false;
        rafRef.current = null;
      } else {
        frame++;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
  }, [text, chars]);

  useEffect(() => {
    // Initial scramble on mount
    scramble();

    // Periodical scramble
    const interval = setInterval(() => {
      scramble();
    }, scrambleInterval);

    return () => {
      clearInterval(interval);
      // Cancela animação em andamento para não setState após o unmount.
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        isScramblingRef.current = false;
      }
    };
  }, [scramble, scrambleInterval]);

  return (
    <span
      onMouseEnter={scramble}
      className={`${className} cursor-default font-mono transition-all duration-300`}
    >
      {displayText}
    </span>
  );
}
