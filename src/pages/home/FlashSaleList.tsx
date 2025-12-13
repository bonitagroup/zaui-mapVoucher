import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Icon, useSnackbar } from 'zmp-ui';
import { usePublicStore } from '@/hooks/usePublicStore';
import { useMyWallet } from '@/hooks/useMyWallet';
import { useNavigate } from 'react-router-dom';
import { formatCountdown } from '@/utils/dateFormatter';

const FlashSaleItem = React.memo(
  ({ item, onSave }: { item: any; onSave: (id: number) => Promise<boolean> }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isSaved, setIsSaved] = useState(Boolean(item.is_saved));
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const calculateTime = () => {
        const end = new Date(item.end_date).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) return 'Đã kết thúc';

        return formatCountdown(diff);
      };

      setTimeLeft(calculateTime());
      const timer = setInterval(() => {
        setTimeLeft(calculateTime());
      }, 1000);
      return () => clearInterval(timer);
    }, [item.end_date]);

    useEffect(() => {
      setIsSaved(Boolean(item.is_saved));
    }, [item.is_saved]);

    const handleButtonClick = async () => {
      if (isSaved) {
        navigate('/my-voucher');
        return;
      }

      setIsLoading(true);
      const success = await onSave(item.id);
      setIsLoading(false);
      if (success) {
        setIsSaved(true);
      }
    };

    return (
      <div className="flex-shrink-0 w-[280px] bg-[#FFF5F1] p-3 rounded-xl border border-orange-100 shadow-sm flex flex-col gap-2 snap-center">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Icon icon="zi-poll" size={12} />
            <span>Giảm {item.discount}</span>
            <span className="opacity-60">|</span>
            <span className="font-mono tracking-wide">{timeLeft}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex-1 pr-2 min-w-0">
            <Text className="font-bold text-gray-800 text-sm line-clamp-1">{item.store_name}</Text>
            <Text size="xxSmall" className="text-gray-500 line-clamp-1">
              {item.title}
            </Text>
            <Text size="xxSmall" className="text-gray-500 mt-1">
              Còn lại: <span className="text-orange-600 font-bold">{item.quantity}</span>
            </Text>
          </div>

          <Button
            size="small"
            loading={isLoading}
            className={`h-8 font-bold rounded-lg text-xs min-w-[80px] shadow-sm active:scale-95 transition-transform ${
              isSaved
                ? 'bg-green-600 text-white shadow-green-100'
                : 'bg-[#D83231] text-white shadow-red-100'
            }`}
            onClick={handleButtonClick}
          >
            {isSaved ? 'Dùng ngay' : 'Lấy voucher'}
          </Button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.is_saved === nextProps.item.is_saved &&
      prevProps.item.quantity === nextProps.item.quantity
    );
  }
);

const FlashSaleList = () => {
  const { flashSales, fetchFlashSales } = usePublicStore();
  const { saveVoucher } = useMyWallet();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchFlashSales();
  }, [fetchFlashSales]);

  const handleSaveVoucher = async (id: number): Promise<boolean> => {
    const result: any = await saveVoucher(id);
    if (result.success) {
      openSnackbar({
        text: '⚡ ' + result.message,
        type: 'success',
        duration: 3000,
        position: 'top',
      });
      return true;
    } else {
      openSnackbar({
        text: '❌ ' + (result.message || 'Lỗi khi lưu voucher'),
        type: 'error',
        duration: 3000,
        position: 'top',
      });
      return false;
    }
  };

  if (!flashSales || flashSales.length === 0) return null;
  return (
    <div className="bg-white mb-2 pb-6 pt-2 border-t border-gray-50">
      <Box px={4} className="flex justify-between items-end mb-3">
        <div className="flex items-center gap-1">
          <Text.Title
            size="normal"
            className="font-extrabold text-gray-800 uppercase tracking-tight"
          >
            ⚡ FLASH SALE
          </Text.Title>
          <span className="text-orange-500 font-bold text-sm bg-orange-50 px-1.5 rounded-full border border-orange-100">
            {flashSales.length}
          </span>
        </div>

        <Text
          size="small"
          className="text-red-500 font-medium cursor-pointer active:opacity-60 hover:underline"
          onClick={() => navigate('/voucher')}
        >
          Xem tất cả
        </Text>
      </Box>

      <div className="flex overflow-x-auto px-4 gap-3 pb-2 scrollbar-hide snap-x">
        {flashSales.slice(0, 6).map((item) => (
          <FlashSaleItem key={item.id} item={item} onSave={handleSaveVoucher} />
        ))}
      </div>
    </div>
  );
};

export default FlashSaleList;
