import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    allProducts:localStorage.getItem("wishlistProducts") ?  JSON.parse(localStorage.getItem("wishlistProducts")) : [],
}

export const  wishlistSlice = createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        addProductToWishlist:(state, value)=>{
            const isAdded = state.allProducts.some((product)=> product?._id === value.payload?._id);

            // validation
            if(isAdded){
                toast.error("Product Already added to wishlist");
                return ;
            }
            state.allProducts.push(value.payload);
            localStorage.setItem("wishlistProducts", JSON.stringify(state.allProducts));
        },
        removeProductFromWishlist:(state, value)=>{
            // validation
            const isAdded = state.allProducts.some((product)=> product?._id === value.payload?._id);
            if(!isAdded){
                return ;
            }
            const filteredProducts = state.allProducts.filter((product)=> product?._id !== value.payload?._id);
            state.allProducts = filteredProducts;
            localStorage.setItem("wishlistProducts", JSON.stringify(state.allProducts));
        }
    }
})

export const  { addProductToWishlist, removeProductFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;