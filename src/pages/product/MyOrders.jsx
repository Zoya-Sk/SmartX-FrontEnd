import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LuIndianRupee } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const getMyOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/payment/my-orders`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(data.orders);
        } catch (error) {
            toast.error("Could not fetch orders!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyOrders();
    }, []);

    if (loading) return (
        <div className='w-full h-[calc(100vh-65px)] flex items-center justify-center'>
            <Loader />
        </div>
    );

    return (
        <div className='w-[95vw] md:w-[85vw] mx-auto mt-8'>
            <h1 className='text-2xl font-bold text-white mb-6'>My Orders</h1>

            {orders.length === 0 ? (
                <div className='text-center text-gray-400 mt-20'>
                    <p className='text-lg'>No orders yet!</p>
                    <button onClick={() => navigate("/")}
                        className='mt-4 bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition'>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {orders.map((order) => (
                        <div key={order._id}
                            className='border border-gray-700 rounded-lg p-4 bg-gray-900 flex flex-col sm:flex-row items-start sm:items-center gap-4'>

                            {/* Product Image */}
                            <img
                                src={order.product?.images?.[0]?.url}
                                alt={order.product?.title}
                                className='w-20 h-20 object-cover rounded-lg'
                            />

                            {/* Order Info */}
                            <div className='flex-1 flex flex-col gap-1'>
                                <p className='text-white font-semibold'>{order.product?.productName}</p>
                                <p className='text-gray-400 text-sm'>Seller: {order.seller?.firstName} {order.seller?.lastName}</p>
                                <p className='text-gray-500 text-xs'>
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </p>
                            </div>

                            {/* Price & Status */}
                            <div className='flex flex-col items-end gap-2'>
                                <div className='flex items-center text-yellow-400 font-bold text-lg'>
                                    <LuIndianRupee size={18} />
                                    <span>{order.amount}</span>
                                </div>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${order.status === "paid"
                                        ? "bg-green-500/20 text-green-400"
                                        : order.status === "failed"
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-yellow-500/20 text-yellow-400"
                                    }`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;