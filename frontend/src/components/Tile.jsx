import React from 'react'

function Tile({value}) {
  return (
    <div className={` w-[70px] h-[70px] md:w-[80px] md:h-[80px] border-2 border-slate-500 flex items-center justify-center font-semibold text-3xl relative `}>
        <span className=' z-10'>{value.val}</span>
        <span className={` w-full h-full absolute z-0 ${value.isCanceled ? " bg-red-200":""}`}></span>
        <span className={` w-[120%] h-2 absolute z-20 ${value.isRow ? " bg-red-500":""}`}></span>
        <span className={` w-2 h-[120%] absolute z-20 ${value.isCol ? " bg-red-500":""}`}></span>
        <span className={` w-[160%] h-2 absolute rotate-[45deg] z-20 ${value.isDig1 ? " bg-red-500":""}`}></span>
        <span className={` w-[160%] h-2 absolute rotate-[-45deg] z-20 ${value.isDig2 ? " bg-red-500":""}`}></span>
    </div>
  )
}

export default Tile