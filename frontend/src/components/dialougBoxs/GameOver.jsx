import React from 'react'
import ConfettiWin from '../animations/confetti-animation/ConfettiWin';
import ConfettiLoss from '../animations/confetti-animation/ConfettiLoss';


export default function GameOver({isOpen, title, message, onClose, isWinner}) {
    if(!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-800 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {isWinner ? <ConfettiWin /> : <ConfettiLoss />}
      {/* Transition dialog box */}
      <div
        className={`relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4 md:mx-0 transition-all duration-800 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          &#x2715; {/* Close Icon (X) */}
        </button>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="mb-6">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-indigo-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
            onClick={onClose}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
