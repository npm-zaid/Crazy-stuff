'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGithub as Github, FaSlack as Slack, FaTwitter as Twitter } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function StaggeredGrid({
  images = [],
  bentoItems,
  centerText = "Halcyon",
  credits = {
    madeBy: { text: "@codrops", href: "https://x.com/codrops" },
    moreDemos: { text: "More demos", href: "https://tympanus.net/codrops/demos" }
  },
  className = "",
  showFooter = true
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const gridFullRef = useRef(null)
  const textRef = useRef(null)
  const [activeBento, setActiveBento] = useState(0)

  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  useEffect(() => {
    document.body.classList.remove('loading')
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char')
      gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top bottom',
          end: 'center center-=25%',
          scrub: 1,
        }
      }).from(chars, {
        ease: 'sine.out',
        yPercent: 300,
        autoAlpha: 0,
        stagger: { each: 0.05, from: 'center' }
      })
    }

    if (gridFullRef.current) {
      const gridFullItems = gridFullRef.current.querySelectorAll('.grid__item')
      const numColumns = getComputedStyle(gridFullRef.current)
        .getPropertyValue('grid-template-columns').split(' ').length
      const middleColumnIndex = Math.floor(numColumns / 2)

      const columns = Array.from({ length: numColumns }, () => [])
      gridFullItems.forEach((item, index) => {
        columns[index % numColumns].push(item)
      })

      columns.forEach((columnItems, columnIndex) => {
        const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2
        gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          }
        })
          .from(columnItems, {
            yPercent: 450,
            autoAlpha: 0,
            delay: delayFactor,
            ease: 'sine.out',
          })
          .from(columnItems.map(item => item.querySelector('.grid__item-img')), {
            transformOrigin: '50% 0%',
            ease: 'sine.out',
          }, 0)
      })

      const bentoContainer = gridFullRef.current.querySelector('.bento-container')
      if (bentoContainer) {
        gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            start: 'top top+=15%',
            end: 'bottom center',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        }).to(bentoContainer, {
          y: window.innerHeight * 0.1,
          scale: 1.5,
          zIndex: 1000,
          ease: 'power2.out',
          duration: 1,
          force3D: true
        }, 0)
      }
    }
  }, [isLoaded])

  const safeImages = Array.isArray(images) && images.length > 0 ? images : Array(31).fill('icon')
  const mixedGridItems = [...safeImages, ...safeImages, safeImages[0]].slice(0, 31)
  mixedGridItems[16] = 'BENTO_GROUP'

  return (
    <div
      className={cx("shadow relative overflow-hidden w-full bg-zinc-900", className)}
      style={{ '--grid-item-translate': '0px' }}
    >
      <section className="grid place-items-center w-full relative mt-[10vh]">
        <div
          ref={textRef}
          className="text font-alt uppercase flex content-center text-[clamp(3rem,14vw,10rem)] leading-[0.7] text-neutral-900 dark:text-white"
        >
          {splitText(centerText)}
        </div>
      </section>

      <section className="grid place-items-center w-full relative">
        <div
          ref={gridFullRef}
          className="grid--full relative w-full my-[10vh] h-auto aspect-[1.1] max-w-none p-4 grid gap-4 grid-cols-7 grid-rows-5"
        >
          <div className="grid-overlay absolute inset-0 z-[15] pointer-events-none opacity-0 bg-white/80 dark:bg-black/80 rounded-lg transition-opacity duration-500" />

          {mixedGridItems.map((item, i) => {
            if (item === 'BENTO_GROUP') {
              if (!bentoItems || bentoItems.length === 0) return null
              return (
                <div
                  key="bento-group"
                  className="grid__item bento-container col-span-3 row-span-1 relative z-20 flex items-center justify-center gap-2 h-full w-full will-change-transform"
                >
                  {bentoItems.map((bentoItem, index) => {
                    const isActive = activeBento === index
                    return (
                      <div
                        key={bentoItem.id}
                        className={cx(
                          "relative cursor-pointer overflow-hidden rounded-2xl h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                          isActive ? "bg-zinc-900/10 shadow-2xl" : "bg-zinc-950"
                        )}
                        style={{ width: isActive ? "60%" : "20%" }}
                        onMouseEnter={() => setActiveBento(index)}
                        onClick={() => setActiveBento(index)}
                      >
                        <div className={cx(
                          "absolute inset-0 rounded-2xl border z-50 pointer-events-none transition-colors duration-700",
                          isActive ? "border-zinc-500/50" : "border-zinc-800/50"
                        )} />

                        <div className="relative z-10 w-full h-full flex flex-col p-0">
                          <div className={cx(
                            "absolute inset-0 flex flex-col transition-all duration-500 ease-in-out",
                            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                          )}>
                            <div className="absolute inset-0 bg-zinc-900 overflow-hidden z-0 group/img">
                              {bentoItem.image && (
                                <>
                                  <img
                                    src={bentoItem.image}
                                    alt={bentoItem.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-90"
                                  />
                                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                                </>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-between px-5 z-20">
                              <h3 className="text-sm font-bold text-white drop-shadow-md">{bentoItem.title}</h3>
                              <div className="text-white/90">{bentoItem.icon}</div>
                            </div>
                          </div>
                        </div>

                        <div className={cx(
                          "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-500",
                          isActive ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                        )}>
                          <div className="text-white/50">{bentoItem.icon}</div>
                          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{bentoItem.title}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            if (i === 17 || i === 18) return null

            if (typeof item === 'string') {
              const Icon = i % 3 === 0 ? Github : i % 3 === 1 ? Slack : Twitter
              const label = i % 3 === 0 ? "Github" : i % 3 === 1 ? "Slack" : "Twitter"
              return (
                <figure key={`img-${i}`} className="grid__item m-0 relative z-10 [perspective:800px] will-change-[transform,opacity] group cursor-pointer">
                  <div className="grid__item-img w-full h-full [backface-visibility:hidden] will-change-transform rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                      <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-500 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                      <div className="text-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        <span className="block text-[10px] font-medium text-white/90 uppercase tracking-wider mb-0.5">Build with</span>
                        <span className="block text-sm font-bold text-white tracking-tight">{label}</span>
                      </div>
                    </div>
                  </div>
                </figure>
              )
            }

            return null
          })}
        </div>
      </section>

    
    </div>
  )
}

export default StaggeredGrid