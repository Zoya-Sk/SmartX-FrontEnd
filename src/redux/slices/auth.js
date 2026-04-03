import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
}


export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setToken:(state,value)=>{
            state.token = value.payload;
            localStorage.setItem("token",JSON.stringify(state.token));
        },
        removeToken:(state)=>{
            state.token = null;
            localStorage.removeItem("token");
        }
    }
})

export const {setToken,removeToken} = authSlice.actions;
export default authSlice.reducer;