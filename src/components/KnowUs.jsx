 import React, { useState } from 'react'
 import Projects from './Brand-led/Projects';
 import Scene from './Brand-led/Scene';


const KnowUs = () => {
      const [activeMenu, setActiveMenu] = useState(null)
  return (
     <div className='bg-white relative z-50'>
       <Projects setActiveMenu={setActiveMenu}/>
       <Scene activeMenu={activeMenu}/>
     </div>
  )
}

export default KnowUs;