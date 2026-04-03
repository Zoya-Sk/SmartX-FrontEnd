import React from 'react';

const SkeletonLoading = () => {
  return (
    <div className="w-full bg-gray-800 border border-gray-700 px-2 py-2 rounded-md flex flex-col gap-3 cursor-pointer animate-pulse">
      {/* Image placeholder with heart icon area */}
      <div className="w-full h-[150px] relative">
        <div className="w-full h-full bg-gray-700 rounded-md" />
        <div className="absolute top-1 right-1 bg-gray-700 rounded-full p-1">
          <div className="w-5 h-5 bg-gray-600 rounded-full" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-1">
        {/* Price line */}
        <div className="flex items-center gap-1 font-semibold text-[18px]">
          <div className="w-4 h-4 bg-gray-700 rounded" />
          <div className="w-16 h-5 bg-gray-700 rounded" />
        </div>

        {/* Product name */}
        <div className="w-3/4 h-4 bg-gray-700 rounded" />

        {/* Description (single line) */}
        <div className="w-full h-3 bg-gray-700 rounded" />

        {/* Location and date */}
        <div className="flex items-center justify-between text-[12px] mt-1">
          <div className="w-1/3 h-3 bg-gray-700 rounded" />
          <div className="w-1/4 h-3 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;