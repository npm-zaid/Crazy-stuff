
import React from 'react'
import AnimatedGrid from '../components/AnimatedGrid'
import ElasticGrid from '../components/ElasticGrid'
import WorkHero from '../components/WorkHero'
import WorkList from '../components/WorkList'
import OverlayTransition from '../components/OverlayTransition'



const Work = () => {
  return (
  <div>
    <OverlayTransition/>
    <WorkHero />
    <WorkList/>
 
  </div>
  )
}

export default Work