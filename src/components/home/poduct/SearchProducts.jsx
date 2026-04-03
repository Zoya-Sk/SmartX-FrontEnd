import React from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from './ProductCard';

const SearchProducts = () => {
  const location = useLocation();
  const allProducts = location.state?.allProducts || [];
  const searchQuery = location.state?.searchQuery;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-8 max-w-7xl mx-auto">
      <p className="text-gray-400 text-sm mb-1">Search results for</p>
      <h2 className="text-2xl font-bold mb-1">"{searchQuery}"</h2>
      <p className="text-yellow-400 text-sm mb-8">{allProducts.length} products found</p>

      {allProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {allProducts.map((product, index) => (
            <ProductCard key={product?._id || index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts