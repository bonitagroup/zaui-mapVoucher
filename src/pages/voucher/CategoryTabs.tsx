import React from 'react';
import { VOUCHER_TABS } from '@/constants/categories';

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex overflow-x-auto no-scrollbar px-4 pt-3 pb-1 gap-6">
        {VOUCHER_TABS.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <div
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 pb-2 cursor-pointer transition-all font-medium text-sm ${
                isActive
                  ? 'text-[#D83231] border-b-2 border-[#D83231] font-bold'
                  : 'text-gray-500 border-b-2 border-transparent'
              }`}
            >
              {cat}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
