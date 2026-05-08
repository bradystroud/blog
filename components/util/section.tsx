import React from "react";

export const Section = ({ children, className = "" }) => {
  return (
    <section
      className={`flex-1 relative body-font ${className}`}
    >
      {children}
    </section>
  );
};
