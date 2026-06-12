import React from 'react'
import Text1 from './Text1'
import {ArrowDownLeft} from 'lucide-react'
const WorkHero = () => {
  return (
    <div className='w-[90vw] m-auto  bg-white h-screen flex flex-col justify-center gap-10'>

        {/* 1st */}
        <div className='flex justify-between'>
            <div className=''>
                <p className='text-[7vw] leading-[7.5vw] '><Text1 text='We are expert in' /></p>
                <p className='text-[7vw] leading-[7.5vw]'><Text1 text='bringing brand to' /></p>
                <p className='text-[7vw] leading-[7.5vw]'><Text1 text='life digital' /></p>
            </div>

            <div className='rounded-full w-80 overflow-hidden bg-amber-600'>
           <img className='w-full h-full' src="https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" alt="" />
            </div>

          
        </div>


        {/* 2nd */}
      <div className=' pt-5 flex justify-between gap-32 items-center'>
  
  <h1 className=' text-[4vw] font-bold w-1/2 leading-[4vw] px-4 border-l-2 border-black'>
    <Text1 text="work" />
  </h1>

  <p className='w-1/2'>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae maiores facere ipsa!
    Nobis earum tempora aspernatur, magnam incidunt quae possimus.
  </p>

  {/* ICON BOX — perfect vertical alignment */}
  <div className="w-[200px]  flex items-center justify-center">
    <ArrowDownLeft size={150} strokeWidth={1} />
  </div>
</div>

    </div>
  )
}

export default WorkHero