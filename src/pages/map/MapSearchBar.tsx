import React from 'react';
import { Box, Input, Text as ZText } from 'zmp-ui';
import { MAP_CATEGORY_CONFIG } from '@/constants/categories';

interface MapSearchBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  onTagClick?: (tag: string) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ keyword, setKeyword, onTagClick }) => {
  const suggestions = MAP_CATEGORY_CONFIG.filter((c) => c.key !== 'ALL');

  return (
    <Box className="absolute top-0 left-0 mt-3 right-0 z-[1000] p-4 flex flex-col gap-3 pointer-events-none">
      <Box className="bg-white rounded-xl shadow-md pointer-events-auto flex items-center pr-2">
        <Input.Search
          placeholder="Tìm món lẩu, nướng..."
          className="border-none h-11 flex-1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          clearable
        />
      </Box>
      <Box className="flex gap-2 pointer-events-auto overflow-x-auto scrollbar-hide">
        {suggestions.map((item) => (
          <Box
            key={item.key}
            onClick={() => (onTagClick ? onTagClick(item.label) : setKeyword(item.label))}
            className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100 active:scale-95 transition-transform"
          >
            <Box className={`w-2.5 h-2.5 rounded-full ${item.color}`}></Box>
            <ZText size="xSmall" className="font-bold text-gray-700">
              {item.label}
            </ZText>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MapSearchBar;
