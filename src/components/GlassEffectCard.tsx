import React from "react";

export function GlassEffectCard({ children, className }: {
  children: React.ReactNode, className ?: string
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
          padding: "1rem",
        }
      }
      className={className}
    >
      {children}
    </div>
  );

}