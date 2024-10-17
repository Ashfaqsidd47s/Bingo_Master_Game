import React, { useEffect, useState } from 'react';

const WinnerAnimation = () => {
    const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 15000); // Animation lasts for 15 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!showAnimation) return null;

  const pinkShades = [
    '#FFC0CB', // Light Pink
    '#FF69B4', // Hot Pink
    '#FF1493', // Deep Pink
    '#FFB6C1', // Light Pink 2
    '#DB7093', // Pale Violet Red
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-center items-center overflow-hidden">
      {[...Array(300)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-4 bg-red-500 opacity-90"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 30}%`, // Start from higher positions for more dramatic falls
            backgroundColor: pinkShades[Math.floor(Math.random() * pinkShades.length)],
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
            transform: translateX(15px); // Adjust swaying for a more dynamic look
          }
        }
      `}</style>
    </div>
  );
};

export default WinnerAnimation;
