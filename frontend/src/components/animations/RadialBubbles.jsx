import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RadialBubbles = () => {
  const [bubbles, setBubbles] = useState([]);

  // Create an array of bubbles
  useEffect(() => {
    const bubbleArray = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100));
    setBubbles(bubbleArray);
  }, []);

  // Randomize direction and speed for each bubble
  const getRandomDirection = () => ({
    x: (Math.random() - 0.5) * window.innerWidth * 0.8, // Randomize X direction (80% of screen width)
    y: (Math.random() - 0.5) * window.innerHeight * 0.8, // Randomize Y direction (80% of screen height)
  });

  const popUpVariant = {
    initial: { opacity: 0, scale: 0.5, x: 0, y: 0  }, // Hidden and small initially
    popUp: (i) => ({
      opacity: 1,
      scale: 1,
      x: getRandomDirection().x, // Move to random X direction
      y: getRandomDirection().y, // Move to random Y direction
      transition: {
        duration: 3 + Math.random() * 2, // Randomize duration (range: 3 to 5 seconds)
        ease: "easeInOut",
      },
    }),
    float: {
      x: [0, getRandomDirection().x, 0], // Float in random directions
      y: [0, getRandomDirection().y, 0],
      transition: {
        duration: 4 + Math.random() * 3, // Randomize duration (range: 4 to 7 seconds)
        repeat: Infinity, // Repeat infinitely
        ease: "linear", // Linear movement for floating effect
      },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-100">
      <div className="absolute top-[50%] w-full flex justify-center items-end overflow-visible">
        {bubbles.map((num, index) => (
          <motion.div
            key={index}
            className="w-12 h-12 flex justify-center items-center bg-yellow-200 rounded-full text-black font-bold text-xl z-20"
            custom={index}
            initial="initial"
            animate={index % 2 === 0 ? "popUp" : "float"} // Alternate between animations
            variants={popUpVariant}
            style={{ position: "absolute" }}
            onAnimationComplete={(definition) => {
              if (definition === "popUp") {
                // Switch to floating animation after popping up
                setTimeout(() => {
                  const bubble = document.getElementById(`bubble-${index}`);
                  bubble && bubble.animate([{ transform: 'translate(0, 0)' }, { transform: `translate(${getRandomDirection().x}px, ${getRandomDirection().y}px)` }, { transform: 'translate(0, 0)' }], {
                    duration: 2000 + Math.random() * 3000,
                    iterations: Infinity,
                    easing: 'linear',
                  });
                }, 1000); // Delay to switch to floating
              }
            }}
            id={`bubble-${index}`}
          >
            {num}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RadialBubbles;
