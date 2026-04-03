import { Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoAnimation from '../../components/auth/LogoAnimation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


const Otp = () => {
    const location = useLocation();
    const formData = location?.state?.Data || JSON.parse(sessionStorage.getItem("otpFormData"));
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // validation
     if (!formData) {
        navigate("/signup");
        return null;
    }

    // RESEND OTP FUNCTION 
    const resendOtpHandler = async () => {

        const data = {
            email: formData?.email,
        }

        const toastId = toast.loading("Generating OTP..")


        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-otp`, data);

            if (!response.data.success) {
                throw new Error("Error occurred during SignUp!");
            }

            toast.dismiss(toastId);
            sessionStorage.setItem("otpFormData", JSON.stringify(formData)); // added this line
            toast.success(response.data.message);


        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Something Went Wrong!");
            console.log(error);

        }

    }

    // VERIFY OTP
    const verifyOtpHandler = async () => {
        if (!otp || otp.length < 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }
        formData.otp = otp;
        const toastId = toast.loading("Verifying OTP...");
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, formData);

            if (!response?.data?.success) {
                throw new Error("Unable to verify OTP, please try again.");
            }
            toast.dismiss(toastId);
            toast.success(response?.data?.message);
            setLoading(false);
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message);
            setLoading(false);

        }
    }

    useGSAP(()=>{
        gsap.from(".otpAnimation",{
            x:-300,
            opacity:0,
            delay:0.6,
            duration:0.4,
        })
    })

    return (
        <div className='flex flex-row'>

            {/* OTP */}
            <div className='flex items-center justify-center h-[80vh] w-[50%] otpAnimation'>
                <div className='flex items-center justify-center flex-col gap-1'>
                    <h2 className='font-black text-[20px]'>We've sent a verification code to your email.</h2>
                    <p className='text-sm'>Please enter it below to verify your account.</p>
                    <p className='text-blue-600 text-xs'>
                        {
                            formData?.email
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
                        <Button variant="contained" size="large" fullWidth onClick={verifyOtpHandler} disabled={loading}>
                            Verify OTP
                        </Button>
                        {
                            loading && <i className="fa-solid fa-spinner animate-spin -ml-8"></i>
                        }
                    </div>


                    <div>
                        <p className='mt-3 text-sm'>Didn't get the code? <span className='underline cursor-pointer' onClick={resendOtpHandler}>Resend Code</span></p>
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

export default Otp