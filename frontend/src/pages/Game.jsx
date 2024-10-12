import React, { useEffect, useState } from 'react'
import Board from '../components/Board'
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';
import StartGame from '../components/StartGame';
import { useBoard } from '../hooks/useBoard';

function Game() {
  const socket = useSocket();
  const board = useBoard((state) => state.board);
  const {user, setUser} = useUser();

  const logOut = async ()=>{
    try {
      const res = await axios.get("http://localhost:8080/logout" , { withCredentials: true });
      setUser(null);
      console.log(res.data)
    } catch (err) {
      console.log("someting went wrong :" + err)
    }
  }

  

  const bingoBoard = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25]
  ];
  const canceled = [1,3,5,6,7,8, 2, 4, 13,19, 25, 18, 23]

  
  if(!socket) return <div>Connecting...</div>
  
  return (
    <div className='w-full h-[100vh] p-4 flex items-center justify-center'>
      <div className="container w-full h-full p-4 border-2 border-slate-700 flex flex-col items-center justify-center">
        <div className=' absolute z-50 top-8 right-12'>
          <button 
            className=' bg-pink-300 p-4 w-[120px] rounded-sm font-semibold hover:bg-pink-400'
            onClick={logOut}
          >
            Log out
          </button>
        </div>
        <div className="usersInfo w-[386px] md:w-[436px] h-[100px] border-2 border-slate-700 flex items-center justify-between">
          {user?.email}
        </div>
        <div className="boardContainer w-full h-[85%] flex flex-col items-center justify-center">
          { board ? 
            <Board data={bingoBoard} canceled={canceled} /> :
            <StartGame socket={socket} />
          }
        </div>
      </div>
    </div>
  )
}

export default Game