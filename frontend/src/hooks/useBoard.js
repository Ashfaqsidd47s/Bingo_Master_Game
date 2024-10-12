import { create } from 'zustand';

export const useBoard = create((set) => ({
    board: null,
    updateBoard: (newBoard) => set({board: newBoard})
}))