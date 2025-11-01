import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const AnimatedCounter = ({ value, duration = 2, decimals = 0, isString = false }) => {
  if (isString || typeof value === "string") {
    return <span>{value}</span>;
  }

  const targetValue = Number(value) || 0;
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 25,
    stiffness: 100,
  });
  
  const rounded = useTransform(spring, (latest) =>
    Number(latest.toFixed(decimals))
  );
  
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(targetValue);
  }, [targetValue, motionValue]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplay(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <motion.span
      style={{ 
        display: "inline-block",
        fontVariantNumeric: "tabular-nums"
      }}
    >
      {display}
    </motion.span>
  );
};

export default AnimatedCounter;

