import React from "react";

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M50 95L15 25L30 25L50 75L70 25L85 25L50 95Z"
      fill="currentColor"
      className="text-primary"
    />
    <path
      d="M50 5L15 25L30 25L50 15L70 25L85 25L50 5Z"
      fill="currentColor"
      className="text-foreground"
    />
    <circle cx="50" cy="50" r="10" fill="currentColor" className="text-primary/20" />
  </svg>
);
