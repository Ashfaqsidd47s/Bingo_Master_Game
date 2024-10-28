import React from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use';

export default function ConfettiWin() {

  const { width, height } = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={250}  // Adjust number of confetti particles
      gravity={0.01}  // Slow gravity for smooth floating effect
      initialVelocityY={{ min: 5, max: 10 }}  // Higher initial velocity for explosion
      recycle={true}  // Let the particles disappear after the animation
      wind={0.01}  // Slight horizontal movement to make the confetti float
      tweenDuration={8000}  // Duration for confetti to fall slowly
      colors={["red", '#FF6347', '#FFD700', '#ADFF2F', '#00BFFF']}  
    />
  )
}
