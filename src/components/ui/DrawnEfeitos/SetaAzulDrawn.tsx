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
  "M45.0555 66.7157C47.5668 64.3748 50.0458 61.9618 52.6799 59.6961C53.8568 58.6477 55.1933 57.6579 56.6386 57.0096C58.6028 56.1286 61.1754 57.1 62.277 58.8613C63.0615 60.1143 62.926 62.6906 61.6707 63.1669C56.7395 65.0751 54.6 69.6347 51.412 73.1465C48.7035 76.1396 46.4976 79.5579 43.7891 82.551C41.829 84.7314 39.6882 86.906 37.2351 88.4834C31.393 92.2314 24.8008 89.94 23.2403 83.4834C21.0881 74.5163 19.3758 65.4386 19.1968 56.107C19.1836 54.2912 19.3558 52.3923 19.917 50.6659C20.7796 48.0237 24.9922 47.392 26.4803 49.7173C27.7162 51.6786 28.4818 53.9809 29.3053 56.2139C30.573 59.6357 31.6553 63.1406 32.9413 66.9011C34.074 66.3497 35.0235 66.184 35.2855 65.6761C39.4924 56.8929 42.2358 47.7253 42.4367 38.0497C42.6277 29.9401 40.8732 22.356 35.4939 15.9206C27.918 6.87057 16.4651 3.76663 5.09723 7.99794C3.84185 8.47426 2.68835 9.07838 1.79891 9.47732C-0.396112 8.55343 -0.268111 7.15148 0.531309 6.05558C2.32479 3.60299 4.79401 2.06177 7.78873 1.19567C21.7988 -2.70269 36.4904 3.15578 43.7662 15.5067C47.9826 22.7238 50.052 30.5136 49.7891 38.9592C49.5685 45.911 48.1831 52.648 46.1864 59.3122C45.5231 61.6048 44.7532 63.8585 44.0367 66.1317C44.3354 66.3014 44.6873 66.4904 45.0555 66.7157Z";

export default function SetaAzulDrawn({
  className,
  drawDuration = 0.7,
  drawDelay = 0.25,
  strokeWidth = 2,
}: Props) {
  const fillDelay = drawDelay + drawDuration + 0.08;

  const fillControls = useAnimationControls();
  const strokeControls = useAnimationControls();

  const play = () => {
    // reset antes de animar
    fillControls.set({ opacity: 0 });
    strokeControls.set({ pathLength: 0, opacity: 1 });

    // desenha o traço
    strokeControls.start({
      pathLength: 1,
      transition: {
        duration: 1.05,
        delay: drawDelay,
        ease: [0.65, 0, 0.35, 1],
      },
    });

    // desaparece traço
    strokeControls.start({
      opacity: 0,
      transition: {
        duration: 0.25,
        delay: fillDelay,
        ease: "easeOut",
      },
    });

    // aparece preenchimento
    fillControls.start({
      opacity: 1,
      transition: {
        duration: 0.28,
        delay: fillDelay,
        ease: "easeOut",
      },
    });
  };

  const reset = () => {
    fillControls.set({ opacity: 0 });
    strokeControls.set({ pathLength: 0, opacity: 1 });
  };

  return (
    <motion.svg
      className={className}
      viewBox="0 0 63 91"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewport={vp}
      onViewportEnter={play}
      onViewportLeave={reset}
    >
      <motion.path
        d={D}
        fill="#00A0FF"
        initial={{ opacity: 0 }}
        animate={fillControls}
      />

      <motion.path
        d={D}
        fill="none"
        stroke="#00A0FF"
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
