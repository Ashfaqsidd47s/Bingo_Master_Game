import React, { useEffect } from 'react'
import { INIT_GAME } from '../utils/messages';
import { useBoard } from '../hooks/useBoard';

export default function StartGame({ socket }) {
  const board = useBoard((state) => state.board);
  const updateBoard = useBoard((state) => state.updateBoard);
  
  const startGame = () => {
    if(!socket) return;
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
        updateBoard(board)
      } else{
        updateBoard(null)
      }
      console.log("board :" + board)
    }

    console.log("get the message")
    
  }, [socket])
  

  return (
    <div className=' w-[386px] md:w-[436px] h-[100px] self-center flex flex-col items-center justify-center' >
      <button 
        className=' w-[120px] bg-pink-300 rounded-md p-4 font-semibold text-lg' 
        onClick={startGame}
      >start</button>
    </div>
  )
}
