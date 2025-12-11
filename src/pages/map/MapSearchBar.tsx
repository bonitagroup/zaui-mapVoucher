import React from 'react';
import { Box, Input, Text as ZText } from 'zmp-ui';

interface MapSearchBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ keyword, setKeyword }) => {
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
        <Box className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100">
          <Box className="w-2.5 h-2.5 rounded-full bg-green-700 animate-pulse"></Box>
          <ZText size="xSmall" className="font-bold text-gray-700">
            sức khỏe
          </ZText>
        </Box>
        <Box className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100">
          <Box className="w-2.5 h-2.5 rounded-full bg-red-500"></Box>
          <ZText size="xSmall" className="font-bold text-gray-700">
            ăn uống
          </ZText>
        </Box>
        <Box className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-gray-100">
          <Box className="w-2.5 h-2.5 rounded-full bg-blue-500"></Box>
          <ZText size="xSmall" className="font-bold text-gray-700">
            dịch vụ
          </ZText>
        </Box>
      </Box>
    </Box>
  );
};

export default MapSearchBar;
