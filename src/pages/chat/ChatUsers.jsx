import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


const ChatUsers = () => {
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { userData } = useSelector((state) => state.user);
    const { allOnlineUsers } = useSelector((state) => state.socketIo);
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    const getAllConversationUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat-users`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            if (!response?.data?.success) {
                throw new Error("Couldn't fetch conversations. Please try again");
            }
            setAllUsers(response?.data?.allUsers);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }

    useEffect(() => {
    console.log("Online users:", allOnlineUsers);
}, [allOnlineUsers]);

    useEffect(() => {
        getAllConversationUsers();
    }, []);

    return (
        <div className='min-h-screen bg-gray-900 py-8 px-4'>
            <div className='max-w-lg mx-auto'>

                {/* Header */}
                <p className='text-xl font-semibold text-white mb-4'>Messages</p>

                <div className='bg-gray-800 border border-gray-700 rounded-xl overflow-hidden'>

                    {loading ? <Loader /> : allUsers.length < 1 ? (
                        /* Empty State */
                        <div className='flex flex-col items-center justify-center py-16 px-6 gap-3'>
                            <div className='w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="#9ca3af" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <p className='text-base font-medium text-white'>No messages yet</p>
                            <p className='text-sm text-gray-400 text-center'>When someone messages you about a product, it will appear here</p>
                        </div>
                    ) : (
                        <>
                            <div className='px-4 py-3 border-b border-gray-700'>
                                <p className='text-sm text-gray-400'>{allUsers.length} conversations</p>
                            </div>
                            {allUsers.map((user, index) => {
                                const otherUser = user?.members?.find(u => u?._id !== userData?._id);
                                console.log("otherUser._id:", otherUser?._id); // ADD THIS
                                return (
                                    <div key={index} onClick={() => navigate("/user-conversation", { state: otherUser })}
                                        className='flex items-center gap-3 px-4 py-3 border-b border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors'>
                                        <div className='relative flex-shrink-0'>
                                            <img src={otherUser?.profilePicture} className='w-11 h-11 rounded-full object-cover' />
                                            <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${allOnlineUsers.includes(otherUser?._id) ? 'bg-green-500' : 'bg-gray-500'}`} />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-white truncate'>{otherUser?.firstName} {otherUser?.lastName}</p>
                                            <p className='text-xs text-gray-400 truncate'>Tap to open conversation</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ChatUsers