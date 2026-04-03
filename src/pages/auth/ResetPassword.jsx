import { Button, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import LogoAnimation from '../../components/auth/LogoAnimation'
import toast from 'react-hot-toast';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const location = useLocation();
    const email = location.state;
    const navigate = useNavigate();

    const changeHandler = (event) => {
        setFormData(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        })

    }

    useGSAP(() => {
        const t1 = gsap.timeline();

        t1.from(".resetFormAnimation", {
            x: -100,
            opacity: 0,
            delay: 0.3,
            duration: 0.6,
        })
        t1.from(".inputAnimation", {
            y: 100,
            opacity: 0,
            duration: 0.3,
            stagger: 0.2
        }, "-=0.6");
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData(prev => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        formData.email = location.state?.email;

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password length must be atleast of 8 letters");
            return;
        }

        const toastId = toast.loading("Updating Password...");
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/resetPassword`, formData);

            if (!response?.data?.success) {
                throw new Error("Couldn't reset password. Try again.");
            }
            toast.success(response.data.message || "Password reset successfully!", { id: toastId });
            navigate("/login");
            setLoading(false);
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Something Went Wrong!");
            console.log(error);
            setLoading(false);
        }

    }

    return (
        <div className='flex flex-col md:flex-row px-6 py-6 w-full min-h-[80vh] mt-6'>

            {/* FORM */}
            <div className='w-full md:w-[50%]'>
                <div>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Reset Password
                    </Typography>
                    <p className="text-[14px] mt-2">
                        Enter a New Password
                    </p>
                </div>

                <div className="bg-white rounded-md w-full md:w-[80%] p-6 mt-8 md:mt-20 overflow-y-hidden resetFormAnimation">
                    <form className="flex flex-col gap-4 rounded-md w-full md:w-[80%] md:ml-8" onSubmit={submitHandler}>
                        <TextField
                            type={newPassword ? "text" : "password"}
                            variant="standard"
                            placeholder="Enter the New Password"
                            label="New Password"
                            fullWidth
                            required
                            size="small"
                            onChange={onChangeHandler}
                            name="password"
                            value={formData.password}
                            className="inputAnimation"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {newPassword
                                            ? <IoEyeSharp size={20} className="cursor-pointer" onClick={() => setNewPassword(false)} />
                                            : <FaEyeSlash size={20} className="cursor-pointer" onClick={() => setNewPassword(true)} />
                                        }
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            type={confirmNewPassword ? "text" : "password"}
                            variant="standard"
                            placeholder="Confirm Your Password"
                            label="Confirm Password"
                            fullWidth
                            required
                            size="small"
                            onChange={onChangeHandler}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            className="inputAnimation"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {confirmNewPassword
                                            ? <IoEyeSharp size={20} className="cursor-pointer" onClick={() => setConfirmNewPassword(false)} />
                                            : <FaEyeSlash size={20} className="cursor-pointer" onClick={() => setConfirmNewPassword(true)} />
                                        }
                                    </InputAdornment>
                                )
                            }}
                        />

                        <div className="flex items-center">
                            <Button
                                disabled={loading}
                                variant="contained"
                                size="small"
                                fullWidth
                                className="inputAnimation"
                                sx={{ backgroundColor: "black", textTransform: "none" }}
                                type="submit">
                                Reset Password
                            </Button>
                            {loading && <i className="fa-solid fa-spinner animate-spin -ml-8"></i>}
                        </div>
                    </form>
                </div>
            </div>

            {/* LOGO ANIMATION - hidden on mobile */}
            <div className='hidden md:flex w-[50%] items-center justify-center h-full'>
                <LogoAnimation />
            </div>
        </div>
    )
}

export default ResetPassword