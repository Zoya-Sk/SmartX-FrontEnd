import { Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoAnimation from '../../components/auth/LogoAnimation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


const ResetPassOtpVerify = () => {
    const location = useLocation();
    const userEmail = location.state.email;
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.from(".otpAnimation", {
            x: -300,
            opacity: 0,
            delay: 0.6,
            duration: 0.4,
        })
    })

    const resendOtpHandler = async () => {
        const toastId = toast.loading("Sending OTP to your email...");
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sendOtpForgotPassword`, { email: userEmail });

            if (!response?.data?.success) {
                throw new Error("Error occurred while sending OTP for reset password");
            }
            toast.dismiss(toastId);
            toast.success(response?.data?.message || "OTP sent! Check your inbox.");
            setLoading(false);

        } catch (error) {
            toast.dismiss(toastId)
            setLoading(false)
            toast.error(error.response?.data?.message || "Couldn't send OTP. Try again.");
        }
    }

    const otpVerifyHandler = async () => {
        if (otp.length < 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }
        const toastId = toast.loading("Verifying OTP...");

        try {
            setOtpLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/forgotPasswordVerifyOtp`, { email: userEmail, otp: otp });

            if (!response?.data?.success) {
                throw new Error("Error occurred while sending OTP for reset password")
            }
            toast.success(response?.data?.message || "OTP verified!", { id: toastId });
            navigate("/reset-password",{state:{
                email:userEmail
            }});
            setLoading(false);
        } catch (error) {
            console.log(error);
            setOtpLoading(false);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Something went Wrong!");
        }
    }

    return (
        <div className='flex flex-row w-[100%]'>

            {/* OTP */}
            <div className='flex items-center justify-center h-[80vh] w-[50%] otpAnimation'>
                <div className='flex items-center justify-center flex-col gap-1'>
                    <h2 className='font-black text-[20px]'>We've sent a verification code to your email.</h2>
                    <p className='text-sm'>Please enter it below to verify your account.</p>
                    <p className='text-blue-600 text-xs'>
                        {
                            userEmail
                        }
                    </p>
                    <div className='mt-6'>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            renderSeparator={<span> - </span>}
                            renderInput={(props) => <input {...props}
                                className='w-16 h-10 text-4xl text-center bg-gray-300 text-black border border-gray-400 rounded-md'
                            />}
                        />
                    </div>

                    <div className='w-full mt-6'>
                        <Button variant="contained"
                            size="large"
                            fullWidth
                            onClick={otpVerifyHandler}
                            disabled={otpLoading}>
                            Verify OTP
                        </Button>
                        {
                            otpLoading && <i className="fa-solid fa-spinner animate-spin -ml-8"></i>
                        }
                    </div>


                    <div>
                        <p className='mt-3 text-sm'>Didn't get the code? <span className='cursor-pointer text-blue-600 hover:underline' onClick={resendOtpHandler}>Resend Code</span></p>
                    </div>

                </div>
            </div>

            {/* LOGO ANIMATION  */}
            <div className='w-[50%] flex items-center justify-center -ml-14'>
                <LogoAnimation />
            </div>

        </div>
    )
}

export default ResetPassOtpVerify