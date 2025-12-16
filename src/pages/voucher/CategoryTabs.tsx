import React from 'react';

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, setActiveTab }) => {
  const categories = ['Tất cả', 'Ẩm thực', 'Thể thao', 'Giải trí', 'Lưu Trú'];
  return (
    <div className="bg-white pt-4 pb-3 sticky  z-40 shadow-sm border-b border-gray-100">
      <div className="flex overflow-x-auto no-scrollbar px-4 gap-1">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`
                flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#D83231] text-white border-[#D83231] shadow-md shadow-red-200'
                    : 'bg-white text-red-500 border-red-400 hover:border-red-300 hover:text-red-500'
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CategoryTabs);
