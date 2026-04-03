import React, { useEffect, useState } from 'react'
import "./App.css"
import { SignUp } from './pages/auth/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Otp from './pages/auth/Otp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassOtpVerify from './pages/auth/ResetPassOtpVerify'
import ResetPassword from './pages/auth/ResetPassword'
import Home from './pages/Home'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { Toaster } from 'react-hot-toast'
import ProductUpload from './pages/ProductUpload'
import SplashScreen from './components/common/SplashScreen'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import WishlistProducts from './pages/WishlistProducts'
import ProductDetails from './pages/product/ProductDetails'
import Setting from './pages/Setting'
import Help from './pages/Help'
import CategoryDetails from './pages/CategoryDetails'
import SearchProducts from './components/home/poduct/SearchProducts'
import ChatbotLogo from './assets/Chatbot-cuate.png'
import ChatbotModel from './components/ChatbotModel'
import MyProducts from './pages/product/MyProducts'
import ChatUsers from './pages/chat/ChatUsers'
import UserConversation from './pages/chat/UserConversation'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setAllOnlineUsers, setSocket } from './redux/slices/socket'
import checkUserAuth from './CheckAuth'
import Error from './components/common/Error'
import checkGuestOnly from './checkGuestOnly'

const router = createBrowserRouter([
  // ✅ Public routes (no auth needed)
  { path: "/", element: <><Navbar /><Home /></> },
  { path: "/login", loader: checkGuestOnly, element: <><Navbar /><Login /><Footer /></> },
  { path: "/signup", loader: checkGuestOnly, element: <><Navbar /><SignUp /><Footer /></> },
  { path: "/otp", element: <><Navbar /><Otp /></> },
  { path: "/forgot-password", element: <><Navbar /><ForgotPassword /></> },
  { path: "/reset-pass-otp-verify", element: <><Navbar /><ResetPassOtpVerify /></> },
  { path: "/reset-password", element: <><Navbar /><ResetPassword /></> },
  { path: "/contact-us", element: <><Navbar /><ContactUs /><Footer /></> },

  // ✅ Protected routes (login required)
  { path: "/about-us", loader: checkUserAuth, element: <><Navbar /><AboutUs /><Footer /></> },
  { path: "/wishlist-products", loader: checkUserAuth, element: <><Navbar /><WishlistProducts /><Footer /></> },
  { path: "/product-details/:productId", element: <><Navbar /><ProductDetails /><Footer /></> },
  { path: "/setting", loader: checkUserAuth, element: <><Navbar /><Setting /><Footer /></> },
  { path: "/help", loader: checkUserAuth, element: <><Navbar /><Help /><Footer /></> },
  { path: "/category/:categoryId", loader: checkUserAuth, element: <><Navbar /><CategoryDetails /><Footer /></> },
  { path: "/searchProducts", loader: checkUserAuth, element: <><Navbar /><SearchProducts /><Footer /></> },
  { path: "/my-products", loader: checkUserAuth, element: <><Navbar /><MyProducts /><Footer /></> },
  { path: "/product-upload", loader: checkUserAuth, element: <><Navbar /><ProductUpload /></> },
  { path: "/chat-users", loader: checkUserAuth, element: <><Navbar /><ChatUsers /></> },
  { path: "/user-conversation", loader: checkUserAuth, element: <><Navbar /><UserConversation /></> },

  // ✅ Fallback
  { path: "*", element: <Error /> },
])

const App = () => {
  const { token } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);
  const [showSplash, setShowSplash] = useState(true);
  const [chatbot, setChatbot] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const socket = io(`${import.meta.env.VITE_SOCKET_BACKEND_URL}`, {
        query: {
          userId: userData?._id,
        }
      });

      dispatch(setSocket(socket));

      socket.on("all-online-users", (data) => {
        dispatch(setAllOnlineUsers(data));
      });

      return () => {
        socket.off("all-online-users");
        socket.disconnect();
      };
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className='bg-[#0B0B0F] text-white min-h-screen w-screen overflow-x-hidden overflow-y-auto'>
      <RouterProvider router={router} />
      <Toaster />

      {/* CHATBOT LOGO */}
      <div
        className='fixed flex items-center justify-center bottom-10 right-2 z-50 cursor-pointer animate-bounce'
        onClick={() => setChatbot(true)}
      >
        <img className='h-24' src={ChatbotLogo} alt="ChatbotLogo-image" />
      </div>

      {chatbot && <ChatbotModel setChatbot={setChatbot} />}
    </div>
  );
};

export default App;