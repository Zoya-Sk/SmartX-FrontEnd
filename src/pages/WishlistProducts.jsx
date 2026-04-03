import { Button, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../components/home/poduct/ProductCard'
import { LiaCartArrowDownSolid } from 'react-icons/lia'
import { useNavigate } from 'react-router-dom'
import SkeletonLoading from '../components/common/SkeletonLoading'

const WishlistProducts = () => {
  const { allProducts = [] } = useSelector((state) => state.wishlist)
  const navigate = useNavigate()

  return (
    <div className="w-[90vw] mx-auto mt-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography
          variant="h5"
          sx={{ textTransform: 'uppercase' }}
          className="text-yellow-500"
        >
          Your Wishlist
        </Typography>

        <div className="flex items-center gap-1">
          <p className="text-gray-300 font-semibold text-[18px]">Total Products:</p>
          <p className="text-yellow-400 font-semibold">{allProducts.length}</p>
        </div>
      </div>
      <hr className="mt-2 border-gray-700" />

      {/* Empty State */}
      {!allProducts.length ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center">
          <LiaCartArrowDownSolid size={90} className="text-gray-600" />
          <p className="text-gray-300 text-xl font-semibold">Your Wishlist is Empty</p>
          <p className="text-gray-500 text-sm">Save items you love and find them here anytime</p>
          <Button
            variant="contained"
            onClick={() => navigate("/")}   // ✅ arrow function
            sx={{
              backgroundColor: '#EAB308',
              color: '#000',
              fontWeight: 'bold',
              px: 4,
              '&:hover': { backgroundColor: '#CA9A08' },
            }}
          >
            Discover Products
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 mt-4">
          {allProducts.map((product) => (
            // ✅ stable key instead of index
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistProducts