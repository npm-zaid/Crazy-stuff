import React from 'react'
import Text1 from './Text1'

const WorkSubSec = () => {
  return (
    <div className='grid grid-cols-12 bg-black text-white p-10 gap-10'> 
        <div className='col-span-6 h-[70vh]  flex flex-col justify-end'> 
            <p className='text-[10vw] leading-[10vw] uppercase '><Text1 text='Our' /></p>
             <p className='text-[10vw] leading-[10vw] uppercase ml-[8vw] '><Text1 text='Work' /></p>
            </div>
        <div className='col-span-6 h-[70vh] '>
            <h3 className='text-[5vw] mb-10  leading-[5vw]'>Making brands a damn site better.</h3>
            <p className='text-xl'>Let’s face it, first impressions matter. Your website’s an opportunity to wow your audience, so why choose bad design? Brands win over fans when they’re brave enough to go beyond their creative comfort zone.</p>
        </div>
         <div className='col-span-12 p-4 '>
           <div className="work-card border border-zinc-400 rounded-2xl">
            <div className="flex justify-between p-4">
              <p>name </p>
              <p>2025</p>
            </div>
            <div className="h-[70vh] bg-sky-300/60 rounded-2xl"></div>
          </div>
         </div>
         {/* work */}
          <div className='col-span-6 p-4'>
            <div className="work-card border border-zinc-400 rounded-2xl">
            <div className="flex justify-between p-4">
              <p>name </p>
              <p>2025</p>
            </div>
            <div className="h-[50vh] bg-sky-300/60 rounded-2xl"></div>
          </div>
          </div>

           <div className='col-span-6 p-4'>
            <div className="work-card border border-zinc-400 rounded-2xl">
            <div className="flex justify-between p-4">
              <p>name </p>
              <p>2025</p>
            </div>
            <div className="h-[50vh] bg-sky-300/60 rounded-2xl"></div>
          </div>
           </div>

            <div className='col-span-6 p-4'>
                <div className="work-card border border-zinc-400 rounded-2xl">
            <div className="flex justify-between p-4">
              <p>name </p>
              <p>2025</p>
            </div>
            <div className="h-[50vh] bg-sky-300/60 rounded-2xl"></div>
          </div>
            </div>

             <div className='col-span-6 p-4'>
                <div className="work-card border border-zinc-400 rounded-2xl">
            <div className="flex justify-between p-4">
              <p>name </p>
              <p>2025</p>
            </div>
            <div className="h-[50vh] bg-sky-300/60 rounded-2xl"></div>
          </div>
             </div>
       
    </div>
  )
}

export default WorkSubSec