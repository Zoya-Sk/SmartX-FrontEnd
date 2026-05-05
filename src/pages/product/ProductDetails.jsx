import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast'
import { LuIndianRupee } from "react-icons/lu";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { LuShare2 } from "react-icons/lu";
import { MdLocationOn, MdPhone } from 'react-icons/md';
import { SiGooglegemini } from "react-icons/si";
import { useSelector, useDispatch } from 'react-redux'
import { addProductToWishlist, removeProductFromWishlist } from '../../redux/slices/wishlist'
import copy from 'copy-to-clipboard';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const [priceCheck, setPriceCheck] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const { allProducts } = useSelector((state) => state.wishlist);
    const addProductToWishlistHandler = () => {
        if (!token) {
            toast.error("Please login to add Product to wishlist");
            return;
        }
        dispatch(addProductToWishlist(productDetails))
    };
    const removeProductHandler = () => {
        if (!token) {
            toast.error("Please login to remove Product from wishlist");
            return;
        }
        dispatch(removeProductFromWishlist(productDetails))
    };
    const { userData } = useSelector((state) => state.user);
    const params = useParams();
    const productId = params?.productId;
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState({});
    const [paymentLoading, setPaymentLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const isWishlisted = allProducts?.some((item) => item?._id === productDetails?._id);

    const getProductDetails = async () => {
        // validation
        if (!productId) {
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product-details/${productId}`);

            //validation
            if (!response?.data?.success) {
                throw new Error("Couldn't fetch Product Details!");
            }
            setProductDetails(response?.data?.productDetails);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went Wrong!");

        }
    }

    const chatWithSellerHandler = () => {
        if (!token) {
            toast.error("Please login to Start Chatting with Seller.");
            return;
        }
        if (userData?._id === productDetails?.seller?._id) {
            toast.error("You can't chat with yourself!");
            return;
        }
        navigate("/user-conversation", { state: productDetails?.seller })
    }

    const handleFairPriceCheck = async () => {
        setPriceLoading(true);
        setPriceCheck(null);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/fair-price`, {
                title: productDetails?.productName,
                category: productDetails?.category?.categoryName,
                price: productDetails?.price,
                condition: productDetails?.condition,
            });
            setPriceCheck(res?.data?.response);
        } catch (err) {
            setPriceCheck({ verdict: "Error", emoji: "⚠️", reason: "Could not analyze price." });
        } finally {
            setPriceLoading(false);
        }
    };

    const handleBuyNow = async () => {
        if (!token) {
            toast.error("Please login to buy this product");
            return;
        }
        if (userData?._id === productDetails?.seller?._id) {
            toast.error("You cannot buy your own product!");
            return;
        }
        try {
            setPaymentLoading(true);

            // Step 1: Backend se order create karo
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/payment/create-order`,
                { productId: productDetails._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Step 2: Razorpay checkout open karo
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "SmartX",
                description: productDetails?.productName,
                order_id: data.orderId,
                handler: async (response) => {
                    // Step 3: Payment verify karo
                    const verify = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/payment/verify`,
                        response,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (verify.data.success) {
                        toast.success("Payment Successful! 🎉");
                        navigate("/my-orders"); // baad mein ye page banayenge
                    }
                },
                prefill: {
                    name: `${userData?.firstName} ${userData?.lastName}`,
                    email: userData?.email,
                },
                theme: { color: "#EAB308" }, // SmartX yellow
                modal: {
                    ondismiss: () => {
                        toast.error("Payment cancelled!");
                        setPaymentLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setPaymentLoading(false);

        } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed!");
            setPaymentLoading(false);
        }
    };

    useEffect(() => {
        getProductDetails();
    }, [productId]);

    return (
        <>
            {loading ? (
                <div className='w-full h-[calc(100vh-65px)] flex items-center justify-center'>
                    <Loader />
                </div>
            ) : (
                <div className='w-[95vw] md:w-[90vw] mt-6 mx-auto'>
                    <div className='w-full flex flex-col md:flex-row items-start gap-6'>

                        {/* IMAGE SLIDER */}
                        <div className='w-full md:w-[60%] self-start'>
                            <Swiper navigation={true} modules={[Navigation, Pagination]} pagination={true}
                                style={{ width: "100%", "--swiper-navigation-color": "#EAB308" }}>
                                {productDetails?.images?.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={image?.url} alt={`${productDetails?.productName}Image${index}`}
                                            className='h-[250px] sm:h-[350px] md:h-[450px] object-contain w-full' />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className='w-full md:w-[45%] border border-gray-700 rounded-lg p-4 md:p-5 flex flex-col justify-between'>

                            {/* Top Section */}
                            <div className='flex flex-col gap-4'>

                                {/* Product Name */}
                                <h2 className='text-xl md:text-2xl font-bold text-white'>
                                    {productDetails?.productName}
                                </h2>

                                {/* Price */}
                                <div className='flex items-center gap-1 text-yellow-400'>
                                    <LuIndianRupee size={22} />
                                    <span className='text-3xl md:text-4xl font-semibold'>{productDetails?.price}</span>
                                </div>

                                {/* AI Price Suggestion */}
                                <div className='flex flex-col gap-2'>
                                    <button
                                        onClick={handleFairPriceCheck}
                                        disabled={priceLoading}
                                        className='flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition w-fit disabled:opacity-50'>
                                        <SiGooglegemini size={20} className={`text-white ${priceLoading ? 'animate-spin' : ''}`} />
                                        {priceLoading ? "Analyzing..." : "Is this a fair price?"}
                                    </button>

                                    {priceCheck && (
                                        <div className='bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm'>
                                            <p className='text-white font-semibold'>{priceCheck.emoji} {priceCheck.verdict}</p>
                                            <p className='text-gray-400 text-xs mt-1'>{priceCheck.reason}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <p className='text-gray-400 text-sm'>
                                    {productDetails?.category?.categoryName || "General"}
                                </p>

                                {/* Location & Date */}
                                <div className='flex items-center justify-between text-gray-400 text-sm flex-wrap gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <MdLocationOn size={16} />
                                        <span>{productDetails?.location || "Not specified"}</span>
                                    </div>
                                    <span>
                                        {productDetails?.createdAt
                                            ? new Date(productDetails.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })
                                            : ""}
                                    </span>
                                </div>

                                {/* Condition Badge */}
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${productDetails?.condition === "New"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                    }`}>
                                    {productDetails?.condition}
                                </span>

                                {/* Seller Info */}
                                <div className='flex items-center justify-between border border-gray-700 rounded-lg p-3 bg-gray-900 flex-wrap gap-3'>
                                    <div className='flex items-center gap-3'>
                                        {productDetails?.seller?.profilePicture ? (
                                            <img src={productDetails.seller.profilePicture} alt="seller"
                                                className='w-10 h-10 rounded-full object-cover' />
                                        ) : (
                                            <div className='w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm'>
                                                {productDetails?.seller?.firstName?.[0]}{productDetails?.seller?.lastName?.[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className='text-white text-sm font-semibold'>
                                                Posted by {productDetails?.seller?.firstName} {productDetails?.seller?.lastName}
                                            </p>
                                            <p className='text-gray-500 text-xs'>
                                                Member since {productDetails?.seller?.createdAt
                                                    ? new Date(productDetails.seller.createdAt).toLocaleDateString("en-IN", {
                                                        month: "short", year: "numeric"
                                                    })
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1 text-yellow-400 text-sm font-semibold'>
                                        <MdPhone size={16} />
                                        <span>{productDetails?.contactNumber}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className='text-gray-300 text-sm mb-2'>
                                    {productDetails?.description}
                                </p>
                            </div>

                            {/* Bottom Section — Actions */}
                            <div className='flex flex-col gap-3 mt-4'>
                                {userData?._id !== productDetails?.seller?._id && (
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={paymentLoading}
                                        className='w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50'>
                                        {paymentLoading ? "Processing..." : "Buy Now 🛍️"}
                                    </button>
                                )}
                                <button className='w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-500 transition'
                                    onClick={chatWithSellerHandler}>
                                    Contact Seller
                                </button>
                                <div className='flex items-center gap-4 text-gray-400'>
                                    <button onClick={isWishlisted ? removeProductHandler : addProductToWishlistHandler}
                                        className='flex items-center gap-1 hover:text-white transition text-sm'>
                                        {isWishlisted
                                            ? <><IoMdHeart size={20} className='text-red-500' /> Wishlisted</>
                                            : <><IoMdHeartEmpty size={20} /> Add to Wishlist</>
                                        }
                                    </button>
                                    <button className='flex items-center gap-1 hover:text-white transition text-sm'
                                        onClick={() => { copy(location.href); toast.success("Copied! We've copied it to your clipboard"); }}>
                                        <LuShare2 size={20} /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductDetails