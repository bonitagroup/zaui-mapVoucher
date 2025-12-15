import React from 'react';
import { Box, Input, Text as ZText } from 'zmp-ui';
import { TOP_BAR_FILTERS } from '@/constants/categories';

interface MapSearchBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  selectedCategory: string;
  onTagClick: (tag: string) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({
  keyword,
  setKeyword,
  selectedCategory,
  onTagClick,
}) => {
  const suggestions = TOP_BAR_FILTERS;

  return (
    <Box className="absolute top-0 left-0 mt-[80px] right-0 z-[1000] p-4 flex flex-col gap-2 pointer-events-none">
      <Box className="bg-white rounded-full shadow-md pointer-events-auto flex items-center pr-2">
        <Input.Search
          placeholder="Tìm kiếm theo yêu cầu..."
          className="border-none h-9 ml-3 flex-1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          clearable
        />
      </Box>
      <Box className="flex gap-2 pointer-events-auto overflow-x-auto scrollbar-hide">
        {suggestions.map((item) => {
          const isActive = selectedCategory === item.label;

          return (
            <Box
              key={item.key}
              onClick={() => onTagClick(item.label)}
              className={`
                px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border active:scale-95 transition-all duration-200
                ${
                  isActive
                    ? 'bg-red-50 border-red-500 ring-1 ring-red-500'
                    : 'bg-white border-gray-100'
                }
              `}
            >
              <Box className={`w-2.5 h-2.5 rounded-full ${item.color}`}></Box>
              <ZText
                size="xSmall"
                className={`font-bold ${isActive ? 'text-red-600' : 'text-gray-700'}`}
              >
                {item.label}
              </ZText>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MapSearchBar;
