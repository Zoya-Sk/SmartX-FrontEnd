import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React from 'react'

const LogoAnimation = () => {
  useGSAP(()=>{
    const t1 = gsap.timeline();

    t1.from(".smart",{
      x:200,
      opacity:0,
      delay:0.3,
      duration:0.6,
    });

    t1.from(".xLogo",{
      y:200,
      opacity:0,
      delay:0.3,
      duration:0.6,
    }, "-=1");
  })
  return (
    <div>
      <h1 className='text-6xl font-bold flex items-center'>
        <p className='smart'>Smart</p>
        <p className='text-yellow-400 text-9xl inline-block xLogo'>
          X
          </p>
          </h1>
    </div>
  )
}

export default LogoAnimation