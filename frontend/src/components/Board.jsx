import React from 'react'
import { boardDetails } from '../utils/boardDetails';
import Tile from './Tile';

function Board({data, canceled}) {
    const newData = boardDetails(data, canceled);
    const newArray = newData.resBoard;
    const head = ['B', 'I', 'N', 'G', 'O'];
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
        <div className='p-2 w-[max-content] border-2 border-slate-600 flex gap-1'>
            {head.map((item, i)=>(
                <div className={` w-[70px] h-[70px] md:w-[80px] md:h-[80px] border-2 border-slate-500 flex items-center justify-center font-semibold text-3xl `}>{item}</div>
            ))}
        </div>

        <div className=' p-2 w-[max-content] border-2 border-slate-600 grid grid-cols-5 gap-1'>
            {newArray.map((item,r) => (
                item.map((value, c)=>(
                    <Tile value={value} />
                ))
            ))}
        </div>
    </div>
  )
}

export default Board