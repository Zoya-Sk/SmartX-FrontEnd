import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setToken:(state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", state.token); 
        },
        removeToken:(state) => {
            state.token = null;
            localStorage.removeItem("token");
        }
    }
})

export const {setToken, removeToken} = authSlice.actions;
export default authSlice.reducer;