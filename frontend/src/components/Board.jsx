import React from 'react'
import { boardDetails } from '../utils/boardDetails';
import Tile from './Tile';

function Board({boardInfo, socket}) {
    const newArray = boardInfo.resBoard;
    const bingoCounts = boardInfo.count;
    const head = ['B', 'I', 'N', 'G', 'O'];
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
        <div className='p-3 w-[max-content] border-2 border-indigo-600 border-b-0 flex gap-1'>
            {head.map((item, i)=>(
                <div className={` w-[70px] h-[70px] md:w-[75px] md:h-[75px] border-2 border-indigo-500 rounded-sm flex items-center justify-center font-semibold text-3xl ${i < bingoCounts ? "bg-indigo-400":""}`}>{item}</div>
            ))}
        </div>

        <div className=' p-3 w-[max-content] border-2 border-indigo-600 grid grid-cols-5 gap-1'>
            {newArray.map((item,r) => (
                item.map((value, c)=>(
                    <Tile value={value} socket={socket} />
                ))
            ))}
        </div>
    </div>
  )
}

export default Board