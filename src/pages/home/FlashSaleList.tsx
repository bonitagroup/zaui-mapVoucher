import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Icon, useSnackbar } from 'zmp-ui';
import { usePublicStore } from '@/hooks/usePublicStore';
import { useMyWallet } from '@/hooks/useMyWallet';
import { useNavigate } from 'react-router-dom';
import { formatCountdown, formatDateVN } from '@/utils/dateFormatter';
import { FaBolt } from 'react-icons/fa';

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
        if (diff <= 0) return '00:00:00';
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

    const handleButtonClick = async (e) => {
      e.stopPropagation();
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
      <div
        className="relative bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-3 overflow-hidden flex border border-l-8 border-b-4 border-red-500"
        onClick={() => navigate(`/store/${item.store_id}`)}
      >
        <div className="flex-1 p-2 pl-2 flex flex-col justify-between">
          <div className="flex items-start mb-1">
            <div className="bg-[#D83231] text-white text-xs font-semibold px-1 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
              <FaBolt className="text-white text-[10px]" />
              <span>{item.discount}</span>
              <span className="opacity-60 text-[10px]">•</span>
              <span className="font-mono tracking-wide">{timeLeft}</span>
            </div>
          </div>

          <div>
            <Text className="font-extrabold text-gray-900 text-[15px] uppercase leading-tight line-clamp-1 mb-1">
              {item.store_name}
            </Text>
            <Text className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
              {item.title}
            </Text>
          </div>

          <div className="mt-2 text-xs text-gray-500 font-medium">
            Áp dụng đến {formatDateVN(item.end_date)}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between p-3 pl-0 gap-2 min-w-[75px]">
          <div className="bg-[#D83231] text-white text-[10px] w-[95px] text-center font-bold px-1 py-1 rounded">
            {item.code || 'CODE'}
          </div>

          <div className="border border-[#D83231] text-[#D83231] bg-white text-[12px] font-bold text-center w-[95px] px-4 py-0.5 rounded">
            SL: {item.quantity}
          </div>

          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`flex flex-col items-center justify-center w-full py-1 px-1 rounded-md transition-all active:scale-95 ${
              isSaved
                ? 'bg-gray-200 text-gray-500'
                : 'bg-[#D83231] text-white shadow-md shadow-red-100'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full mb-1"></div>
            ) : (
              <Box className="flex flex-wrap items-center">
                <Icon icon={isSaved ? 'zi-check' : 'zi-bookmark'} size={16} />
                <span className="text-[11px] font-medium leading-none mt-0.5">
                  {isSaved ? 'ĐÃ LƯU' : 'LƯU'}
                </span>
              </Box>
            )}
            <span className="text-[12px] font-medium leading-none mt-0.5">VOUCHER</span>
          </button>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.is_saved === next.item.is_saved &&
    prev.item.quantity === next.item.quantity
);

const FlashSaleList = () => {
  const { flashSales } = usePublicStore();
  const { saveVoucher } = useMyWallet();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

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
        text: '❌ ' + (result.message || 'Lỗi'),
        type: 'error',
        duration: 3000,
        position: 'top',
      });
      return false;
    }
  };

  const hasData = flashSales && flashSales.length > 0;

  return (
    <div className="bg-white mb-2 pt-4 pb-4">
      <Box px={4} className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase">
            FLASH SALE
          </Text.Title>
          <span className="text-[#D83231] font-bold text-lg">({flashSales.length})</span>
        </div>

        <Text
          size="large"
          className="text-[#D83231] font-bold cursor-pointer active:opacity-60 hover:underline"
          onClick={() => navigate('/voucher')}
        >
          Xem tất cả
        </Text>
      </Box>

      {hasData ? (
        <div className="px-4 flex flex-col gap-1">
          {flashSales.slice(0, 5).map((item) => (
            <FlashSaleItem key={item.id} item={item} onSave={handleSaveVoucher} />
          ))}
        </div>
      ) : (
        <div className="px-4">
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Icon icon="zi-clock-2" className="text-gray-400" size={24} />
            </div>
            <Text className="text-gray-500 font-bold text-sm mb-1">
              Chưa có Flash Sale nào diễn ra
            </Text>
            <Text size="xxSmall" className="text-gray-400">
              Vui lòng quay lại vào khung giờ vàng nhé!
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSaleList;
