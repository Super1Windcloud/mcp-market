import React from "react";

export function GlassEffectCard({ children, className, noPadding }: {
  children: React.ReactNode, className?: string, noPadding?: boolean,
}) {
  return (
    <div
      style={
        {
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", // shadow-sm
          backdropFilter: "blur(12px)", // backdrop-blur-md
          backgroundColor: "rgba(255, 255, 255, 0.1)", // bg-white/10
          border: "1px solid rgba(255, 255, 255, 0.1)", // border border-white/10
          borderRadius: "15px",
          position: "relative",
          padding: !noPadding ? "1rem" : "0",
        }
      }
      className={className}
    >
      {children}
    </div>
  );

}