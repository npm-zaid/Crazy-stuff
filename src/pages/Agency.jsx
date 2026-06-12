import AgencyHero from '../components/AgencyHero'
import Mission from '../components/Mission'
import FallingText from '../components/FallingText'
import FallingBox from '../components/FallingBox'
import TeamSlider from '../components/TeamSlider'
import FallBoxes from '../components/FallBoxes'
import HyperText from '../components/HyperText'
import LayeredStack from '../components/stuff/Layeredstack'
import StaggeredGrid from '../components/stuff/Staggeredgrid'
import GooeyMenu from '../components/Gooeymenu'
import ShaderGallery from '../components/stuff/shadergallery'
import GooCardReveal from '../components/stuff/GooCardReveal'
import MorphingText from '../components/stuff/MorphingText'


const Agency = () => {
  return (
    
    <div>
      <GooeyMenu/>
        <AgencyHero />
        <ShaderGallery/>
        <MorphingText/>
        <GooCardReveal/>
        {/* <Mission /> */}
     
       
        <StaggeredGrid/>
        <LayeredStack/>
       <div className='h-[50vh] bg-sky-300/50 flex justify-center items-center'>

       <HyperText text="hello rehman"  className='text-5xl uppercase'/></div>
        
        <FallingText text={`React Bits is a library of animated and interactive React components designed to streamline UI development and simplify your workflow.`}
      highlightWords={["React", "Bits", "animated", "components", "simplify"]}
     highlightClass="highlighted"
     trigger="scroll"
  backgroundColor="transparent"
  wireframes={false}
  gravity={0.56}
  fontSize="2rem"
  mouseConstraintStiffness={0.9}/>

<FallingBox
  trigger="scroll"
  gravity={0.6}
  items={[
    { id: 1, w: 150, h: 150, content: <img src="https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" className="w-full h-full object-cover rounded-xl" /> },
    { id: 2, w: 180, h: 120, content: <div className="bg-cyan-500 text-white p-4 rounded-xl">Hello Box</div> },
    { id: 3, w: 140, h: 140, content: <div className="bg-black text-white p-6 rounded-lg">⚡ React Rocks</div> },
    { id: 4, w: 200, h: 120, content: <img src="https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" className="w-full h-full rounded-lg" /> },
    { id: 5, w: 180, h: 120, content: <div className="bg-cyan-500 text-white p-4 rounded-xl">Hello Box</div> },
    { id: 6, w: 200, h: 120, content: <img src="https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" className="w-full h-full rounded-lg" /> },
    { id: 7, w: 180, h: 120, content: <div className="bg-cyan-500 text-white p-4 rounded-xl">Hello Box</div> },
    { id: 8, w: 200, h: 120, content: <img src="https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" className="w-full h-full rounded-lg" /> },
    
  ]}
/>

<FallBoxes 
items={[
  { id: 1, type: "ball", size: 120, content: <img src="/path/to/your/image1.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 2, type: "ball", size: 120, content: <img src="/path/to/your/image2.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 3, type: "pill", size: 120, content: <img src="/path/to/your/image3.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 4, type: "ball", size: 120, content: <img src="/path/to/your/image4.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 5, type: "ball", size: 120, content: <img src="/path/to/your/image5.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 6, type: "ball", size: 120, content: <img src="/path/to/your/image6.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 7, type: "ball", size: 120, content: <img src="/path/to/your/image7.jpg" className="w-full h-full object-cover rounded-full" /> },
  { id: 8, type: "ball", size: 120, content: <img src="/path/to/your/image8.jpg" className="w-full h-full object-cover rounded-full" /> },

] }
/>

<TeamSlider/>
<div className='h-screen bg-zinc-300'></div>
    </div>

  )
}

export default Agency