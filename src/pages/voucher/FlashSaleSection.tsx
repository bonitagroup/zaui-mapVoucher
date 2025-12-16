import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Icon } from 'zmp-ui';
import { useStore } from '@/hooks/useStore';
import { formatCountdown, formatDateVN } from '@/utils/dateFormatter';
import { FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Định nghĩa Props rõ ràng (nếu có thể) thay vì any
interface FlashSaleItemProps {
  item: any;
  onSave: (id: number) => Promise<any>; // Giả sử onSave trả về Promise
}

const FlashSaleCard = React.memo(({ item, onSave }: FlashSaleItemProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  // Khởi tạo state dựa trên props, nhưng cần cập nhật nếu props thay đổi (nhưng với flash sale thì ít khi đổi trạng thái saved từ ngoài vào ngay lập tức)
  const [isSaved, setIsSaved] = useState(!!item.is_saved);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Tối ưu Timer: Chỉ chạy khi cần thiết
  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(item.end_date).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) return '00:00:00'; // Xử lý khi hết giờ
      return formatCountdown(diff);
    };

    setTimeLeft(calculateTime());

    // Dùng interval là ok, nhưng nhớ clear
    const timer = setInterval(() => {
      const remaining = calculateTime();
      setTimeLeft(remaining);
      if (remaining === '00:00:00') clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [item.end_date]);

  // Sync state nếu data gốc thay đổi (ví dụ khi load lại trang)
  useEffect(() => {
    setIsSaved(!!item.is_saved);
  }, [item.is_saved]);

  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      // 1. QUAN TRỌNG: Ngăn chặn sự kiện click lan ra thẻ cha (div navigate)
      e.stopPropagation();

      // 2. Chặn spam click hoặc đã lưu rồi
      if (isSaved || isLoading) return;

      setIsLoading(true);
      try {
        // 3. Gọi hàm save và đợi kết quả thực tế
        const result = await onSave(item.id);

        // Kiểm tra kết quả trả về (tuỳ vào api của bạn trả về true/false hay object)
        if (result && (result === true || result.success)) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Lỗi lưu voucher', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isSaved, isLoading, item.id, onSave]
  );

  const handleNavigate = useCallback(() => {
    navigate(`/store/${item.store_id}`);
  }, [navigate, item.store_id]);

  return (
    <div
      className="relative bg-white rounded-xl shadow-sm mb-3 overflow-hidden flex border border-l-8 border-b-4 border-red-500 active:scale-[0.98] transition-transform cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="flex-1 p-2 pl-3 flex flex-col justify-between min-w-0">
        <div className="flex items-start mb-1">
          <div className="bg-[#D83231] text-white text-[11px] font-bold px-1.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
            <FaBolt className="text-yellow-300 text-[10px]" />
            <span>{item.discount}</span>
            <span className="opacity-60 text-[10px]">•</span>
            <span className="font-mono tracking-wide">{timeLeft}</span>
          </div>
        </div>

        <div className="pr-1">
          <Text className="font-extrabold text-gray-900 text-[15px] uppercase leading-tight line-clamp-1 mb-0.5">
            {item.store_name}
          </Text>
          <Text className="font-medium text-gray-600 text-xs leading-tight line-clamp-2">
            {item.title}
          </Text>
        </div>

        <div className="mt-2 text-[12px] text-gray-400 font-medium flex items-center gap-1">
          Áp dụng từ {formatDateVN(item.end_date)}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between p-2 pl-0 gap-2 w-[90px] flex-shrink-0 border-gray-200 ml-1 relative">
        <div className="bg-[#D83231] text-white text-[10px] w-[95px] text-center font-bold px-1 py-1 rounded">
          {item.code || 'CODE'}
        </div>

        <div className="border border-[#D83231] text-[#D83231] bg-white text-[12px] font-bold text-center w-[95px] px-4 py-0.5 rounded">
          SL: {item.quantity}
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || isSaved}
          className={`
            flex flex-col items-center justify-center w-[95px] py-1.5 px-1 rounded-lg transition-all 
            ${
              isSaved
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-[#D83231] text-white shadow-md shadow-red-200 active:scale-95 hover:bg-red-700'
            }
          `}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white animate-spin rounded-full my-0.5"></div>
          ) : (
            <>
              <Box className="flex flex-wrap items-center">
                <Icon icon={isSaved ? 'zi-check' : 'zi-bookmark'} size={16} />
                <span className="text-[13px] font-medium leading-none">
                  {isSaved ? 'ĐÃ LƯU' : 'LƯU'}
                </span>
              </Box>
              <span className="text-[12px] font-medium leading-none">VOUCHER</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

const FlashSaleSection = ({ flashSales }: { flashSales: any[] }) => {
  const { saveVoucher } = useStore();

  if (!flashSales || flashSales.length === 0) return null;

  return (
    <Box className="bg-white px-4 py-4 mb-2 rounded-b-xl shadow-sm border-t border-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <FaBolt className="text-[#D83231] animate-pulse" />
        <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase">
          FLASH SALE ĐANG DIỄN RA
        </Text.Title>
      </div>

      <div className="flex flex-col">
        {flashSales.slice(0, 3).map((item) => (
          <FlashSaleCard key={item.id} item={item} onSave={saveVoucher} />
        ))}
      </div>
    </Box>
  );
};

export default FlashSaleSection;
