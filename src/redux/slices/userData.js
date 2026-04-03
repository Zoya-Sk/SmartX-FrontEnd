import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData:localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null,
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData:(state,value)=>{
            state.userData = value.payload;
            localStorage.setItem("userData", JSON.stringify(state.userData));
        }
    }
});

export const  { setUserData } = userSlice.actions;
export default userSlice.reducer;