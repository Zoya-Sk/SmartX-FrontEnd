import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/slices/userData'

const Setting = () => {
    const userData = useSelector((state) => state.user.userData);
    const { token } = useSelector((state) => state.auth);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        contactNumber: "",
    });
    const [password, setPassword] = useState({
        currentPassword: "",
        changedPassword: "",
        confirmPassword: "",
    })

    // ✅ preview state — naya image select ka rne pe preview dikhega
    const [preview, setPreview] = useState(null);

    const updateProfilePictureHandler = async () => {
        // validation 
        if (!file) {
            return;
        }
        const toastId = toast.loading("Updating Profile Picture...");
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", userData?._id);

        try {
            setLoading(true);
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/updateProfilePicture`,
                formData,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    }
                }
            );

            //validation
            if (!response?.data?.success) {
                throw new Error("Couldn't Update Profile Picture. Please try again.");
            }
            console.log(response);
            toast.dismiss(toastId);
            dispatch(setUserData(response?.data?.updatedUser));
            setFile(null);
            setPreview(null);
            setLoading(false);
            toast.success(response?.data?.message);
            console.log("updatedUser:", response?.data?.updatedUser); // added
        } catch (error) {
            setLoading(false);
            toast.dismiss(toastId);
            console.log(error);
            toast.error(error.response?.data?.message || "Something went Wrong");
        }
    }

    useEffect(() => {
        setFormData({
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            contactNumber: userData?.contactNumber,
        })
    }, []);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const passwordChangeHandler = (e) => {
        const { name, value } = e.target;
        setPassword(prev => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const nameUpdateHandler = async () => {
        // validation
        if (userData?.firstName === formData.firstName &&
            userData?.lastName === formData.lastName &&
            userData?.contactNumber === formData.contactNumber) {
            toast.error("No Updates!");
            return;
        }

        const toastId = toast.loading("Updating name...");
        try {
            setLoading(true);
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/nameUpdate`, {
                ...formData,
                userId: userData?._id, // ✅ spread formData + add userId
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    }
                }
            );

            if (!response?.data?.success) {
                throw new Error("Couldn't Update user name. Please try again.");
            }
            toast.dismiss(toastId);
            dispatch(setUserData(response?.data?.updatedUser));
            toast.success(response?.data?.message);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Something Went Wrong!");

        }
    }

    const passwordUpdateHandler = async () => {
        // validation
        if (password.changedPassword !== password.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (password.changedPassword.length < 8) {
            toast.error("Password must be atleast 8 characters long!");
            return;
        }

        const toastId = toast.loading("Updating Password...");
        try {
            setLoading(true);
            // ✅ correct
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/passwordUpdate`, {
                ...password,
                userId: userData?._id,
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    }
                }
            );

            if (!response?.data?.success) {
                throw new Error("Couldn't Update Password. Please try again.");
            }
            toast.dismiss(toastId);
            toast.success(response?.data?.message);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went Wrong!");

        }
    }

    return (
        <div className='min-h-screen bg-gray-950 text-white py-10 px-4'>
            <div className='max-w-2xl mx-auto flex flex-col gap-6'>

                {/* UPDATE PROFILE PICTURE */}
                <div className='bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4'>
                    <h2 className='text-lg font-semibold text-yellow-400'>Profile Picture</h2>

                    <div className='flex items-center gap-6'>
                        {/* ✅ profile picture preview — naya select kiya toh preview dikhega warna existing */}
                        <img
                            src={preview || userData?.profilePicture}
                            alt={`${userData?.firstName} profile`}
                            className='w-24 h-24 rounded-full object-cover border-2 border-yellow-400'
                        />

                        <div className='flex flex-col gap-2'>
                            <p className='text-gray-400 text-sm'>JPG, PNG allowed. Max 2MB.</p>
                            {/* ✅ hidden file input — button click se trigger hoga */}
                            <input
                                type='file'
                                id='profilePicInput'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                        setFile(selectedFile);
                                        setPreview(URL.createObjectURL(selectedFile));
                                    }
                                }}
                            />
                            <label
                                htmlFor='profilePicInput'
                                className='cursor-pointer px-4 py-2 bg-yellow-400 text-gray-900 font-semibold text-sm rounded-lg hover:bg-yellow-300 transition-all duration-200 text-center'
                            >
                                Choose Photo
                            </label>
                            {/* ✅ Save button — sirf tab dikhega jab naya image select ho */}
                            {preview && (
                                <button className={`px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500 transition-all duration-200 ${loading ? "animate-pulse" : ""}`}
                                    disabled={loading}
                                    onClick={updateProfilePictureHandler}>
                                    Save Picture
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/*  UPDATE USER INFORMATION  */}
                <div className='bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4'>
                    <h2 className='text-lg font-semibold text-yellow-400'>Personal Information</h2>

                    {/* ✅ 2 column grid for fields */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>First Name</label>
                            <input
                                name='firstName'
                                onChange={onChangeHandler}
                                required
                                type='text'
                                defaultValue={userData?.firstName}
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>Last Name</label>
                            <input
                                type='text'
                                name='lastName'
                                onChange={onChangeHandler}
                                defaultValue={userData?.lastName}
                                required
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>Email</label>
                            <input
                                type='email'
                                defaultValue={userData?.email}
                                // ✅ email field disabled — email change sensitive hota hai
                                disabled
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-500 cursor-not-allowed'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>Phone Number</label>
                            <input
                                type='tel'
                                name='contactNumber'
                                onChange={onChangeHandler}
                                defaultValue={userData?.contactNumber}
                                required
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-all'
                            />
                        </div>
                    </div>

                    {/* ✅ Save button right aligned */}
                    <div className='flex justify-end'>
                        <button disabled={loading} onClick={nameUpdateHandler} className='px-6 py-2 bg-yellow-400 text-gray-900 font-semibold text-sm rounded-lg hover:bg-yellow-300 transition-all duration-200'>
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* ===== UPDATE PASSWORD ===== */}
                <div className='bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4'>
                    <h2 className='text-lg font-semibold text-yellow-400'>Change Password</h2>

                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>Current Password</label>
                            <input
                                onChange={passwordChangeHandler}
                                value={password.currentPassword}
                                name='currentPassword'
                                type='password'
                                placeholder='Enter current password'
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>New Password</label>
                            <input
                                onChange={passwordChangeHandler}
                                value={password.changedPassword}
                                name='changedPassword'
                                type='password'
                                placeholder='Enter new password'
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-all'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-gray-400 text-xs'>Confirm New Password</label>
                            <input
                                type='password'
                                name='confirmPassword'
                                placeholder='Confirm new password'
                                onChange={passwordChangeHandler}
                                className='bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-all'
                            />
                        </div>
                    </div>

                    {/* ✅ Save button right aligned */}
                    <div className='flex justify-end'>
                        <button onClick={passwordUpdateHandler} className='px-6 py-2 bg-yellow-400 text-gray-900 font-semibold text-sm rounded-lg hover:bg-yellow-300 transition-all duration-200'>
                            Update Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Setting