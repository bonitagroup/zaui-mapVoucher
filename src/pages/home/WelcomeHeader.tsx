import React from 'react';
import { Box, Text } from 'zmp-ui';

const WelcomeHeader: React.FC = () => {
  return (
    <div className="bg-[#D83231] p-4 pb-[80px] pt-12 rounded-b-3xl shadow-md text-white">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <Text.Title size="normal" className="font-bold text-white mt-1">
            Thái Nguyên Voucher Maps
          </Text.Title>
          <Text size="small" className="opacity-90 text-white pl-4">
            "Đi đâu cũng có deal, ăn gì cũng tiết kiệm"
          </Text>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
