import React, { useEffect } from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Work from './pages/Work'
import Navbar from './components/Navbar'
import Lenis from '@studio-freight/lenis'

import Agency from './pages/Agency'
import Blog from './pages/Blog'
import Footer from './components/Footer'
import Culture from './pages/Culture'
import WaterScene from './components/WaterScene'
import Contact from './pages/Contact'
import Infiniteportraitgallery from './pages/Infiniteportraitgallery'
import CollectionSurfer from './pages/collection-surfer'

import { PixelCanvas } from './pages/pixel-canvas'
import CursorParticleTypography from './pages/Cursorparticletypography'

import MugsyMugs from './pages/MugsyMugs'
import ParallaxHero from './pages/ParallaxHero'
import InfiniteImageBands from './pages/Infiniteimagebands'
import DisplacementSlider from './pages/Displacementslider'

import Scrollinggallery from './pages/Scrollinggallery'

import Spiralgallery from './pages/Spiralgallery'

import DepthParallaxGallery from './pages/DepthParallaxGallery'
import Cylindertextanimation from './pages/Cylindertextanimation'

import Fashiongallery from './pages/Fashiongallery'
import Liquidbackground from './pages/Liquidbackground'

import Nova from './pages/Nova'
import Elasticstrings from './pages/Elasticstrings'
import MugsyMugs2 from './pages/Mugsymugs2'
import Logoanimation from './pages/Logoanimation'
import MusicPortfolio from './pages/Musicportfolio'
import Ironhillhero from './pages/Ironhillhero'
import Webglslider from './pages/Webglslider'
import Dharunportfolio from './pages/Dharunportfolio'
import Kpversemenu from './pages/Kpversemenu'
import ThreeSlider from './pages/Threedslider'

const App = () => {



    useEffect(()=>{
   const lenis = new Lenis({
       duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical', 
        smooth: true,
        infinite:false,
        lerp: 0.02,
      
    });
  
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

},[])

  return (
    <div className=''>
      {/* <Navbar />   */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/work' element={<Work />} />
          <Route path='/agency' element={<Agency />} />
           <Route path='/blog' element={<Blog />} />
            <Route path='/culture' element={<Culture />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/infiniteportraitgallery' element={<Infiniteportraitgallery />} />
            <Route path='/collection-surfer' element={<CollectionSurfer />} />
          
            <Route path='/pixel' element={<PixelCanvas />} />
          
            <Route path='/cursorparticletypography' element={<CursorParticleTypography />} />
              <Route path='/mugsymugs' element={<MugsyMugs />} />
               <Route path='/parallaxhero' element={<ParallaxHero />} />
               <Route path='/infiniteimagebands' element={<InfiniteImageBands />} />
               <Route path='/displacement-slider' element={<DisplacementSlider />} />
               <Route path='/scrollinggallery' element={<Scrollinggallery />} />    
               <Route path='/spiralgallery' element={<Spiralgallery />} />
               <Route path='/depthParallaxGallery' element={<DepthParallaxGallery />} />
               <Route path='/cylindertextanimation' element={<Cylindertextanimation />} />
               <Route path='/fashiongallery' element={<Fashiongallery />} />
               <Route path='/liquidbackground' element={<Liquidbackground />} />
              <Route path='/nova' element={<Nova />} />
             <Route path="/mugsymugs2" element={<MugsyMugs2 />} />
             <Route path="/elasticstrings" element={<Elasticstrings />} />
             <Route path="/logonimation" element={<Logoanimation />} />
             <Route path="/musicportfolio" element={<MusicPortfolio />} />
             <Route path="/ironhillhero" element={<Ironhillhero />} />
             <Route path="/webglslider" element={<Webglslider />} />
             <Route path="/dharunportfolio" element={<Dharunportfolio />} />  
             <Route path="/kpversemenu" element={<Kpversemenu />} />  
             <Route path="/threeslider" element={<ThreeSlider />} />  

        </Routes>
      </BrowserRouter>
    
    </div>
  )
}

export default App