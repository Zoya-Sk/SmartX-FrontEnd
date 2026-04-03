import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import ProductCard from "../components/home/poduct/ProductCard";
import toast from "react-hot-toast";
import SkeletonLoading from "../components/common/SkeletonLoading";

const CategoryDetails = () => {
  const params = useParams();
  const categoryId = params?.categoryId;
  const [loading, setLoading] = useState(false);
  const [categoryPageDetails, setCategoryPageDetails] = useState({});

  const getCategoryPageDetails = async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/categoryDetails/${categoryId}`
      );

      if (!response?.data?.success) {
        throw new Error("Couldn't fetch category page details. Please try again.");
      }
      setCategoryPageDetails(response?.data?.categoryPageDetails);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryPageDetails();
  }, [categoryId]);

  const products = categoryPageDetails?.categoryAllProducts || [];
  const categoryName = categoryPageDetails?.categoryName || "";

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonLoading key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-[system-ui]">

      {/* ── Breadcrumb Banner ── */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link to="/categories" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
              Categories
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-yellow-400 font-medium capitalize">{categoryName}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-yellow-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                Browse Category
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold capitalize text-white leading-tight">
                {categoryName}
              </h1>
              <p className="text-gray-400 mt-2 text-sm max-w-md">
                Buy second-hand &amp; new <span className="text-white font-medium capitalize">{categoryName}</span> — great deals from anywhere in India.
              </p>
            </div>

            {products.length > 0 && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 self-start sm:self-auto">
                <span className="text-2xl font-bold text-yellow-400">{products.length}</span>
                <span className="text-gray-400 text-sm leading-tight">
                  listings<br />available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {products.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <svg className="w-9 h-9 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              There are no listings in this category yet. Check back later or explore other categories.
            </p>
            <Link
              to="/"
              className="mt-6 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-xs text-gray-500 tracking-widest uppercase">All Listings</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, index) => (
                <div
                  key={product?._id || index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fade-in keyframe — inject once via a style tag */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease both;
        }
      `}</style>
    </div>
  );
};

export default CategoryDetails;