import React from 'react'
import BlogList from '../components/BlogList'

const Blog = () => {
  return (
    <div>
        <div className='w-[90%] m-auto'>
            <h2 className='text-[7vw] w-[70%] leading-[7vw] mt-22 mb-8'>News, insights,
& creative culture
from KOTA</h2>

<img className='w-full rounded-tr-[15vw]' src="https://kota-content.b-cdn.net/app/uploads/2024/02/blog-header.webp" alt="" />
<p className='py-10 border-b border-zinc-900 text-[3vw]'>Creating the KOTAverse to celebrate 10 years of KOTA</p>
        </div>
        <BlogList/>
    </div>
  )
}

export default Blog