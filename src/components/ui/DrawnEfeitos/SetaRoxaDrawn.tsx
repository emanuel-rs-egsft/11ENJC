"use client";

import { motion } from "framer-motion";

type Props = {
  className?: string;
  drawDuration?: number;
  drawDelay?: number;
  strokeWidth?: number;
};

const D =
  "M84.746 79.7111C85.88 76.4707 86.9518 73.1814 88.2293 69.9503C88.7834 68.4748 89.5059 66.9768 90.4837 65.7305C91.8125 64.0369 94.5417 63.6999 96.3362 64.7465C97.6136 65.4906 98.6922 67.8342 97.8026 68.8398C94.3253 72.8231 94.5528 77.8545 93.3646 82.4463C92.3596 86.3558 91.9972 90.408 90.9922 94.3175C90.2715 97.1594 89.3882 100.08 87.9506 102.618C84.5229 108.654 77.6216 109.692 73.2364 104.703C67.1595 97.7666 61.4206 90.5277 56.9207 82.3508C56.0643 80.7496 55.3333 78.9886 55.0269 77.1993C54.5612 74.4591 57.9963 71.9401 60.3954 73.3061C62.4018 74.4673 64.1506 76.1491 65.9185 77.7426C68.6325 80.1817 71.2211 82.7807 74.109 85.5111C74.8551 84.4961 75.6185 83.9076 75.6141 83.3363C75.2518 73.6043 73.4151 64.2128 69.0916 55.5547C65.4878 48.2873 60.4063 42.3901 52.6507 39.1963C41.7342 34.7099 30.1522 37.2905 22.058 46.3248C21.1684 47.3304 20.4284 48.4018 19.8267 49.1688C17.4538 49.3722 16.9149 48.0716 17.1127 46.7296C17.5592 43.7242 19.0279 41.2112 21.2759 39.0513C31.8638 29.0826 47.5942 27.4334 59.7807 34.9813C66.8707 39.4082 72.3265 45.3409 76.0229 52.9391C79.0619 59.1955 80.9698 65.8035 82.3027 72.6315C82.7822 74.9695 83.1493 77.3226 83.5725 79.6682C83.9158 79.6794 84.3154 79.683 84.746 79.7111Z";

export default function SetaRoxaDrawn({
  className,
  drawDuration = 0.7,
  drawDelay = 0.25,
  strokeWidth = 2,
}: Props) {
  const fillDelay = drawDelay + drawDuration + 0.08;

  return (
    <svg
      className={className}
      viewBox="0 0 120 129"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d={D}
        fill="#8D48EF"
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
        stroke="#8D48EF"
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
