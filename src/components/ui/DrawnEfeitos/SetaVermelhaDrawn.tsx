"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function SetaVermelhaDrawn({
  className,
}: {
  className?: string;
}) {
  const [entered, setEntered] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: -18,
          left: 0,
          fontSize: 12,
          background: "rgba(0,0,0,.6)",
          color: "#fff",
          padding: "2px 6px",
          borderRadius: 6,
          zIndex: 9999,
        }}
      >
        inView: {entered ? "SIM" : "NÃO"}
      </div>

      <svg
        className={className}
        viewBox="0 0 47 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={D}
          fill="#EB1916"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={vp}
          onViewportEnter={() => setEntered(true)}
        />
        <motion.path
          d={D}
          fill="none"
          stroke="#EB1916"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 1 }}
          whileInView={{ pathLength: 1, opacity: 0 }}
          viewport={vp}
          transition={{
            pathLength: {
              duration: 1.05,
              delay: 0.25,
              ease: [0.65, 0, 0.35, 1],
            },
            opacity: { duration: 0.25, delay: 1.03, ease: "easeOut" },
          }}
        />
      </svg>
    </div>
  );
}
