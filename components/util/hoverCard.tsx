import React from "react";

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = "",
  href,
  target,
  rel = "noopener noreferrer",
}) => {
  const inner = (
    <div
      className={`group/card relative border border-rule transition-colors duration-300 ease-out hover:border-rule-strong focus-within:border-rule-strong ${className}`}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className="block h-full focus:outline-none"
      >
        {inner}
      </a>
    );
  }

  return inner;
};
