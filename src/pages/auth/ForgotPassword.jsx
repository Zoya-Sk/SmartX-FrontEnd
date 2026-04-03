import React, { useState } from 'react'
import LogoAnimation from '../../components/auth/LogoAnimation'
import { Button, InputAdornment, TextField, Typography } from '@mui/material'
import { CgMail } from "react-icons/cg";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useGSAP(() => {
        const t1 = gsap.timeline();
        t1.from(".formAnimation", {
            x: -900,
            opacity: 0,
            delay: 0.3,
            duration: 0.7,
        });
        t1.from(".formItem", {
            y: 100,
            stagger: 0.6,
            opacity: 0,
            duration: 0.2,
        }, "-=0.5")
    })

    const submitHandler = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Sending OTP to your email...");
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sendOtpForgotPassword`, { email });

            if (!response?.data?.success) {
                throw new Error("Error occurred while sending OTP for reset password");
            }
            toast.dismiss(toastId);
            navigate("/reset-pass-otp-verify",{state:{email}});
            toast.success(response?.data?.message || "OTP sent! Check your inbox.");
            setLoading(false);

        } catch (error) {
            toast.dismiss(toastId)
            setLoading(false)
            toast.error(error.response?.data?.message || "Couldn't send OTP. Try again.");
        }
    }
    return (
        <div className='flex flex-row px-24 py-6'>
            {/* FORGET PASSWORD FORM  */}
            <div className='w-[50%]'>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    Forgot Password
                </Typography>
                <p className="text-[14px] mt-2">
                    Enter your email address and we'll send you an OTP to reset your password.
                </p>

                {/* FORM  */}
                <div className='bg-white rounded-md w-[80%] p-6 mt-24 formAnimation'>
                    <form className='flex flex-col gap-6 m-4 overflow-y-hidden' onSubmit={submitHandler}>
                        <TextField type="email"
                            variant='standard'
                            className='formItem'
                            label='Email'
                            placeholder='Enter your Email'
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CgMail size={23} />
                                    </InputAdornment>
                                )
                            }} />

                        <div className='flex items-center'>

                            <Button
                                variant="contained"
                                size="small"
                                type="submit"
                                fullWidth
                                className='formItem'
                                disabled={loading}
                                sx={{ backgroundColor: "black", textTransform: "none" }}>
                                Submit
                            </Button>
                            {
                                loading && <i className="fa-solid fa-spinner animate-spin -ml-8"></i>
                            }
                        </div>
                    </form>
                </div>
            </div>

            {/* LOGO ANIMATION  */}
            <div className='w-[50%] flex justify-center items-center'>
                <LogoAnimation />
            </div>
        </div>
    )
}

export default ForgotPassword