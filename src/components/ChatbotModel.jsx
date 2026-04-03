import React, { useEffect, useState, useRef } from 'react'
import { RiGeminiFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { BsSend } from "react-icons/bs";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ChatbotModel = ({ setChatbot }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([]);
    const { token } = useSelector((state) => state.auth);

    const messageRef = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!message) return;

        const newMessages = [...allMessages, { role: "user", content: message }];
        setAllMessages(newMessages);
        setMessage("");

        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/aiChatbot`, {
                allMessages: newMessages,
                data: {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            });

            if (!response?.data?.success) {
                throw new Error("Couldn't message with chatbot. Please try again");
            }

            setAllMessages([...newMessages, { role: "assistant", content: response?.data?.response }]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }

    // for automatic scrolling 
    const scrollHandler = () => {
        messageRef.current?.scrollIntoView({ behaviour: "smooth" })
    }

    useEffect(() => {
        scrollHandler();
    }, [allMessages]);

    return (
        <div className='fixed inset-0 bg-black/75 flex items-center justify-center text-white z-[100]'>
            <div className='bg-gray-800 h-[80vh] w-[60vw] rounded-2xl flex flex-col'>

                {/* top div */}
                <div className='px-6 py-2 flex justify-between items-center h-[15%]'>
                    <div className='flex flex-row items-center gap-2'>
                        <RiGeminiFill className='h-12 w-12 text-yellow-400' />
                        <p className='font-semibold text-xl'>Smart<span className='text-2xl text-yellow-400'>X</span> Bot</p>
                    </div>
                    <RxCross2 className='mt-2 cursor-pointer' size={30}
                        onClick={() => { setChatbot(false) }} />
                </div>
                <hr />

                {/* messages */}
                <div className='flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3'>
                    {allMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm
                                ${msg.role === "user" ? "bg-yellow-400 text-black" : "bg-gray-600 text-white"}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className='flex justify-start'>
                            <div className='bg-gray-600 px-4 py-2 rounded-2xl text-sm animate-pulse'>
                                Typing...
                            </div>
                        </div>
                    )}

                    <div ref={messageRef}></div>

                </div>
                <hr />

                {/* input field */}
                <div className='h-[12%]'>
                    <form className='px-4 h-full flex items-center justify-center'
                        onSubmit={submitHandler}>
                        <input type="text"
                            placeholder='Enter your Prompt Here'
                            value={message}
                            className='w-full bg-gray-700 rounded-full py-2 px-4 border-none outline-none'
                            onChange={(e) => { setMessage(e.target.value) }} />
                        <button disabled={loading} type='submit'
                            className={`-ml-8 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                            <BsSend size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatbotModel