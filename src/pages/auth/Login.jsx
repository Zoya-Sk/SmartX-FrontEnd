import { TextField, Typography, InputAdornment } from '@mui/material'  // ← added InputAdornment
import { useState } from 'react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoAnimation from '../../components/auth/LogoAnimation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/slices/auth';
import { setUserData } from '../../redux/slices/userData';

const Login = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const dispatch = useDispatch();

    useGSAP(() => {
        const t1 = gsap.timeline();
        t1.from(".loginAnimation", {
            x: -100,
            opacity: 0,
            delay: 0.1,
            duration: 0.4,
        });

        t1.from(".inputAnimation", {
            y: 100,
            opacity: 0,
            duration: 0.2,
            stagger: 0.2,
        }, "-=0.3")
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        setFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In...");

        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, formData);

            if (!response?.data?.success) {
                throw new Error("Error occurred during Login!");
            }
            toast.dismiss(toastId);
            dispatch(setToken(response?.data?.token));
            dispatch(setUserData(response?.data?.userDetails));
            navigate("/");
            toast.success(response?.data?.message);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.dismiss(toastId);
            console.log(error.response?.data);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }

    return (
        <div className='flex flex-col md:flex-row overflow-y-hidden px-6 md:px-24'>

            {/* FORM */}
            <div className='w-full md:w-[50%] mt-8'>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Welcome Back
                </Typography>
                <p className="text-[14px] mt-2 flex items-center">
                    Sign in with your email and password
                </p>

                <div className='w-full md:w-[80%] bg-white rounded-md mt-8 md:mt-12 p-6 overflow-y-hidden loginAnimation'>
                    <form className='flex flex-col gap-3' onSubmit={submitHandler}>
                        <TextField variant='standard' type='email' placeholder='Your Email Address' label="Email" name='email' fullWidth required className='inputAnimation' onChange={onChangeHandler} />

                        <div className='flex flex-col'>
                            <TextField
                                variant='standard'
                                placeholder='Your Password'
                                label="Password"
                                name="password"
                                fullWidth
                                required
                                className='inputAnimation'
                                onChange={onChangeHandler}
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {showPassword
                                                ? <IoEyeSharp size={20} className="cursor-pointer" onClick={() => setShowPassword(false)} />
                                                : <FaEyeSlash size={20} className="cursor-pointer" onClick={() => setShowPassword(true)} />
                                            }
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Link to={"/forgot-password"} className='text-blue-700 text-sm self-end hover:underline inputAnimation'>
                                forgot password?
                            </Link>
                        </div>

                        <div className='relative flex items-center'>
                            <button type='submit' className='w-full bg-black text-white text-sm py-2 px-4 rounded hover:bg-gray-800 transition-colors inputAnimation disabled:{loading}'>
                                Log In
                            </button>
                            {loading && <i className="fa-solid fa-spinner animate-spin absolute right-3"></i>}
                        </div>
                    </form>

                    <p className="text-black flex justify-center mt-5 gap-1 text-[14px] inputAnimation">
                        Don't have an Account?
                        <span className="text-blue-700 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>

            {/* LOGO ANIMATION - hidden on mobile */}
            <div className='hidden md:flex w-[50%] h-[80vh] items-center justify-center mt-6'>
                <LogoAnimation />
            </div>

        </div>
    )
}

export default Login