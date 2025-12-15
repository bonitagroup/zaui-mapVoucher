import React from 'react';
import { Box, Text } from 'zmp-ui';

const WelcomeHeader: React.FC = () => {
  return (
    <div className="bg-[#D83231] p-4 pb-[10px] pt-12 shadow-md text-white">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <Text.Title size="xLarge" className="font-bold text-white mt-1">
            Thái Nguyên Voucher Maps
          </Text.Title>
          <Text size="small" className="opacity-90 text-white pl-2">
            Voucher ở mọi nơi, săn ngay nào !!!
          </Text>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
