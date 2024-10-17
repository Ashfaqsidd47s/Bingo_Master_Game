import React from 'react'

function Tile({value, socket}) {
  const cancelTile = ()=> {
    try {
      socket.send(JSON.stringify({
        type: "cancel_number",
        number: value.val
      }))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div 
      className={` w-[70px] h-[70px] md:w-[75px] md:h-[75px] border-2 border-indigo-500 rounded-sm flex items-center justify-center font-semibold text-3xl relative hover:rounded-lg duration-300 hover:bg-indigo-100 cursor-pointer`}
      onClick={cancelTile}
    >
        <span className=' z-10'>{value.val}</span>
        <span className={` w-full h-full absolute z-0 ${value.isCanceled ? " bg-indigo-300":""}`}></span>
        <span className={` w-[120%] h-2 absolute z-20 ${value.isRow ? " bg-indigo-700":""}`}></span>
        <span className={` w-2 h-[120%] absolute z-20 ${value.isCol ? " bg-indigo-700":""}`}></span>
        <span className={` w-[160%] h-2 absolute rotate-[45deg] z-20 ${value.isDig1 ? " bg-indigo-700":""}`}></span>
        <span className={` w-[160%] h-2 absolute rotate-[-45deg] z-20 ${value.isDig2 ? " bg-indigo-700":""}`}></span>
    </div>
  )
}

export default Tile