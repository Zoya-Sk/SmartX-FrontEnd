import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import SkeletonLoading from '../../components/common/SkeletonLoading';
import ProductCard from '../../components/home/poduct/ProductCard';
import { Pencil, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const MyProducts = () => {
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [ deleteLoading, setDeleteLoading ] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();


    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user-products`, {
                headers: { Authorization: 'Bearer ' + token }
            });

            if (!response?.data?.success) {
                throw new Error("Couldn't fetch products. Please try again.");
            }
            setAllProducts(response?.data?.allProducts);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }

    const deleteProductHandler = async(productId)=>{
        const confirm = window.confirm("Are you sure you want to delete this product?");
        
        // validation
        if(!confirm){
            return ;
        }
        if(deleteLoading){
            return ;
        }

        const toastId = toast.loading("deleting product...")
        try {
            setDeleteLoading(true);
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete-products/${productId}`,{
                headers:{
                    Authorization:'Bearer '+token
                }
            })

            if(!response?.data?.success){
                throw new Error("Couldn't delete product. please try again");
            }
            const remainingProducts = allProducts.filter((product)=> product._id !== productId);
            setAllProducts(remainingProducts);
            toast.dismiss(toastId);

            setDeleteLoading(false);
            toast.success(response?.data?.message);
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong!")
            
        }
    }

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className='min-h-screen bg-gray-900 px-6 py-8'>
            <h1 className='text-2xl font-bold text-white mb-6'>My Products</h1>

            {loading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {[...Array(8)].map((_, i) => <SkeletonLoading key={i} />)}
                </div>
            ) : allProducts.length < 1 ? (
                <div className='flex flex-col items-center justify-center h-[60vh] gap-3 text-gray-400'>
                    <p className='text-xl'>No products found!</p>
                    <p className='text-sm'>You haven't posted any ads yet.</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {allProducts.map((product, index) => (
                        // ✅ Ek wrapper div mein dono cheezein
                        <div key={index} className='relative group'>
                            <ProductCard product={product} />

                            {/* Edit & Delete Buttons */}
                            <div className='flex gap-2 mt-2'>
                                <button
                                    onClick={() => navigate("/product-upload",{state:product})}
                                    className='flex items-center gap-1 w-1/2 justify-center bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold py-1.5 rounded-lg transition'
                                >
                                    <Pencil size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteProductHandler(product._id)}
                                    className='flex items-center gap-1 w-1/2 justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 rounded-lg transition'
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyProducts