import React from 'react'
import Text1 from './Text1'



const Mission = () => {
  return (
  <div className='w-[90vw] m-auto'>

    <div className=' flex justify-between py-10'>
        <h2 className='text-[11vw] leading-[11vw]'>
            <Text1 text="OUR" />
            <h2 className='ml-[8vw]'><Text1 text="MISSION" /></h2>
        </h2>

     <div className='w-[20vw]  rounded-full overflow-hidden'>
           <img className='w-full h-full object-cover' src="https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" alt="" />
     </div>
        
    </div>


    <div className='p-8  flex gap-8 py-10'>
        <div className='w-full p-4'>
            <h2 className='text-[4vw] leading-[4.5vw]'>To make the digital world more beautiful, thoughtful & impactful.</h2>
        </div>
         <div className='w-full p-4'>
           <p className='text-[1.5vw]'> Every pixel matters to us because we know it matters to our clients. We understand that great creativity is not simply about big ideas; it’s also about the smallest details. Our focus on the minutiae is not just an obsession, it’s a reflection of our commitment to providing the highest quality service, and we’re really proud of that.</p>
         </div>

    </div>

  
     </div>

  )
}

export default Mission
