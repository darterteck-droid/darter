"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type AnimateOnScrollProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export default function AnimateOnScroll({
  children,
  delay = 0,
  className = "",
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
