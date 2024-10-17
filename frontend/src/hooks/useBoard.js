import { create } from 'zustand';

export const useBoard = create((set) => ({
    board: null,
    updateBoard: (newBoard) => set({board: newBoard})
}))

export const useCanceledNumbers = create((set) => ({
    canceledNumbers: [],
    updateCanceledNumbers: (newNumbers) => set({canceledNumbers: newNumbers})
}))

export const useGameOver = create((set) => ({
    isGameOver: false,
    isWinner: false,
    gameOverMessage: "",
    updateIsGameOver: (data) => set({isGameOver: data}),
    updateGameOverMessage: (data) => set({gameOverMessage: data}),
    updateIsWinner: (data) => set({isWinner: data})
}))