import { useEffect, useState } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import { formatCountdown } from '@/utils/dateFormatter';

const FlashSaleCard = ({ item }: { item: any }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { saveVoucher } = useStore();

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(item.end_date).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      return formatCountdown(diff);
    };
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [item.end_date]);

  return (
    <div className="bg-[#FFECC7] rounded-xl p-4 mb-4 border border-orange-100 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <Icon icon="zi-poll" size={14} />
          <span>-{item.discount}</span>
          <span className="w-[1px] h-3 bg-white/40 mx-1"></span>
          <span className="font-mono">{timeLeft}</span>
        </div>
      </div>

      <Text.Title size="small" className="font-bold text-gray-800 line-clamp-1 mb-1">
        {item.store_name} - {item.title}
      </Text.Title>

      <Text size="xxSmall" className="text-gray-500 mb-3 line-clamp-1">
        #{item.code} • Áp dụng tất cả chi nhánh
      </Text>

      <Button
        size="small"
        className="bg-[#D83231] text-white font-bold h-8 rounded-full px-6 shadow-red-200"
        onClick={() => saveVoucher(item.id)}
      >
        Lưu voucher
      </Button>

      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-300 opacity-20 rounded-full"></div>
    </div>
  );
};

const FlashSaleSection = ({ flashSales }: { flashSales: any[] }) => {
  if (!flashSales || flashSales.length === 0) return null;
  return (
    <Box className="bg-white p-4 pb-2">
      <div className="flex items-center gap-2 mb-3">
        <Icon icon="zi-poll-solid" className="text-orange-500" />
        <Text.Title size="normal" className="font-extrabold uppercase text-gray-800">
          FLASH SALE ĐANG DIỄN RA
        </Text.Title>
      </div>

      {flashSales.slice(0, 3).map((item) => (
        <FlashSaleCard key={item.id} item={item} />
      ))}
    </Box>
  );
};

export default FlashSaleSection;
