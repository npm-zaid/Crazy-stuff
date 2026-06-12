import React from 'react'
import { projects } from './data';

export default function Projects({setActiveMenu}) {
  return (
    <div className='relative mix-blend-difference z-10 text-white min-h-screen w-full'>
      <ul onMouseLeave={() => {setActiveMenu(null)}} className='border-b'>
        {
          projects.map( (project, i) => {
            return (
              <li onMouseOver={() => {setActiveMenu(i)}} key={project.title} className='text-[4vw] p-10 border-t'>
                <p>{project.title}</p>
                
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
