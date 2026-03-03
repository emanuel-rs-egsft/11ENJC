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
  "M26.6338 24.8027C29.551 24.7589 32.5449 24.5699 35.358 24.7088C41.5052 24.9966 47.4987 25.5749 52.8756 26.8448C61.1813 28.8416 70.6308 28.5947 80.1301 28.2399C83.6522 28.1105 86.9103 27.2629 89.6976 25.844C92.0624 24.6529 94.3566 23.4214 96.6142 22.1615C99.1717 20.7248 101.622 19.2194 104.179 17.7827C110.466 14.2397 117.979 12.0172 126.078 10.4842C130.821 9.57735 135.384 9.68661 139.827 10.0983C144.601 10.5471 149.349 11.0498 154.148 11.4448C159.995 11.9094 166.007 11.931 172.251 11.2985C175.998 10.919 179.302 10.1657 182.364 8.62391C189.49 5.04596 197.825 2.89181 206.442 1.11755C210.924 0.197381 215.374 -0.030001 219.763 0.0030892C224.346 0.0255826 228.882 0.17234 233.361 0.377458C234.932 0.457253 236.407 0.78554 237.787 1.12733C238.799 1.38705 238.615 2.38675 237.65 2.90961C235.933 3.85792 233.891 4.34851 231.686 4.37536C228.544 4.43424 225.347 4.56802 222.304 4.41136C209.969 3.77435 198.791 6.49893 188.184 10.956C186.559 11.6394 185.046 12.4245 183.355 13.1005C180.128 14.3969 176.627 15.1279 172.934 15.4326C165.65 16.0612 158.531 16.2468 151.688 15.6377C147.707 15.2782 143.612 15.0354 139.797 14.4677C129.542 12.9315 120.296 15.2988 111.496 19.2145C108.685 20.4688 106.312 22.0639 103.721 23.4886C100.648 25.183 97.6428 26.9014 94.4307 28.5315C89.8578 30.8748 84.5806 32.1426 78.8286 32.3528C68.2281 32.7293 57.8426 32.7898 48.7416 30.4523C43.9884 29.2283 38.5053 28.8128 33.0857 28.3883C27.8301 27.9742 23.0319 28.956 18.5445 30.985C13.1415 33.4291 8.80483 36.2929 5.76908 39.6273C6.32601 40.8076 4.43873 41.2428 2.95224 41.7555C1.27936 42.3282 -0.20562 41.9341 0.0234411 41.0286C0.17175 40.4704 0.349571 39.8911 0.757282 39.3297C4.25041 34.6378 9.55003 30.5464 17.4492 27.3794C20.3127 26.2687 23.2725 25.3795 26.6338 24.8027Z";

export default function LinhaRoxaDrawn({
  className,
  drawDuration = 0.7,
  drawDelay = 0.25,
  strokeWidth = 2,
}: Props) {
  const fillControls = useAnimationControls();
  const strokeControls = useAnimationControls();

  const reset = () => {
    fillControls.set({ opacity: 0 });
    strokeControls.set({ pathLength: 0, opacity: 1 });
  };

  const play = async () => {
    reset();

    // 1) desenha
    await strokeControls.start({
      pathLength: 1,
      transition: {
        duration: drawDuration, // ✅ agora usa o prop
        delay: drawDelay,
        ease: [0.65, 0, 0.35, 1],
      },
    });

    // 2) some o traço
    strokeControls.start({
      opacity: 0,
      transition: {
        duration: 0.25,
        delay: 0.08,
        ease: "easeOut",
      },
    });

    // 3) aparece o fill
    fillControls.start({
      opacity: 1,
      transition: {
        duration: 0.28,
        delay: 0.08,
        ease: "easeOut",
      },
    });
  };

  return (
    <motion.svg
      className={className}
      viewBox="0 0 239 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewport={vp}
      onViewportEnter={play}
      onViewportLeave={reset}
    >
      <motion.path
        d={D}
        fill="#8D48EF"
        initial={{ opacity: 0 }}
        animate={fillControls}
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
        animate={strokeControls}
      />
    </motion.svg>
  );
}
