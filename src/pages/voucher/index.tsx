import React, { useEffect } from 'react';
import { Page, Header, Box, Text, Button } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';

const VoucherPage: React.FC = () => {
  const { myVouchers, fetchMyWallet, loading } = useStore();

  const safeVouchers = Array.isArray(myVouchers) ? myVouchers : [];

  useEffect(() => {
    fetchMyWallet();
  }, [fetchMyWallet]);

  return (
    <Page className="bg-gray-50 h-full pb-20 pt-20">
      <Header
        title="Ví Voucher của tôi"
        showBackIcon={false}
        className="text-white shadow-sm bg-orange-500 "
      />

      <Box p={4}>
        {loading && <div className="text-center text-gray-400 mt-4">Đang tải ví...</div>}

        {!loading && safeVouchers.length === 0 && (
          <div className="text-center mt-10 text-gray-400 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              🎫
            </div>
            <p>Bạn chưa lưu voucher nào.</p>
            <p className="text-xs mt-1">Hãy ra trang chủ tìm quán để săn nhé!</p>
          </div>
        )}

        {safeVouchers.map((item: any) => (
          <div
            key={item.wallet_id || Math.random()}
            className="bg-white rounded-xl shadow-md overflow-hidden flex mb-4 relative border border-gray-100"
          >
            <div className="w-24 bg-orange-500 flex flex-col items-center justify-center text-white p-2 border-r-2 border-dashed border-white">
              <span className="font-bold text-lg text-center leading-tight">
                {item.discount || 'KM'}
              </span>
              <span className="text-[10px] opacity-80 mt-1 uppercase">Voucher</span>
            </div>

            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <Text className="font-bold text-gray-800 line-clamp-1">{item.title}</Text>
                <Text size="xxSmall" className="text-gray-500">
                  {item.store_name}
                </Text>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600 border border-gray-200">
                  {item.code}
                </div>
                <Button size="small" className="h-7 text-xs bg-teal-600 text-white">
                  Dùng ngay
                </Button>
              </div>
            </div>

            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full mt-[-8px]"></div>
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full mt-[-8px]"></div>
          </div>
        ))}
      </Box>
    </Page>
  );
};

export default VoucherPage;
