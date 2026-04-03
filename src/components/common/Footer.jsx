import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa'
import { MdStorefront } from 'react-icons/md'

const Footer = () => {
    const navigate = useNavigate()

    const links = [
        { label: 'About Us', path: '/about-us' },
        { label: 'Contact', path: '/contact-us' },
        { label: 'Sell', path: '/product-upload' },
        { label: 'Wishlist', path: '/wishlist-products' },
    ]

    return (
        <footer className='w-full mt-16 border-t border-gray-800 bg-[#0a0a0a]'>
            <div className='w-[90vw] mx-auto py-10 flex flex-col gap-8'>

                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>

                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
                        <MdStorefront size={28} className='text-yellow-400' />
                        <span className='text-white text-2xl font-black tracking-tight'>
                            Smart<span className='text-yellow-400'>X</span>
                        </span>
                    </div>

                    <div className='flex flex-wrap gap-6'>
                        {links.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => navigate(link.path)}
                                className='text-gray-400 hover:text-yellow-400 text-sm font-medium transition-colors duration-200'
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className='flex items-center gap-4 text-gray-500'>
                        <a href='https://github.com' target='_blank' rel='noreferrer'
                            className='hover:text-yellow-400 transition-colors duration-200'>
                            <FaGithub size={20} />
                        </a>
                        <a href='https://twitter.com' target='_blank' rel='noreferrer'
                            className='hover:text-yellow-400 transition-colors duration-200'>
                            <FaTwitter size={20} />
                        </a>
                        <a href='https://instagram.com' target='_blank' rel='noreferrer'
                            className='hover:text-yellow-400 transition-colors duration-200'>
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>

                <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent' />

                <div className='flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600'>
                    <p>© {new Date().getFullYear()} SmartX. All rights reserved.</p>
                    <p>Buy smart. Sell smart. <span className='text-yellow-500'>SmartX.</span></p>
                </div>

            </div>
        </footer>
    )
}

export default Footer