import React from 'react';
import { Box, Text } from 'zmp-ui';

const WelcomeHeader: React.FC = () => {
  return (
    <div className="bg-orange-500 p-4 pb-[80px] pt-12 rounded-b-3xl shadow-md text-white">
      <div className="flex justify-between items-start">
        <div>
          <Text size="small" className="opacity-90 text-white">
            Xin chào,
          </Text>
          <Text.Title size="normal" className="font-bold text-white mt-1">
            Người săn Voucher!
          </Text.Title>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
