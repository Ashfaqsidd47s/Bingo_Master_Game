import React, { useEffect, useState } from 'react';

const LossingAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 15000); // Animation lasts for 15 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) return null;

  const darkPinkShades = [
    '#B22286', // Crimson
    '#C71585', // Medium Violet Red
    '#D1006E', // Darker Pink
    '#A0004D', // Dark Pink
    '#C71585', // Medium Violet Red
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-center items-center overflow-hidden">
      {[...Array(300)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gray-500 opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 30}%`, // Start from higher positions for more dramatic falls
            backgroundColor: darkPinkShades[Math.floor(Math.random() * darkPinkShades.length)],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${Math.random() * 1 + 1.5}s linear forwards, sway 1.5s ease-in-out infinite`,
          }}
        ></div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -30%; // Start higher off the screen
          }
          100% {
            top: 100%; // Fall to the bottom of the screen
          }
        }
        @keyframes sway {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px); // Adjust swaying for a more dynamic look
          }
        }
      `}</style>
    </div>
  );
};

export default LossingAnimation;
