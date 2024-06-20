"use client";

import { motion } from "framer-motion";

interface NavIndicatorProps {
  className?: string;
  layoutId: string;
}

export function NavIndicator(props: NavIndicatorProps) {
  return (
    <>
      <motion.div
        layoutId={props.layoutId}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className={props.className}
      />
    </>
  );
}
