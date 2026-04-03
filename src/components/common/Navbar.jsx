import React, { useState } from 'react'
import SearchBox from '../navbar/SearchBox'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegHeart } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { useSelector } from 'react-redux';
import UserProfileDropdown from '../navbar/UserProfileDropdown';

const Navbar = () => {
    const { userData } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { allProducts } = useSelector((state) => state.wishlist);

    return (
        <div className='relative'>
            <header className='bg-gray-900 px-3 py-2 flex items-center gap-3 justify-between border-b-[1px] border-gray-600'>
                
                {/* LOGO */}
                <Link to={"/"} className='shrink-0'>
                    <h2 className='flex items-center font-bold text-3xl'>
                        <p>Smart</p>
                        <p className='text-5xl text-yellow-400 inline-block xLogo'>X</p>
                    </h2>
                </Link>

                {/* SEARCH BAR - hidden on mobile */}
                <div className='hidden md:flex flex-1'>
                    <SearchBox />
                </div>

                {/* DESKTOP NAV */}
                <nav className='hidden md:flex items-center gap-4 font-semibold shrink-0'>
                    <Link to={"/about-us"} className={`${location.pathname === "/about-us" ? "text-yellow-400" : ""}`}>About Us</Link>
                    <Link to={"/contact-us"} className={`${location.pathname === "/contact-us" ? "text-yellow-400" : ""}`}>Contact Us</Link>

                    {token ? (
                        <div className='flex items-center gap-1 cursor-pointer' onClick={() => setShowDropdown((prev) => !prev)}>
                            <img src={userData?.profilePicture} alt="User Profile Picture" className='h-10 w-10 rounded-full object-cover' />
                            <IoIosArrowDown size={25} />
                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Link to={"/login"} className='bg-slate-950 px-4 py-2 rounded-md transition-all duration-300 hover:bg-slate-800'>Login</Link>
                            <Link to={"/signup"} className='bg-slate-950 px-4 py-2 rounded-md transition-all duration-300 hover:bg-slate-800'>signup</Link>
                        </div>
                    )}

                    {/* HEART */}
                    <div className='relative cursor-pointer' onClick={() => navigate("/wishlist-products")}>
                        <FaRegHeart size={32} />
                        {allProducts?.length > 0 && (
                            <p className='absolute top-[5px] left-3 text-yellow-400 text-sm font-semibold'>
                                {allProducts?.length}
                            </p>
                        )}
                    </div>

                    {/* SELL BUTTON */}
                    <div className={`flex items-center gap-2 bg-gray-950 rounded-full px-3 py-2 cursor-pointer transition-all duration-300 hover:bg-slate-800 ${location.pathname === "/product-upload" ? "bg-slate-800" : ""}`}
                        onClick={() => { token ? navigate("/product-upload") : navigate("/login") }}>
                        <FaPlus size={20} />
                        <p className='font-semibold text-[18px]'>SELL</p>
                    </div>
                </nav>

                {/* MOBILE RIGHT SIDE - heart + hamburger */}
                <div className='flex md:hidden items-center gap-3'>
                    <div className='relative cursor-pointer' onClick={() => navigate("/wishlist-products")}>
                        <FaRegHeart size={26} />
                        {allProducts?.length > 0 && (
                            <p className='absolute top-[2px] left-3 text-yellow-400 text-xs font-semibold'>
                                {allProducts?.length}
                            </p>
                        )}
                    </div>
                    <button onClick={() => setShowMenu((prev) => !prev)}>
                        {showMenu ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>
            </header>

            {/* MOBILE SEARCH - shown below header */}
            <div className='md:hidden bg-gray-900 px-3 pb-3'>
                <SearchBox />
            </div>

            {/* MOBILE MENU */}
            {showMenu && (
                <div className='md:hidden absolute z-20 w-full bg-gray-900 border-b border-gray-600 flex flex-col px-4 py-4 gap-4 font-semibold'>
                    <Link to={"/about-us"} onClick={() => setShowMenu(false)}
                        className={`${location.pathname === "/about-us" ? "text-yellow-400" : ""}`}>
                        About Us
                    </Link>
                    <Link to={"/contact-us"} onClick={() => setShowMenu(false)}
                        className={`${location.pathname === "/contact-us" ? "text-yellow-400" : ""}`}>
                        Contact Us
                    </Link>

                    {token ? (
                        <div className='flex items-center gap-2 cursor-pointer' onClick={() => { setShowDropdown((prev) => !prev); setShowMenu(false); }}>
                            <img src={userData?.profilePicture} alt="User" className='h-9 w-9 rounded-full object-cover' />
                            <span>My Profile</span>
                            <IoIosArrowDown size={20} />
                        </div>
                    ) : (
                        <div className='flex items-center gap-3'>
                            <Link to={"/login"} onClick={() => setShowMenu(false)}
                                className='bg-slate-950 px-4 py-2 rounded-md hover:bg-slate-800'>Login</Link>
                            <Link to={"/signup"} onClick={() => setShowMenu(false)}
                                className='bg-slate-950 px-4 py-2 rounded-md hover:bg-slate-800'>signup</Link>
                        </div>
                    )}

                    {/* SELL BUTTON */}
                    <div className='flex items-center gap-2 bg-gray-950 rounded-full px-3 py-2 cursor-pointer w-fit hover:bg-slate-800'
                        onClick={() => { token ? navigate("/product-upload") : navigate("/login"); setShowMenu(false); }}>
                        <FaPlus size={18} />
                        <p className='font-semibold'>SELL</p>
                    </div>
                </div>
            )}

            {/* PROFILE DROPDOWN */}
            {showDropdown && (
                <div className='absolute z-10 right-4 md:right-56 bg-white text-black w-[220px] flex flex-col rounded-md'>
                    <div className='bg-white h-6 w-6 self-end rotate-45 -mt-3 mr-3'></div>
                    <UserProfileDropdown setShowDropdown={setShowDropdown} />
                </div>
            )}
        </div>
    )
}

export default Navbar