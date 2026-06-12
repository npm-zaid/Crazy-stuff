import React from 'react'
import Text1 from './Text1'
import {ArrowDownLeft} from 'lucide-react'

const Partners = () => {
  return (
    <div className=' bg-black p-4 text-white'>
        <div className='  flex justify-between items-end'> 
            <div>
            <p className='text-[12vw] leading-[12vw] uppercase '><Text1 text='Our' /></p>
            <p className='text-[12vw] leading-[12vw] uppercase ml-[8vw] '><Text1 text='Partners' /></p>
            </div>

             <div className="">
                <ArrowDownLeft size={32} strokeWidth={1}  className=' w-[15vw] h-[15vw] '/>
              </div>
        </div>

        <div className='grid grid-cols-5 row-span-3  w-[90vw] m-auto mt-10 gap-8'>
            {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className='box-border  p-8'>
                        <img className='w-[7vw] m-auto' src="https://kota-content.b-cdn.net/app/uploads/2023/10/raw.svg" alt="" />
                    </div>
                                          ))}         
        </div>

    </div>
  )
}

export default Partners