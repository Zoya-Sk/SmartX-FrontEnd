import { Button, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SiGooglegemini } from "react-icons/si";
import { FaFileImage } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductUpload = () => {
    const { userData } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [descLoading, setDescLoading] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const location = useLocation();
    const [condition, setCondition] = useState("Used");
    const navigate = useNavigate();
    const [formdata, setformdata] = useState({
        productName: "",
        description: "",
        price: "",
        category: "",
        location: "",
        contactNumber: "",
    });
    const [images, setImages] = useState([]);


    const productData = location?.state;

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setformdata(prev => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages(selectedFiles);
    }

    const imageRemoveHandler = (imageIndex) => {
        const remainImages = images.filter((img, index) => index !== imageIndex);
        setImages(remainImages);
    }

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllCategories`);

            // validation
            if (!response?.data?.success) {
                throw new Error("Could not load categories. Please try again.");
            }
            console.log(response?.data?.allCategories[0]) // added 
            setAllCategories(response?.data?.allCategories);
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something wnet Wrong!");
            setLoading(false);

        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // validation
        if (descLoading) {
            return;
        }

        const formData = new FormData();
        formData.append("productName", formdata.productName);
        formData.append("description", formdata.description);
        formData.append("contactNumber", formdata.contactNumber);
        formData.append("categoryId", formdata.category);
        formData.append("location", formdata.location);
        formData.append("condition", condition);
        formData.append("price", formdata.price);
        formData.append("sellerId", userData?._id);

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        const toastId = toast.loading("Uploading Product...");
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload-product`, formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });

            // VALIDATION 
            if (!response?.data?.success) {
                throw new Error("Couldn't upload product. Please try again.");
            }
            toast.dismiss(toastId);
            navigate("/my-products")
            toast.success(response?.data?.message);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.dismiss(toastId);
            console.log(error);
            toast.error(error.response?.data?.message || "Something went Wrong");
        }
    }

    const productUpdateHandler = async (e) => {
        e.preventDefault();

        if (descLoading) return;

        if (
            formdata.category === productData?.category &&
            formdata.contactNumber === productData?.contactNumber &&
            formdata.description === productData?.description &&
            formdata.location === productData?.location &&
            formdata.price === productData?.price &&
            formdata.productName === productData?.productName &&
            formdata.condition === productData?.condition
        ) {
            toast.error("Changes not found! Please update something before submitting.");
            return;
        }

        const toastId = toast.loading("Updating Product...");
        try {
            setLoading(true);

            const productId = productData?._id; // ✅ productId yahan se lo

            const response = await axios.put(  // ✅ response variable mein store karo
                `${import.meta.env.VITE_BACKEND_URL}/edit-products/${productId}`,
                {
                    ...formdata,
                    sellerId: userData?._id,
                    condition: condition,
                },
                {
                    headers: { Authorization: 'Bearer ' + token }
                }
            );

            if (!response?.data?.success) {
                throw new Error("Couldn't Update Product. Please try again.");
            }

            toast.dismiss(toastId);
            toast.success(response?.data?.message);
            navigate("/my-products");
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went Wrong!");
        }
    }

    const productDescriptionEnhancerHandler = async () => {
        // validation
        if (loading) {
            return;
        }
        if (formdata.description.length < 10) {
            toast.error("Description is too short!");
            return;
        }
        const data = {
            description: formdata.description,
        }
        try {

            setDescLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/productDescriptionEnhancer`,
                data, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }
            )

            if (!response?.data?.success) {
                throw new Error("Couldn't enhance the product description. Please try again.")
            }

            setformdata(prev => ({ ...prev, description: response?.data?.response }));

            setDescLoading(false);

        } catch (error) {
            console.log(error);
            setDescLoading(false);
            toast.error(error.response?.data?.message);

        }
    }

    const titleEnhancerHandler = async () => {
        if (loading) return;
        if (formdata.productName.length < 3) {
            toast.error("Product name is too short!");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/titleEnhancer`,
                { title: formdata.productName },
                { headers: { Authorization: 'Bearer ' + token } }
            );
            setformdata(prev => ({ ...prev, productName: response?.data?.response }));
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        if (productData) {
            setformdata(productData);
            setCondition(productData?.condition);
        }
    }, [productData])

    return (
        <div className='bg-gray-900 min-h-screen'>
            <Typography variant='h5' sx={{ marginTop: "16px", fontWeight: 900, marginBottom: "16px" }} align='center'>
                {
                    productData ? "UPDATE " : "POST "
                }
                YOUR AD

            </Typography>
            <div className='w-[80%] mx-auto border rounded-md border-gray-600 p-4'>
                <form className='flex flex-col gap-2' onSubmit={productData ? productUpdateHandler : submitHandler}>
                    <Typography variant='h6' sx={{ textTransform: 'uppercase', fontWeight: 400, marginBottom: "16px" }}>Include Some Details</Typography>

                    {/* PRODUCT NAME  */}
                    <TextField
                        type='text' variant='outlined'
                        name='productName'
                        value={formdata.productName}
                        fullWidth
                        inputProps={{
                            style: {
                                color: "white",
                                background: "#1F2937"
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end' sx={{ color: "white" }}>
                                    <SiGooglegemini size={30} className='cursor-pointer'
                                        onClick={titleEnhancerHandler} />
                                </InputAdornment>
                            )
                        }}
                        label="Product Name"
                        placeholder='Enter your Product Name'
                        InputLabelProps={{
                            sx: {
                                color: "white",
                                "&.Mui-focused": { color: "white" }
                            }
                        }}
                        sx={{
                            "& input": { color: "white" },
                            "& input:-webkit-autofill": {
                                WebkitTextFillColor: "white",
                                WebkitBoxShadow: "0 0 0px 1000px #1F2937 inset",
                            },
                            "& .MuiOutlinedInput-root": {
                                background: "#1F2937",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                            },
                        }}
                        onChange={changeHandler}
                        required
                    />

                    {/* PRODUCT DESCRIPTION  */}
                    <label>
                        <div className='flex items-center'>
                            <p className='text-[18px]'>DESCRIPTION <sup>*</sup></p>
                            <SiGooglegemini size={35} className='cursor-pointer'
                                onClick={() => { productDescriptionEnhancerHandler(true) }} />
                        </div>
                        <textarea name="description" value={formdata.description} required placeholder='Include condition, features and reason for selling' className='bg-gray-800 w-full rounded-md outline-none p-2 placeholder-gray-400 text-white' rows={4} onChange={changeHandler}></textarea>
                    </label>

                    {/* LOCATION  */}
                    <TextField type='text' variant='outlined'
                        fullWidth
                        inputProps={{
                            style: {
                                color: "white",
                                background: "#1F2937"
                            }
                        }}
                        label="Location"
                        placeholder='Enter your Location'
                        InputLabelProps={{
                            sx: {
                                color: "white",
                                "&.Mui-focused": { color: "white" }
                            }
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                            },
                        }}
                        name='location'
                        value={formdata.location}
                        onChange={changeHandler}
                        required
                    />

                    {/* CONTACT INFO  */}
                    <TextField
                        type='number'
                        variant='outlined'
                        fullWidth
                        sx={{
                            // Target the actual input text
                            "& input": {
                                color: "white",
                            },
                            // Remove number spinner arrows
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                            },
                            // Fix autofill text color
                            "& input:-webkit-autofill": {
                                WebkitTextFillColor: "white",
                                WebkitBoxShadow: "0 0 0px 1000px #1F2937 inset",
                            },
                            // Outlined border color
                            "& .MuiOutlinedInput-root": {
                                background: "#1F2937",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                            },
                        }}
                        label="Contact Number"
                        placeholder='Enter your Contact'
                        InputLabelProps={{
                            sx: {
                                color: "white",
                                "&.Mui-focused": { color: "white" },
                            }
                        }}
                        name='contactNumber'
                        value={formdata.contactNumber}
                        onChange={changeHandler}
                        required
                    />

                    {/* SET PRICE  */}
                    <TextField type='number' variant='outlined'
                        fullWidth
                        inputProps={{
                            style: {
                                color: "white",
                                background: "#1F2937"
                            }
                        }}
                        label="Product Price"
                        placeholder='Enter your Product Price'
                        InputLabelProps={{
                            sx: {
                                color: "white",
                                "&.Mui-focused": { color: "white" }
                            }
                        }}
                        sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                            },
                        }}
                        name='price'
                        value={formdata.price}
                        onChange={changeHandler}
                        required
                    />

                    {/* CATEGORY SELECTION */}
                    <label>
                        <Typography variant='h6' sx={{ textTransform: 'uppercase', fontWeight: 400, marginBottom: "6px", marginTop: "8px" }}>Product Category <sup>*</sup></Typography>
                        <select
                            className='bg-gray-800 px-2 py-4 w-full outline-none border-none text-white rounded-md'
                            value={formdata.category}
                            name='category'
                            onChange={changeHandler}
                            required
                        >
                            <option value="">Choose a Category</option>
                            {
                                allCategories.map((category, index) => (
                                    <option key={index} value={category?._id}>
                                        {category?.categoryName}
                                    </option>
                                ))
                            }
                        </select>
                    </label>

                    {/* CONDITION  */}
                    <div>
                        <Typography variant='h6' sx={{ textTransform: 'uppercase', fontWeight: 400, marginTop: "8px" }}>Condition of the Product</Typography>
                        <div className='flex flex-row gap-4 bg-gray-800 w-fit px-6 py-2 rounded-md'>
                            <div className={`px-4 py-2 rounded-full cursor-pointer ${condition === "New" ? "bg-slate-950" : ""}`} onClick={() => { setCondition("New") }}>New</div>
                            <div className={`px-4 py-2 rounded-full cursor-pointer ${condition === "Used" ? "bg-slate-950" : ""}`} onClick={() => { setCondition("Used") }}>Used</div>
                        </div>
                    </div>

                    {/* PRODUCT IMAGES UPLOAD  */}
                    {
                        !productData && <div>
                            <Typography variant='h6' sx={{ textTransform: 'uppercase', fontWeight: 400 }}>Upload photos</Typography>
                            <label className='relative'>
                                <div className='w-full border bg-gray-800 border-gray-600 h-[250px] border-dashed flex flex-col gap-2 items-center justify-center cursor-pointer mb-2'>

                                    {images.length < 1 ? (
                                        <>
                                            <FaFileImage size={50} />
                                            <p>Your Files Here or Browse to Upload</p>
                                        </>
                                    ) : (
                                        <div className='flex flex-wrap gap-2 justify-center items-center h-full w-full p-2'>
                                            {images.length > 0 && Array.from(images).map((img, index) => (
                                                <div key={index} className='relative'>
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt='preview'
                                                        className='h-32 w-32 object-cover rounded'
                                                    />
                                                    <div className='absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-[2px] cursor-pointer hover:bg-opacity-90'
                                                        onClick={(e) => {
                                                            e.preventDefault() // ← important! prevents label from opening file picker
                                                            imageRemoveHandler(index)
                                                        }}

                                                    >
                                                        <RxCross2 size={14} color='white' />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                                <input type="file" multiple className='hidden' accept="image/*" onChange={handleImageChange} />

                            </label>
                        </div>
                    }


                    {/* SUBMIT BUTTON */}
                    <div className='relative flex justify-center'>
                        <Button
                            disabled={loading}
                            variant='contained'
                            size='large'
                            type='submit'
                            sx={{ backgroundColor: "#EAB308", color: "black", width: "50%", display: "block", margin: "0 auto", display: "flex", gap: "8px", }}>
                            {
                                productData ? "Update Product" : "Post Now"
                            }

                            {
                                loading && <i className="fa-solid fa-spinner text-black animate-spin absolute right-3"></i>
                            }
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ProductUpload