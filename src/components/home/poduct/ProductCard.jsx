import { Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react'
import { LuIndianRupee } from "react-icons/lu";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { addProductToWishlist, removeProductFromWishlist } from '../../../redux/slices/wishlist';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const { allProducts } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const addProductToWishlistHandler = () => {
        if (!token) {
            toast.error("Please login to add Product to wishlist");
            return;
        }
        dispatch(addProductToWishlist(product));
    }
    const removeProductHandler = () => {
        if (!token) {
            toast.error("Please login to remove Product from wishlist");
            return;
        }
        dispatch(removeProductFromWishlist(product));
    }
    return (
        <div className='w-full bg-gray-800 border border-gray-700 px-2 py-2 rounded-md flex flex-col gap-3 cursor-pointer transition-all duration-500 hover:scale-105'
            onClick={() => { navigate(`/product-details/${product?._id}`) }}>

            {/* Image height responsive */}
            <div className='w-full h-[120px] sm:h-[160px] relative'>
                <img
                    src={product?.images[0].url}
                    alt={`${product?.productName}`}
                    className='w-full h-full object-cover rounded-md'
                />
                <div className='absolute top-1 right-1 bg-gray-50 p-1 rounded-full hover:text-red-500 transition-colors'
                    onClick={(e) => e.stopPropagation()}>
                    {allProducts.some((item) => item?._id === product?._id)
                        ? <IoMdHeart size={22} className='text-black' onClick={removeProductHandler} />
                        : <IoMdHeartEmpty size={22} className='text-black' onClick={addProductToWishlistHandler} />
                    }
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                {/* Price - smaller on mobile */}
                <div className='flex items-center gap-1 font-semibold text-base sm:text-[18px]'>
                    <LuIndianRupee />
                    <p>{product?.price}</p>
                </div>

                <Typography noWrap sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#d1d5db" }}>
                    {product?.productName}
                </Typography>

                <Typography noWrap sx={{ fontSize: "12px", color: "#9ca3af" }}>
                    {product?.description}
                </Typography>

                <div className='flex items-center justify-between text-[12px] text-gray-400'>
                    <Typography noWrap sx={{ fontSize: "12px", maxWidth: "60%", color: "#9ca3af" }}>
                        {product?.location}
                    </Typography>
                    <p className='text-white whitespace-nowrap'>
                        {moment(product?.createdAt).format('ll')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard