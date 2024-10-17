import React, { useEffect, useState } from 'react'
import Board from '../components/Board'
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';
import StartGame from '../components/StartGame';
import { useBoard, useGameOver } from '../hooks/useBoard';
import GameOver from '../components/dialougBoxs/GameOver';


function Game() {
  const socket = useSocket();
  const board = useBoard((state) => state.board);
  const updateBoard = useBoard((state) => state.updateBoard);
  const {user, setUser} = useUser();
  const isGameOver = useGameOver((state) => state.isGameOver);
  const updateIsGameOver = useGameOver((state) => state.updateIsGameOver);
  const gameOverMessage = useGameOver((state) => state.gameOverMessage);
  const isWinner = useGameOver((state) => state.isWinner);

  const logOut = async ()=>{
    try {
      const res = await axios.get("http://localhost:8080/logout" , { withCredentials: true });
      setUser(null);
      updateBoard(null);
      console.log(res.data)
    } catch (err) {
      console.log("someting went wrong :" + err)
    }
  }

  const handelGameOver = () => {
    updateIsGameOver(false)
    window.location.reload();
  }


  
  if(!socket) return <div>Connecting...</div>
  
  return (
    <div className='w-full h-[100vh] p-4 flex items-center justify-center'>
      <div className="container w-full h-full p-4 border-2 border-indigo-600 flex flex-col items-center justify-center">
        <div className=' absolute z-50 top-8 right-12'>
          <button 
            className=' bg-indigo-400 p-4 w-[120px] rounded-sm font-semibold hover:bg-indigo-500'
            onClick={logOut}
          >
            Log out
          </button>
        </div>
        <div className="usersInfo p-2 w-[386px] md:w-[436px] h-[80px] border-2 border-indigo-600 flex items-center justify-between">
          {user?.email}
        </div>
        <div className="boardContainer w-full h-[85%] flex flex-col items-center justify-center">
          { board ? 
            <Board boardInfo={board} socket={socket} /> :
            <StartGame socket={socket} />
          }
        </div>
        <GameOver 
          isOpen={isGameOver}
          title="Game Over"
          message={gameOverMessage}
          onClose={handelGameOver}
          isWinner={isWinner}
        />
      </div>
    </div>
  )
}

export default Game