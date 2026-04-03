import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import toast from "react-hot-toast";

const SearchBox = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onChangeHandler = async (e) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);

    if (!inputValue || inputValue.length < 3) {
      setAllProducts([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      setShowDropdown(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/search-products/${inputValue}`
      );

      if (!response?.data?.success) {
        throw new Error("Couldn't search products. Please try again.");
      }
      setAllProducts(response?.data?.allProducts);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setUserInput("");
    navigate(`/product-details/${productId}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      navigate("/searchProducts", {
        state: { allProducts, searchQuery: userInput }
      });
      setShowDropdown(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .search-dropdown { animation: dropIn 0.18s ease both; }
        .search-row      { animation: rowIn 0.2s ease both; }
        .search-input:focus { box-shadow: 0 0 0 2px #facc15; }
      `}</style>

      <div ref={wrapperRef} className="relative w-full max-w-[600px]">
        {/* ── Input Bar ── */}
        <form onSubmit={submitHandler} className="flex items-center">
          <div className="relative flex-1">
            <FaMagnifyingGlass
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={userInput}
              onChange={onChangeHandler}
              onFocus={() => userInput.length > 2 && setShowDropdown(true)}
              placeholder="Search products, brands & more…"
              className="search-input w-full bg-[#1e2330] border border-white/10 text-white placeholder-gray-500 text-[13px] pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all duration-200"
            />
            {/* Clear button */}
            {userInput && (
              <button
                type="button"
                onClick={() => { setUserInput(""); setAllProducts([]); setShowDropdown(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            className="ml-2 bg-yellow-400 hover:bg-yellow-300 transition-colors duration-150 text-black font-semibold text-[13px] px-4 py-2.5 rounded-xl"
          >
            Search
          </button>
        </form>

        {/* ── Dropdown ── */}
        {showDropdown && (
          <div className="search-dropdown absolute top-[calc(100%+8px)] left-0 w-full bg-[#1a1f2e] border border-white/10 rounded-xl z-50 overflow-hidden shadow-2xl shadow-black/60">

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader />
              </div>

            ) : allProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-1">
                  <FaMagnifyingGlass size={16} className="text-gray-600" />
                </div>
                <p className="text-white text-sm font-medium">No products found</p>
                <p className="text-gray-500 text-xs">
                  Try different keywords or check spelling
                </p>
              </div>

            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {/* Header */}
                <li className="px-4 py-2 flex items-center justify-between">
                  <span className="text-[11px] tracking-widest uppercase text-gray-500 font-medium">
                    Results
                  </span>
                  <span className="text-[11px] text-yellow-400 font-semibold">
                    {allProducts.length} found
                  </span>
                </li>

                {allProducts.map((product, index) => (
                  <li
                    key={product?._id || index}
                    className="search-row"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => handleProductClick(product?._id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150 text-left group"
                    >
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                        {product?.productImage?.[0] ? (
                          <img
                            src={product.productImage[0]}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                            ?
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[13px] font-medium truncate group-hover:text-yellow-400 transition-colors">
                          {product?.productName}
                        </p>
                        {product?.productPrice && (
                          <p className="text-yellow-400 text-[12px] font-semibold mt-0.5">
                            ₹{Number(product.productPrice).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-sm">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBox;