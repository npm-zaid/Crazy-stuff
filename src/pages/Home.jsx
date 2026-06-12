import React from 'react'
import Hero from '../components/Hero'
import LiquidEther from '../components/LiquidEther'
import StickySection from '../components/StickySection'
import Waves from '../components/Waves'
import KnowUs from '../components/KnowUs'
import AnimatedGrid from '../components/AnimatedGrid'

import WorkSubSec from '../components/WorkSubSec'
import Partners from '../components/Partners'
import Testimonial from '../components/Testimonial'
import StackCards from '../components/StackCards'
import FAQ from '../components/FAQ'
import  Marquee from '../components/Marquee'
import Result  from '../components/Result'
import StickerPeel from '../components/StickerPeel'
import SplashCursor from '../components/SplashCursor'
import Team from '../components/Team'
import WaterScene from '../components/WaterScene'
import TubesHero from '../components/TubesHero'
import LightPillar from '../components/LightPillar'
 import CyberReveal from '../components/stuff/Cyberreveal'


const logo = 'https://zaid-craft-studio.vercel.app/assets/logo-LvFQGu9J.png'

const Home = () => {
  return (
      <div>
           {/* <div className='w-full h-screen fixed z-0'>
          <LiquidEther
            colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
           </div> */}
{/* 
           <Waves
  lineColor="#C5B5F1"
  backgroundColor="rgba(255, 255, 255, 0.2)"
  waveSpeedX={0.02}
  waveSpeedY={0.01}
  waveAmpX={40}
  waveAmpY={20}
  friction={0.9}
  tension={0.01}
  maxCursorMove={120}
  xGap={12}
  yGap={36}
/> */}

{/* <div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <LightPillar
    topColor="#5227FF"
    bottomColor="#FF9FFC"
    intensity={1.0}
    rotationSpeed={0.3}
    glowAmount={0.005}
    pillarWidth={3.0}
    pillarHeight={0.4}
    noiseIntensity={0.5}
    pillarRotation={0}
    interactive={false}
    mixBlendMode="normal"
  />
</div> */}

          <Hero />
              <div className='h-screen bg-zinc-900'> <StickerPeel
  imageSrc={logo}
  width={200}
  rotate={10}
  peelBackHoverPct={20}
  peelBackActivePct={40}
  shadowIntensity={0.6}
  lightingIntensity={0.1}
  initialPosition={{ x: -100, y: 100 }}
/></div>
<CyberReveal/>
          <StickySection />
          <KnowUs />
         
          <WorkSubSec/> 
           <Partners/>
          <Testimonial/>
          <FAQ/>
          <Marquee/>

 
          
      </div>
    ) 
}

export default Home