"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
  drawDuration?: number;
  drawDelay?: number;
  strokeWidth?: number;
};

const vp = {
  once: false,
  amount: 0.15,
  margin: "120px 0px 120px 0px",
};

const D =
  "M26.948 75.1996C30.1973 74.0915 33.4468 72.9044 36.7774 71.915C38.2803 71.4401 39.9048 71.0839 41.4889 71.0839C43.6416 71.0839 45.5913 73.0231 45.8757 75.081C46.0787 76.5452 44.9008 78.8405 43.5604 78.7613C38.2801 78.4843 34.4621 81.7691 30.116 83.6686C26.4198 85.2912 23.0082 87.5074 19.312 89.1299C16.6312 90.3172 13.788 91.4252 10.9041 91.8605C4.0398 92.8895 -1.03732 88.101 0.181197 81.5712C1.88712 72.5086 4.03984 63.5252 7.6954 54.9375C8.42651 53.2753 9.36075 51.6132 10.5793 50.2677C12.4477 48.2098 16.5499 49.3575 16.9561 52.0881C17.281 54.3835 17.0374 56.7975 16.8749 59.1719C16.6312 62.8128 16.1844 66.4537 15.8189 70.4112C17.078 70.3716 18.0122 70.609 18.459 70.2528C25.8919 63.9605 32.147 56.7184 36.2899 47.9724C39.783 40.6511 41.2859 33.0132 39.0114 24.94C35.8026 13.5821 26.623 6.06291 14.519 5.27142C13.1787 5.19227 11.8789 5.27142 10.9041 5.27142C9.27943 3.53014 9.96997 2.30335 11.1479 1.63058C13.788 0.126751 16.6717 -0.268975 19.7586 0.166345C34.1371 2.34294 45.1446 13.7008 46.7287 27.9477C47.6222 36.2583 46.3224 44.2128 42.6263 51.8111C39.58 58.0639 35.5588 63.6439 31.0097 68.9073C29.4662 70.7277 27.8415 72.469 26.2574 74.2499C26.4605 74.5269 26.7043 74.8435 26.948 75.1996Z";

export default function SetaVermelhaDrawn({
  className,
  drawDuration = 0.7,
  drawDelay = 0.25,
  strokeWidth = 2,
}: Props) {
  const fillDelay = drawDelay + drawDuration + 0.08;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // coarse pointer = celular/tablet na maioria dos casos
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const fillAnim = { opacity: 1 };
  const strokeAnim = { pathLength: 1, opacity: 0 };

  return (
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
        {...(isMobile
          ? { animate: fillAnim }
          : { whileInView: fillAnim, viewport: vp })}
        transition={{ duration: 0.28, delay: fillDelay, ease: "easeOut" }}
      />

      <motion.path
        d={D}
        fill="none"
        stroke="#EB1916"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 1 }}
        {...(isMobile
          ? { animate: strokeAnim }
          : { whileInView: strokeAnim, viewport: vp })}
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
