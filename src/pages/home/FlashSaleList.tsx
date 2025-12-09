// FILE: src/pages/home/FlashSaleList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import { useNavigate } from 'react-router-dom';

// Component con: Hiển thị từng Card Flash Sale
const FlashSaleItem = ({ item, onSave }: { item: any; onSave: (id: number) => void }) => {
  const [timeLeft, setTimeLeft] = useState('');

  // Logic đếm ngược
  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(item.end_date).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) return 'Đã kết thúc';

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const h = hours.toString().padStart(2, '0');
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    setTimeLeft(calculateTime()); // Chạy ngay lần đầu
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [item.end_date]);

  return (
    <div className="bg-[#FFF5F1] p-3 rounded-xl border border-orange-100 mb-3 last:mb-0 shadow-sm">
      {/* Badge giảm giá + Đồng hồ */}
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Icon icon="zi-poll" size={12} />
          <span>{item.discount}</span>
          <span className="opacity-60">|</span>
          <span className="font-mono">{timeLeft}</span>
        </div>
      </div>

      {/* Thông tin Voucher */}
      <div className="mb-2">
        <Text className="font-bold text-gray-800 text-sm line-clamp-1">
          {item.store_name} - {item.title}
        </Text>
        <Text size="xxSmall" className="text-gray-500 mt-0.5">
          Số lượng còn lại: <span className="text-orange-600 font-bold">{item.quantity}</span>
        </Text>
      </div>

      {/* Nút bấm */}
      <Button
        size="small"
        className="h-8 bg-[#D83231] text-white font-bold rounded-lg text-xs w-[120px] shadow-red-100"
        onClick={() => onSave(item.id)}
      >
        Lưu voucher
      </Button>
    </div>
  );
};

const FlashSaleList = () => {
  const { flashSales, fetchFlashSales, saveVoucher, loading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlashSales();
  }, [fetchFlashSales]);

  if (!flashSales || flashSales.length === 0) return null;

  return (
    <div className="bg-white mb-2 pb-4 pt-2 border-t border-gray-50">
      {/* Header */}
      <Box px={4} className="flex justify-between items-end mb-3">
        <div className="flex items-center gap-1">
          <Text.Title
            size="normal"
            className="font-extrabold text-gray-800 uppercase tracking-tight"
          >
            FLASH SALE
          </Text.Title>
          <span className="text-orange-500 font-bold text-sm">({flashSales.length})</span>
        </div>

        <Text
          size="small"
          className="text-red-500 font-medium cursor-pointer active:opacity-60"
          onClick={() => navigate('/voucher')} // Hoặc trang danh sách full
        >
          Xem tất cả
        </Text>
      </Box>

      {/* Danh sách Flash Sale */}
      <Box px={4}>
        {flashSales.map((item) => (
          <FlashSaleItem key={item.id} item={item} onSave={saveVoucher} />
        ))}
      </Box>
    </div>
  );
};

export default FlashSaleList;
