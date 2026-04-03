import React from 'react'
import LogoAnimation from '../auth/LogoAnimation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const SplashScreen = () => {
    useGSAP(() => {
        const t1 = gsap.timeline();
        t1.from(".spAnimation1", {
            x: -800,
            delay: 0.3,
            duration: 1,
            ease: "power2.out"
        })
    })
    return (
        <div className='bg-[#0B0B0F] text-white gap-4 flex flex-col items-center justify-center h-screen w-screen overflow-x-hidden overflow-y-auto'>

            {/* LOGO ANIMATION  */}
            <div>
                <LogoAnimation />
            </div>

            <div className='flex flex-col items-center gap-2 spAnimation1'>
                <p className='text-gray-400 text-lg tracking-widest uppercase'>
                    Buy Smart. Sell Fast.
                </p>
                <div className='flex items-center gap-3 text-sm text-gray-500 tracking-widest uppercase'>
                    <p>Post Ads</p>
                    <span className='text-yellow-400'>✦</span>
                    <p>Find Deals</p>
                </div>
            </div>
        </div>
    )
}

export default SplashScreen