import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "h-8", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized geometric V Logo matching Victor's branding */}
      <svg
        className="w-8 h-8 flex-shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Blue Accent Chevron */}
        <path
          d="M15 20 L40 20 L55 60 L45 75 Z"
          fill="url(#blue-gradient)"
        />
        {/* Left Dark Chevron Connector */}
        <path
          d="M40 20 L50 20 L55 60 Z"
          fill="#1E293B"
          opacity="0.5"
        />
        {/* Right Main Deep Dark Chevron */}
        <path
          d="M50 20 L85 20 L50 85 L35 75 Z"
          fill="url(#dark-gradient)"
        />
        {/* Small cyan highlight node */}
        <path
          d="M50 85 L60 65 L50 60 Z"
          fill="#3B82F6"
        />

        <defs>
          <linearGradient id="blue-gradient" x1="15" y1="20" x2="55" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0052FF" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="dark-gradient" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B132B" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-[15px] sm:text-base font-black tracking-wider text-primary">
            VICTOR <span className="text-[#0052FF]">AI</span> ENGINEER
          </span>
          <span className="text-[8px] sm:text-[9px] font-sans font-bold tracking-[0.18em] text-secondary mt-0.5">
            SOLUÇÕES DIGITAIS
          </span>
        </div>
      )}
    </div>
  );
}
