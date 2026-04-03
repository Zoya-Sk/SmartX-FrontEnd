import React, { useEffect, useState } from "react";
import LogoAnimation from "../../components/auth/LogoAnimation";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    password:"",
    confirmPassword:"",
    email:"",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (event)=>{
      setFormData(prev =>{
        return {
          ...prev,
          [event.target.name]:event.target.value,
        }
      })
      
  }

  const submitHandler = async (e)=>{
    e.preventDefault();

    if(formData.password !== formData.confirmPassword){
      toast.error("Password & Confirm Password doesn't matched!");
      return;
    }

    if(formData.password.length < 8){
      toast.error("Password length must be atleast of 8 letters");
      return;
    }

    const data = {
      email:formData.email
    }

    const toastId = toast.loading("Generating OTP..")


    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-otp`, data);

      if(!response.data.success){
        throw new Error("Error occurred during SignUp!");
      }

      toast.dismiss(toastId);
      sessionStorage.setItem("otpFormData", JSON.stringify(formData)); // added this line
      navigate("/otp",{state:{Data:formData}});
      toast.success(response.data.message);
      setLoading(false);
      
      
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Something Went Wrong!");
      console.log(error);
      setLoading(false);
      
    }
    
  }

  useGSAP(()=>{
    const t1 = gsap.timeline();

    t1.from(".formAnimate1",{
      x:-100,
      opacity:0,
      delay:0.1,
      duration:0.4,
    })

    t1.from(".ipF",{
      y:100,
      opacity:0,
      delay:0.1,
      duration:0.2,
      stagger:0.2,
    })
  })

  return (
    <div className="flex px-6 overflow-y-hidden">
      {/* Sign Up form */}
      <div className="w-[50%]">
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          Sign Up
        </Typography>
        <p className="text-[16px] mt-1 font-semibold">
          Fill the Form below to Create your Account
        </p>

        {/* FORM */}
        <div className="bg-white rounded-md w-[80%] p-3 mt-6 overflow-y-hidden formAnimate1">
          <form className="flex flex-col gap-4 rounded-md w-[80%] ml-8" onSubmit={submitHandler}>
            <TextField
              type="text"
              variant="standard"
              placeholder="Enter Your First Name"
              label="First Name"
              fullWidth
              required
              size="small"
              onChange={changeHandler}
              name="firstName"
              className="ipF"
            />
            <TextField
              type="text"
              variant="standard"
              placeholder="Enter Your Last Name"
              label="Last Name"
              fullWidth
              required
              size="small"
              onChange={changeHandler}
              name="lastName"
              className="ipF"
            />
            <TextField
              type="email"
              variant="standard"
              placeholder="Enter Your Email"
              label="Email"
              fullWidth
              required
              size="small"
              onChange={changeHandler}
              name="email"
              className="ipF"
            />
            <TextField
              type={showPassword ? "text" : "password"}
              variant="standard"
              placeholder="Enter the Password"
              label="Password"
              fullWidth
              required
              size="small"
              onChange={changeHandler}
              name="password"
              className="ipF"
              InputProps={{
                endAdornment:(
                  <InputAdornment position="end">
                    {
                      showPassword ? <IoEyeSharp size={20} className="cursor-pointer"
                      onClick={()=>{
                        setShowPassword(false);
                      }}
                      /> : <FaEyeSlash size={20} className="cursor-pointer"
                      onClick={()=>{
                        setShowPassword(true);
                      }}
                      />
                    }
                      
                  </InputAdornment>
                )
              }}
            />
            <TextField
              type={confirmShowPassword ? "text" : "password"}
              variant="standard"
              placeholder="Confirm Your Password"
              label="Confirm Password"
              fullWidth
              required
              size="small"
              onChange={changeHandler}
              name="confirmPassword"
              className="ipF"
              InputProps={{
                endAdornment:(
                  <InputAdornment position="end">
                       {
                      confirmShowPassword ? <IoEyeSharp size={20} className="cursor-pointer"
                      onClick={()=>{
                        setConfirmShowPassword(false);
                      }}
                      /> : <FaEyeSlash size={20} className="cursor-pointer"
                      onClick={()=>{
                        setConfirmShowPassword(true);
                      }}
                      />
                    }
                  </InputAdornment>
                )
              }}
            />

            <div className="flex items-center">
              <Button
              variant="contained"
              size="small"
              fullWidth
              className="ipF"
              sx={{ backgroundColor: "black", textTransform:"none"}}

              type="submit"
              disable={loading}>
              Sign Up
              
            </Button>
            {
              loading && <i className="fa-solid fa-spinner animate-spin -ml-8"></i>
            }
            </div>
            
            
          </form>
          <p className="text-black flex justify-center mt-5 gap-1 text-[15px] ipF">
            Already have an Account?
            <span className="text-blue-700 cursor-pointer hover:underline" onClick={()=>{navigate("/login")}}>
              Sign In
            </span>
          </p>
        </div>




      </div>

      {/* SmartX Logo */}
      <div className="w-[50%] flex justify-center items-center">
        <LogoAnimation />
      </div>
    </div>
  );
};
