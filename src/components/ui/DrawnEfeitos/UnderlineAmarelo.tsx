"use client";

import { motion } from "framer-motion";

type Props = {
  className?: string;
  drawDuration?: number;
  drawDelay?: number;
  strokeWidth?: number;
};

const D =
  "M68.5811 20.044C76.7894 24.9374 85.1039 29.7663 93.2236 34.8009C99.603 38.7423 104.89 43.9001 109.051 50.121C118.111 63.6831 116.135 76.0194 103.124 86.0818C99.0481 89.2285 94.4793 91.803 89.9051 94.1773C79.6484 99.5415 68.6722 102.814 57.4741 105.291C41.8934 108.689 26.0986 110.443 10.2 111.214C2.62753 111.574 -0.51967 110.319 0.0693043 107.606C1.21769 102.227 6.13826 102.956 9.87862 102.223C16.7763 100.849 23.7843 100.135 30.6994 98.8371C40.8954 96.9111 51.1787 95.3681 61.0883 92.5407C69.9431 90.0347 78.3596 86.1383 86.94 82.6072C89.6215 81.471 92.1336 79.7691 94.522 78.0552C104.695 70.736 105.653 63.4667 97.4553 53.8572C90.8961 46.1296 82.3704 40.9059 73.3547 36.358C57.4936 28.2974 40.9692 21.9192 24.2381 15.8703C21.4672 14.8514 18.7556 13.7383 16.174 12.3136C13.6396 10.9184 12.9091 8.42623 13.357 5.62468C13.8169 2.6995 15.8344 0.949581 18.4556 0.431447C20.9532 -0.0987355 23.6202 -0.0632206 26.1221 0.130793C31.2964 0.560425 36.3996 1.20773 41.5204 1.93163C73.4753 6.19534 105.577 7.92765 137.791 6.97541C172.561 5.92291 207.287 5.56507 242.069 7.20919C247.114 7.42657 252.17 8.04431 256.964 4.69316C260.473 2.23996 265.18 6.44253 264.469 10.9156C263.872 14.4764 261.929 17.2569 258.553 18.3503C255.1 19.4612 251.424 20.3009 247.762 20.4929C242.238 20.8279 236.664 20.409 231.147 20.4202C204.146 20.3832 177.151 20.0224 150.178 20.4624C125.037 20.8064 99.89 20.9503 74.7654 19.0746C72.723 18.7757 70.2651 17.3629 68.5811 20.044Z";

export default function UnderlineAmareloDrawn({
  className,
  drawDuration = 0.7,
  drawDelay = 0.25,
  strokeWidth = 2,
}: Props) {
  const fillDelay = drawDelay + drawDuration + 0.08;

  return (
    <svg
      className={className}
      viewBox="0 0 265 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d={D}
        fill="#FF9A15"
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
        stroke="#FF9A15"
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
