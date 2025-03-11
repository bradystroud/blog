import React, { useState, useRef } from "react";

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
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setPosition({
      x: (x - centerX) / centerX,
      y: (y - centerY) / centerY,
    });
  };

  const getTransformStyle = () => {
    if (!isHovering) return {};

    return {
      transform: `
        perspective(1000px)
        rotateX(${position.y * 5}deg)
        rotateY(${position.x * -5}deg)
        translateZ(10px)
      `,
      boxShadow: `
        ${position.x * -15}px 
        ${position.y * -15}px 
        20px rgba(0,0,0,0.2)
      `,
    };
  };

  const cardContent = (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
      className={`transition-all duration-300 ease-out border border-gray-100 hover:border-gray-200 ${className}`}
      style={{
        ...getTransformStyle(),
        transitionProperty: "transform, box-shadow",
      }}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="block h-full">
        {cardContent}
      </a>
    );
  }

  return cardContent;
};
