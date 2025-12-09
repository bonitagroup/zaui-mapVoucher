import React, { useEffect, useState } from 'react';
import { Page, Header, Box, Text, Button, useSnackbar } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';

const VoucherPage: React.FC = () => {
  const { myVouchers, fetchMyWallet, useVoucher, loading } = useStore();
  const { openSnackbar } = useSnackbar();
  const [, setTick] = useState(0);

  const safeVouchers = Array.isArray(myVouchers) ? myVouchers : [];

  const formatCountdown = (milliseconds: number) => {
    if (milliseconds <= 0) return '00:00:00';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    fetchMyWallet();

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchMyWallet]);

  const handleUse = async (id: number) => {
    if (!useVoucher) return;
    const result: any = await useVoucher(id);
    if (result.success) {
      openSnackbar({ text: '✅ Sử dụng voucher thành công!', type: 'success' });
    } else {
      openSnackbar({ text: result.message || '❌ Lỗi khi sử dụng', type: 'error' });
    }
  };

  return (
    <Page className="bg-gray-50 h-full pb-20">
      <Header title="Ví Voucher của tôi" showBackIcon={true} className="bg-orange-600 text-white" />

      <Box p={4} className="mt-16">
        {loading && <div className="text-center text-gray-400 mt-4 text-xs">Đang tải ví...</div>}

        {!loading && safeVouchers.length === 0 && (
          <div className="text-center mt-12 text-gray-400 flex flex-col items-center">
            <div className="text-4xl mb-2">🎫</div>
            <p>Ví của bạn đang trống.</p>
            <p className="text-xs mt-1">Hãy ra trang chủ săn voucher nhé!</p>
          </div>
        )}

        {safeVouchers.map((item: any) => {
          const isExpired = new Date() > new Date(item.end_date);
          const isFlashSale = item.type === 'FLASH_SALE';

          const savedTime = new Date(item.saved_at).getTime();
          const holdingTime = (item.holding_time || 30) * 60 * 1000;
          const expireHoldTime = savedTime + holdingTime;
          const now = new Date().getTime();
          const timeLeft = expireHoldTime - now;

          const isHoldExpired = timeLeft <= 0;

          const countdownString = formatCountdown(timeLeft);

          const isCardDisabled = isExpired || isHoldExpired;

          return (
            <div
              key={item.wallet_id || Math.random()}
              className={`rounded-xl shadow-sm overflow-hidden flex mb-4 relative border transition-all ${
                isCardDisabled
                  ? 'bg-gray-100 border-gray-200 opacity-60 grayscale'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div
                className={`w-24 flex flex-col items-center justify-center text-white p-2 border-r-2 border-dashed border-white ${
                  isExpired ? 'bg-gray-400' : isFlashSale ? 'bg-red-600' : 'bg-orange-500'
                }`}
              >
                <span className="font-bold text-lg text-center leading-tight">{item.discount}</span>
                <span className="text-[10px] mt-1 uppercase font-bold tracking-wider">
                  {isFlashSale ? '⚡ FLASH' : 'VOUCHER'}
                </span>
              </div>

              <div className="flex-1 p-3 flex flex-col justify-between min-h-[100px]">
                <div>
                  <Text className="font-bold text-gray-800 line-clamp-1 text-sm">{item.title}</Text>
                  <Text size="xxSmall" className="text-gray-500 line-clamp-1 mb-1">
                    {item.store_name}
                  </Text>

                  {!isExpired && !isHoldExpired && (
                    <div className="flex items-center gap-1 text-orange-600 font-bold animate-pulse mt-1">
                      <span className="text-xs">Hạn sử dụng còn:</span>
                      <span className="font-mono text-sm bg-orange-50 px-1 rounded border border-orange-100">
                        {countdownString}
                      </span>
                    </div>
                  )}

                  {isExpired && (
                    <Text size="xxSmall" className="text-red-500 font-bold">
                      ⚠️ Chương trình đã kết thúc
                    </Text>
                  )}

                  {!isExpired && isHoldExpired && (
                    <Text size="xxSmall" className="text-gray-500 font-bold italic">
                      🚫 Đã hết thời gian giữ chỗ
                    </Text>
                  )}
                </div>

                <div className="flex justify-between items-end mt-2">
                  <div className="bg-gray-50 px-2 py-1 rounded text-xs font-mono text-gray-600 border border-gray-200 select-all">
                    {item.code}
                  </div>

                  {isCardDisabled ? (
                    <span className="text-xs text-gray-400 italic font-medium">Vô hiệu lực</span>
                  ) : (
                    <Button
                      size="small"
                      className="h-8 text-xs bg-teal-600 text-white px-4 shadow-lg shadow-teal-100 active:scale-95 transition-transform"
                      onClick={() => handleUse(item.voucher_id)}
                    >
                      Dùng ngay
                    </Button>
                  )}
                </div>
              </div>

              <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-50 rounded-full mt-[-6px] z-10"></div>
              <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-gray-50 rounded-full mt-[-6px] z-10"></div>
            </div>
          );
        })}
      </Box>
    </Page>
  );
};

export default VoucherPage;
