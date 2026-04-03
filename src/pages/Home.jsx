import React, { useEffect, useRef, useState } from 'react'
import Categories from '../components/home/Categories'
import { Swiper, SwiperSlide } from 'swiper/react';
import { ImSpinner11 } from "react-icons/im";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast, { Toaster } from 'react-hot-toast';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// IMAGES IMPORTS 
import electronics from '../assets/electronics.jpg'
import laptops from '../assets/laptop.avif'
import mobiles from '../assets/mobile-phones.avif'
import cars from '../assets/cars.avif'
import books from '../assets/books.avif'
import clothes from '../assets/clothes.avif'
import motorCycles from '../assets/motor-cycles.avif'
import furniture from '../assets/furniture.avif'
import jobs from '../assets/jobs.avif'
import axios from 'axios';
import Loader from '../components/common/Loader';
import ProductCard from '../components/home/poduct/ProductCard';
import SkeletonLoading from '../components/common/SkeletonLoading';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const productRef = useRef();
  const [page, setPage] = useState(1);
  const [lastCall, setLastCall] = useState(false);
  const slides = [
    { id: 1, img: electronics, label: 'Electronics' },
    { id: 2, img: laptops, label: 'Laptops' },
    { id: 3, img: mobiles, label: 'Mobile Phones' },
    { id: 4, img: cars, label: 'Cars' },
    { id: 5, img: books, label: 'Books' },
    { id: 6, img: clothes, label: 'Clothes' },
    { id: 7, img: motorCycles, label: 'Motor-cycles' },
    { id: 8, img: furniture, label: 'Furniture' },
    { id: 9, img: jobs, label: 'Jobs' },
  ]

  const getAllProducts = async () => {
    if (lastCall) {
      return;
    }
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-product?page=${page}`);
      if (response?.data?.allProducts?.length < 8) {
        setLastCall(true);
      }
      setAllProducts([...allProducts, ...response?.data?.allProducts]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went Wrong!");

    }
  }

  const handleScroll = () => {
    if (lastCall) {
      return;
    }
    if (loading) {
      return;
    }
    const scrollHeight = productRef?.current?.scrollHeight;
    const clientHeight = productRef?.current?.clientHeight;
    const scrollTop = productRef?.current?.scrollTop;

    if (clientHeight + scrollTop + 1 >= scrollHeight) {
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    if (lastCall) {
      return;
    }
    if (loading) {
      return;
    }
    getAllProducts();
  }, [page]);

  useEffect(() => {
    productRef.current.addEventListener("scroll", handleScroll);

    return () => {
      productRef.current?.removeEventListener("scroll", handleScroll)
    }
  }, [productRef]);

  return (
    <div>

      {/* CATEGORIES  */}
      <div>
        <Categories />
      </div>

      {/* SLIDING HERO NAVIGATION  */}
      <div className='mt-5 overflow-hidden'>
        <Swiper slidesPerView={3} spaceBetween={10} modules={[Navigation, Pagination, Autoplay]} navigation={true} pagination={{ clickable: true }} autoplay={{ delay: 3000 }} className='w-full h-64'>
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className='relative w-full h-full'>
                <img src={slide.img} className='w-full h-full object-cover' alt={slide.label} />
                {/* dark overlay with label */}
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                  <p className='text-white text-4xl font-bold'>{slide.label}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* PRODUCTS  */}
      <div ref={productRef} className='h-[100vh] overflow-y-auto'>

        {/* LOADER  */}
        {
          loading && page === 1 ? (<div className='grid grid-cols-4 gap-4 px-5 mt-6'>
            {
              Array.from({ length: 4 }).map((_, i) => {
                return <SkeletonLoading />
              })
            }
          </div>) : (<div>
            {
              allProducts.length < 1 ? (<div>Products Not Found! </div>) :
                (<div className='grid grid-cols-4 gap-4 px-5 mt-6'>
                  {
                    allProducts.map((product, index) => {
                      return <div key={product.id || index}>
                        <ProductCard product={product} />
                      </div>
                    })
                  }

                  {loading && (
                    <div className='col-span-4 flex justify-center items-center py-6'>
                      <ImSpinner11 className='text-4xl animate-spin text-yellow-400' />
                    </div>
                  )}

                  {lastCall && (
                    <div className='col-span-4 flex justify-center items-center py-6'>
                      <p className='text-gray-400 text-sm border border-gray-700 px-6 py-2 rounded-full'>
                        You've seen all products 🎉
                      </p>
                    </div>
                  )}
                </div>)
            }
          </div>)
        }

      </div>

    </div>
  )
}

export default Home