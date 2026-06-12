'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
const tabs = [
  {
    title: 'How do UI components improve UX?',
    description:
      'UI components can improve UX by providing familiar, consistent interactions that make it easy for users to navigate and interact with an application.',
    imageUrl:
      'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  },
  {
    title: 'Common UI component design challenges?',
    description:
      'Some common challenges include maintaining consistency across different devices and screen sizes, ensuring compatibility with various browsers and assistive technologies, and balancing flexibility with ease of use.',
    imageUrl:
      'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  },
  {
    title: 'Ensuring UI component responsiveness?',
    description:
      '     Developers can ensure the responsiveness of UI components by using techniques such as fluid layouts, flexible grids, and media queries to adapt the components to different screen sizes and orientations.',
    imageUrl:
      'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  },
   {
    title: 'How do UI components improve UX?',
    description:
      'UI components can improve UX by providing familiar, consistent interactions that make it easy for users to navigate and interact with an application.',
    imageUrl:
      'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  },
  {
    title: 'Common UI component design challenges?',
    description:
      'Some common challenges include maintaining consistency across different devices and screen sizes, ensuring compatibility with various browsers and assistive technologies, and balancing flexibility with ease of use.',
    imageUrl:
      'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  },
  {
    title: 'Ensuring UI component responsiveness?',
    description:
      '     Developers can ensure the responsiveness of UI components by using techniques such as fluid layouts, flexible grids, and media queries to adapt the components to different screen sizes and orientations.',
    imageUrl:
      'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  },
 
  
];
function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(tabs[0]);
  const handleClick = async (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    const newActiveItem = tabs.find((_, i) => i === index);
    setActiveItem(newActiveItem);
  };
  return (
    <>
      <div className="container mx-auto pb-10 pt-2 bg-black px-10 ">
        <h3 className="uppercase text-white  text-[7vw] font-bold pt-2 pb-4">
          FAQ's
        </h3>
        <div className="h-fit border  rounded-lg p-2 dark:bg-[#111111] bg-[#F2F2F2]">
          {tabs.map((tab, index) => (
            <motion.div
              key={index}
              className={`overflow-hidden text-xl  ${index !== tabs.length - 1 ? 'border-b' : ''}`}
              onClick={() => handleClick(index)}>
              <button
                className={`p-3 px-2 w-full cursor-pointer   items-center transition-all font-semibold dark:text-white text-black   flex gap-2 
               `}>
                <Plus
                  className={`${activeIndex === index ? 'rotate-45' : 'rotate-0 '} transition-transform ease-in-out w-5 h-5  dark:text-gray-200 text-gray-600`}
                />
                {tab.title}
              </button>
              <AnimatePresence mode="sync">
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeInOut',
                      delay: 0.14,
                    }}>
                    <p
                      className={`dark:text-white text-black p-3 pt-0 w-[90%]`}>
                      {tab.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
export default FAQ;
