import React from 'react'
import StackCards from '../components/StackCards'
 const Testimonial = () => {
  return (
    <div className='bg-black grid grid-cols-2 text-white h-screen  items-center px-20'>
        <h3 className='text-[8vw] leading-[8vw]'>What our
clients say</h3>

<div className='p-4 bg-zinc-900 relative h-full'>

          <StackCards
  randomRotation={true}
  sensitivity={280}
  sendToBackOnClick={false}
  cardDimensions={{ width: 400, height: 500 }}
 
/>

{/* 
    <div className='h-[90vh] slide bg-sky-400 rounded-tr-[12vw] w-[80%] scale-90 left-10 absolute'> 
        <button className='px-4 py-2 bg-black text-white uppercase rounded-full'>next</button>
    </div>
    <div className='h-[90vh] slide bg-red-400 rounded-tr-[12vw] w-[80%] scale-95 left-15 absolute'> 
        <button className='px-4 py-2 bg-black text-white uppercase rounded-full'>next</button>
    </div>
    <div className='h-[90vh] slide bg-yellow-400 rounded-tr-[12vw] w-[80%] scale-100 left-20 absolute'> 
        <button className='px-4 py-2 bg-black text-white uppercase rounded-full'>next</button>
    </div> */}
  
</div>
    </div>
  )
}

export default Testimonial;
