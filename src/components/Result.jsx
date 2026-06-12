import React from 'react'
import StackCards from './StackCards'

const Result = () => {
  return (
    <div className='h-screen flex justify-center items-center bg-black'>
        <StackCards cardDimensions = { {width:1000, height: 500} } />
    </div>
  )
}

export default Result
