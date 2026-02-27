"use client";

import { motion, useAnimationControls } from "framer-motion";

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
  "M110.04 17.1785C107.659 18.3527 106.17 19.2295 104.583 19.8441C103.108 20.4216 101.336 19.8419 100.47 18.6653C99.5954 17.5202 99.5937 16.2744 100.013 14.9739C100.072 14.7543 100.131 14.5347 100.277 14.372C104.488 8.67709 109.482 3.9677 116.64 2.26667C120.577 1.3445 122.887 2.81029 124.007 6.68071C124.253 7.52148 124.325 8.38237 124.468 9.22896C125.208 13.5018 125.917 17.7661 126.697 22.0161C127.302 25.4109 127.342 25.388 125.501 28.6942C120.63 28.6908 120.773 23.7813 118.45 21.235C116.479 21.6448 116.368 23.4325 115.619 24.5765C112.785 28.9272 110.093 33.3832 107.345 37.7909C103.855 43.4451 98.6389 45.9737 92.0853 46.1888C83.416 46.4716 75.7193 44.1563 69.543 37.8422C62.4874 30.651 53.9894 25.2916 45.7824 19.6069C38.3503 14.4345 30.1841 14.4831 22.0187 17.1574C15.2234 19.394 11.0044 24.6157 8.57444 31.2297C7.82581 33.2489 7.2579 35.3507 6.45469 37.3216C5.97493 38.471 3.72447 38.5361 3.14209 37.4362C2.56817 36.305 1.87902 34.9743 2.01807 33.8338C2.36024 31.0652 2.76786 28.1796 3.88977 25.6553C6.86898 18.8868 11.6602 13.5505 18.6858 10.8375C29.403 6.73222 39.9809 6.89773 49.9173 13.319C58.4989 18.8693 67.1206 24.3968 74.3401 31.7332C78.9068 36.3669 84.4086 38.2912 90.8143 38.3728C95.3043 38.408 98.8782 36.9502 101.261 33.0162C103.953 28.5602 106.701 24.1526 109.385 19.7279C109.741 19.2856 109.721 18.6071 110.04 17.1785Z";

export default function SetaMapaBrasilDrawn({
  className,
  drawDuration = 1.05,
  drawDelay = 0.25,
  strokeWidth = 3,
}: Props) {
  const strokeControls = useAnimationControls();

  const play = () => {
    strokeControls.set({ pathLength: 0, opacity: 1 });
    strokeControls.start({
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: drawDuration,
        delay: drawDelay,
        ease: [0.65, 0, 0.35, 1],
      },
    });
  };

  const reset = () => {
    strokeControls.set({ pathLength: 0, opacity: 1 });
  };

  return (
    <motion.svg
      className={className}
      viewBox="0 0 130 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewport={vp}
      onViewportEnter={play}
      onViewportLeave={reset}
    >
      <motion.path
        d={D}
        fill="none"
        stroke="#5B585B"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={strokeControls}
      />
    </motion.svg>
  );
}
