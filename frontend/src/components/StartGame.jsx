import React, { useEffect, useState } from 'react'
import { INIT_GAME } from '../utils/messages';
import { useBoard, useGameOver } from '../hooks/useBoard';

export default function StartGame({ socket }) {
  const board = useBoard((state) => state.board);
  const updateBoard = useBoard((state) => state.updateBoard);
  const [gameRequested, setGameRequested] = useState(false);
  const  updateIsGameOver = useGameOver( (state) => state.updateIsGameOver);
  const  updateGameOverMessage = useGameOver( (state) => state.updateGameOverMessage);
  const  updateIsWinner = useGameOver( (state) => state.updateIsWinner);
  
  const startGame = () => {
    if(!socket) return;
    setGameRequested(true);
    socket.send(JSON.stringify ({
      type: INIT_GAME
    }))
  }

  useEffect(() => {
    if(!socket) return;
    socket.send(JSON.stringify({
      type: "connect_game"
    }))

  },[])

  useEffect(() => {
    console.log("waiting for message")
    console.log("socket  some changes happen :" + socket)
    if(!socket) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if(data.board){
        updateBoard(data.board)
      } 
      if(data.winner){
        updateIsGameOver(true);
        updateIsWinner(data.winner == data.id);
        updateGameOverMessage(data.message);
        console.log("game over winner is " + data.winner)
      }
      console.log("board :" + board)
    }
    
  }, [socket])
  
  if(gameRequested) return (
    <div className=' w-[386px] md:w-[436px] h-[100px] self-center flex flex-col items-center justify-center gap-5'>
      <img className=' w-[100px] h-[100px] animate-spin duration-[6000ms]' src="./loading.png" alt="" />
      <p className=' font-semibold text-xl text-indigo-500'>serching for opponent</p>
    </div>
  )

  return (
    <div className=' w-[386px] md:w-[436px] h-[100px] self-center flex flex-col items-center justify-center' >
      <button 
        className=' w-[120px] bg-indigo-400 rounded-md p-4 font-semibold text-lg hover:bg-indigo-500' 
        onClick={startGame}
      >start</button>
    </div>
  )
}
