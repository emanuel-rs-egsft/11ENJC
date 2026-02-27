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
  "M142.267 32.695C142.443 35.3586 142.576 38.1184 142.877 40.8803C143.067 42.4311 143.298 44.0792 143.867 45.4896C144.639 47.4349 146.218 48.5192 147.945 47.8151C149.083 47.3455 150.231 46.005 150.75 44.7534C151.313 43.3572 151.376 41.6161 151.271 40.0179C150.721 30.3817 150.255 20.7465 149.412 11.1066C148.977 5.72998 145.491 2.9281 141.152 4.61562C137.235 6.16325 133.476 8.39033 129.842 10.7641C124.517 14.2296 119.355 18.0843 114.152 21.8416C113.73 22.1267 113.552 22.8987 113.209 23.5234C114.704 27.9455 117.923 28.6634 121.412 27.8362C123.809 27.2373 126.131 25.8632 128.369 24.5848C130.565 23.3058 132.639 21.6867 134.626 20.3083C136.327 21.733 135.306 22.8815 134.791 23.8428C128.656 35.1371 119.592 42.6202 109.705 48.8834C107.803 50.1176 105.491 50.6693 103.307 51.029C78.7802 54.8825 55.4443 50.67 33.5662 37.1853C24.1665 31.3574 17.7016 22.1308 12.5098 11.6621C11.569 9.81154 11.5156 7.3914 10.9556 5.25528C10.4369 3.16806 9.06666 2.1347 7.2658 2.01532C5.17219 1.84387 3.10289 3.07597 2.57326 5.19841C2.13109 7.03163 1.81221 9.05998 2.125 10.8543C2.51311 13.327 3.23527 15.9006 4.33947 18.092C10.6331 30.9456 18.8387 41.7424 30.5336 48.3733C46.4735 57.4285 63.2521 63.1071 81.1908 63.1872C89.5731 63.244 97.9124 63.3971 106.236 61.4693C111.281 60.2745 115.836 58.009 119.945 54.5767C127.018 48.7137 133.802 42.5567 139.143 34.4945C139.655 33.7751 140.333 33.1545 140.969 32.5819C141.138 32.4388 141.514 32.5887 142.267 32.695Z";

export default function Seta11Drawn({
  className,
  drawDuration = 1.05,
  drawDelay = 0.25,
  strokeWidth = 3,
}: Props) {
  const strokeControls = useAnimationControls();

  const play = () => {
    // reset
    strokeControls.set({ pathLength: 0, opacity: 1 });

    // anima
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
      viewBox="0 0 154 66"
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
