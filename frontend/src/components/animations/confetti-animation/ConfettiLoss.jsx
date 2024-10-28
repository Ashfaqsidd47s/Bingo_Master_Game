import React from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use';

export default function ConfettiLoss() {

    const { width, height } = useWindowSize();

    return (
    <Confetti
        width={width}
        height={height}
        numberOfPieces={250}  // Adjust number of confetti particles
        gravity={0.01}  // Slow gravity for smooth floating effect
        initialVelocityY={{ min: 3, max: 10 }}  // Higher initial velocity for explosion
        recycle={false}  // Let the particles disappear after the animation
        wind={0.01}  // Slight horizontal movement to make the confetti float
        tweenDuration={10000}  // Duration for confetti to fall slowly
        colors={["#d3d3d3", "#a3c1da", "#f9e0c3", "#e4c6f2", "#e8c3c3"]}  
    />
    )
}