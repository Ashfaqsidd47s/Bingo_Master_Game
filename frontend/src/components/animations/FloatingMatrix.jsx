import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FloatingMatrix = () => {
  const [isSpread, setIsSpread] = useState(false);
  const matrixSize = 5;
  const numbers = Array.from({ length: matrixSize * matrixSize }, () =>
    Math.floor(Math.random() * 100)
  );

  // Trigger the spread animation after all numbers pop in
  useEffect(() => {
    const timer = setTimeout(() => setIsSpread(true), 4000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  const popUpVariant = {
    initial: { opacity: 0, scale: 0.5 }, // Hidden and small initially
    popIn: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1, // Stagger the pop-in for each element
        duration: 0.5,
      },
    }),
    spread: (i) => ({
      opacity: 1,
      scale: 1,
      x: (Math.random() - 0.5) * window.innerWidth, // Spread randomly across X-axis
      y: (Math.random() - 0.5) * window.innerHeight, // Spread randomly across Y-axis
      transition: { duration: 1.5, delay: 0.5, ease: "easeInOut" },
    }),
    floatUp: (i) => ({
      y: [0, -window.innerHeight], // Float upwards across the screen
      transition: {
        y: {
          repeat: Infinity, // Infinite loop
          repeatType: "loop",
          duration: 5 + Math.random() * 2, // Slightly randomize float speed (range: 5 to 7 seconds)
          ease: "linear", // Smooth float
        },
      },
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-visible">
      <div className="absolute inset-0 flex justify-center items-center overflow-visible">
        <div className="grid grid-cols-5 gap-4 overflow-visible">
          {numbers.map((num, index) => (
            <motion.div
              key={index}
              className="w-12 h-12 flex justify-center items-center bg-indigo-300 rounded-full text-black font-bold text-xl z-[-1]"
              custom={index}
              initial="initial"
              animate={isSpread ? ["spread", `floatUp`] : "popIn"}
              variants={popUpVariant}
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingMatrix;
