import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoSettingsOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { MdOutlineContactSupport } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdShoppingBag } from "react-icons/md";
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { useDispatch } from 'react-redux';
import { removeToken } from '../../redux/slices/auth';
import { setUserData } from '../../redux/slices/userData';
import toast from 'react-hot-toast';


const UserProfileDropdown = ({ setShowDropdown }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const showDailog = () => {
    setOpen(true);
  }

  const cancelHandler = () => {
    setOpen(false);
    setShowDropdown(false);
  }

  const logoutHandler = () => {
    dispatch(removeToken());
    dispatch(setUserData(null));
    setOpen(false);
    setShowDropdown(false);
    toast.success("Log Out Successfully!");
  }
  return (
    <div className='px-4 py-1 flex flex-col gap-2 pb-3'>
      <Link to="/chat-users" className='flex items-center gap-2 hover:bg-gray-300 rounded-lg px-2 py-1 transition-all duration-200' onClick={() => { setShowDropdown(false) }}><IoChatboxEllipses size={25} /><p className='font-semibold text-[18px]'>Chat</p></Link>
      <Link to="/setting" className='flex items-center gap-2 hover:bg-gray-300 rounded-lg px-2 py-1 transition-all duration-200' onClick={() => { setShowDropdown(false) }}><IoSettingsOutline size={25} /><p className='font-semibold text-[18px]'>Settings</p></Link>
      <Link to="/my-products" className='flex items-center gap-2 hover:bg-gray-300 rounded-lg px-2 py-1 transition-all duration-200' onClick={() => { setShowDropdown(false) }}>
        <FaBoxOpen size={25} />
        <p className='font-semibold text-[18px]'>My Products</p>
      </Link>
      <Link to="/my-orders" className='flex items-center gap-2 hover:bg-gray-300 rounded-lg px-2 py-1 transition-all duration-200' onClick={() => { setShowDropdown(false) }}>
        <MdShoppingBag size={25} />
        <p className='font-semibold text-[18px]'>My Orders</p>
      </Link>
      <Link to="/help" className='flex items-center gap-2 hover:bg-gray-300 rounded-lg px-2 py-1 transition-all duration-200' onClick={() => { setShowDropdown(false) }}><MdOutlineContactSupport size={25} /><p className='font-semibold text-[18px]'>Help</p></Link>
      <Button variant='contained' className='gap-2' sx={{ textTransform: 'none' }} onClick={showDailog}><MdLogout size={20} />Log Out</Button>

      <Dialog open={open} onClose={() => { setOpen(false); }}>
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogActions>
          {/* ✅ Added confirm and cancel buttons */}
          <Button variant='outlined' sx={{ textTransform: 'none' }} onClick={cancelHandler}>Cancel</Button>
          <Button variant='contained' sx={{ textTransform: 'none' }} onClick={logoutHandler} color="error">Log Out</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserProfileDropdown