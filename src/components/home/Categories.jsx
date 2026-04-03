import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Categories = () => {
    const [loading, setLoading] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const navigate = useNavigate();
    // ✅ ref added for scroll container (future scroll buttons ke liye use ho sakta hai)
    const scrollRef = useRef(null);
    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllCategories`);
            if (!response?.data?.success) {
                throw new Error("Could not load categories. Please try again.");
            }
            setAllCategories(response?.data?.allCategories);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            // ✅ finally block use kiya — loading hamesha false hoga chahe success ho ya error
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className='bg-gray-900 border-t border-b border-gray-700 py-3 mt-2'>
            {loading ? (
                // ✅ Skeleton loader added — loading state mein animated placeholders dikhenge
                <div className='flex gap-3 px-3 sm:px-6'>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className='h-24 w-28 sm:h-28 sm:w-36 bg-gray-700 rounded-xl animate-pulse flex-shrink-0' />
                    ))}
                </div>
            ) : allCategories.length < 1 ? (
                <div className='text-center text-gray-400 text-sm py-1'>No categories found</div>
            ) : (
                <div
                    ref={scrollRef}
                    className='flex items-center gap-3 px-3 sm:px-6 overflow-x-auto scrollbar-hide'
                >
                    {allCategories.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => {
                                navigate("/category/" + category?._id)
                            }}
                            className='flex-shrink-0 flex flex-col items-center justify-center gap-2 w-28 h-24 sm:w-36 sm:h-28 bg-gray-800 border border-gray-600 rounded-xl text-sm text-gray-200 font-medium whitespace-nowrap transition-all duration-200 hover:border-yellow-400 hover:bg-gray-750 cursor-pointer group'
                        >
                            {/* ✅ Image ko white bg wale circle mein wrap kiya — bg remove ka illusion */}
                            <div className='w-20 h-20 rounded-full bg-white flex items-center justify-center p-1'>
                                <img
                                    src={category?.categoryImage}
                                    alt={category?.categoryName}
                                    className='w-11 h-11 object-contain transition-transform duration-200 group-hover:scale-110'
                                />
                            </div>
                            <p className='text-center text-xs px-2 group-hover:text-yellow-400 transition-colors duration-200'>
                                {category?.categoryName}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Categories