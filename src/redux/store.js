import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth";
import { userSlice } from "./slices/userData";
import { wishlistSlice } from "./slices/wishlist";
import { socketSlice } from "./slices/socket";


export const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        user:userSlice.reducer,
        wishlist:wishlistSlice.reducer,
        socketIo:socketSlice.reducer,
    }
})