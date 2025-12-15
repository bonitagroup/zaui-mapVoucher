import React from 'react';
import { Box } from 'zmp-ui';

interface CategoryQuickAccessProps {
  onSelect: (keyword: string) => void;
  activeCategory: string;
}

const CategoryQuickAccess: React.FC<CategoryQuickAccessProps> = ({ onSelect, activeCategory }) => {
  const categories = [
    { label: 'Ăn uống', value: 'food|drink' },
    { label: 'Thể thao', value: 'sport' },
    { label: 'Giải trí', value: 'health|playground' },
    { label: 'Lưu trú', value: 'service' },
  ];

  return (
    <Box className="flex justify-center items-center gap-2 px-2 pt-4 pb-2 overflow-x-auto scrollbar-hide  bg-white/20 relative z-20">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <div
            key={cat.value}
            onClick={() => onSelect(isActive ? 'Tất cả' : cat.value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full border border-red-500 text-red-500 text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap select-none
              ${
                isActive
                  ? 'bg-[#D83231] text-white border-[#D83231] shadow-red-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:text-red-500'
              }
            `}
          >
            {cat.label}
          </div>
        );
      })}
    </Box>
  );
};

export default CategoryQuickAccess;
