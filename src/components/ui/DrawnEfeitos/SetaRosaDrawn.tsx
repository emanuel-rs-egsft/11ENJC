"use client";

import { motion } from "framer-motion";

type Props = {
  className?: string;
  drawDuration?: number;
  drawDelay?: number;
  strokeWidth?: number;
};

const D =
  "M26.0104 73.9151C29.1292 72.4801 32.24 70.9664 35.4518 69.6412C36.8981 69.0149 38.4776 68.4942 40.0534 68.3319C42.1948 68.1115 44.3329 69.8408 44.8264 71.8587C45.1784 73.2945 44.2417 75.6983 42.9002 75.7569C37.6194 76.022 34.1578 79.6805 30.0291 82.0152C26.5185 84.0077 23.3517 86.5617 19.8412 88.5542C17.2961 90.0097 14.5812 91.4031 11.7572 92.1315C5.03429 93.858 -0.506526 89.6146 0.0368746 82.9943C0.805741 73.8047 2.02715 64.6481 4.78403 55.7312C5.34108 54.0029 6.10019 52.2538 7.17451 50.7906C8.82233 48.5522 13.0205 49.2737 13.7042 51.9484C14.2625 54.1984 14.2674 56.6247 14.349 59.0033C14.4794 62.65 14.4078 66.3175 14.4494 70.2916C15.6979 70.1233 16.6515 70.2637 17.0595 69.8637C23.8089 62.8432 29.2894 54.9986 32.5149 45.8744C35.2399 38.2339 35.9527 30.4821 32.8633 22.6843C28.5083 11.7147 18.6069 5.1752 6.48552 5.62743C5.14409 5.68596 3.85932 5.8978 2.88963 5.99763C1.09515 4.43189 1.65642 3.14083 2.75923 2.35097C5.23147 0.584673 8.05949 -0.104291 11.1748 0.0126115C25.7006 0.705275 37.8133 10.8762 40.8481 24.8859C42.588 33.0613 42.1097 41.1071 39.2111 49.044C36.8211 55.5759 33.3926 61.5383 29.4064 67.24C28.0575 69.2089 26.6196 71.1074 25.2262 73.0411C25.4566 73.2959 25.7315 73.5858 26.0104 73.9151Z";

export default function SetaRosaDrawn({
  className,
  drawDuration = 0.7,
  drawDelay = 0.25,
  strokeWidth = 2,
}: Props) {
  const fillDelay = drawDelay + drawDuration + 0.08;

  return (
    <svg
      className={className}
      viewBox="0 0 45 93"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d={D}
        fill="#F22AA8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{
          duration: 0.28,
          delay: fillDelay,
          ease: "easeOut",
        }}
      />
      <motion.path
        d={D}
        fill="none"
        stroke="#F22AA8"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 1 }}
        whileInView={{ pathLength: 1, opacity: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{
          pathLength: {
            duration: 1.05,
            delay: drawDelay,
            ease: [0.65, 0, 0.35, 1],
          },
          opacity: {
            duration: 0.25,
            delay: fillDelay,
            ease: "easeOut",
          },
        }}
      />
    </svg>
  );
}
