import React from 'react';
import { Text, Button } from 'zmp-ui';
import { formatDateVN, formatCountdown } from '@/utils/dateFormatter';

interface VoucherTicketProps {
  item: any;
  onUse: (id: number) => void;
  isHistory?: boolean;
}

const VoucherTicket: React.FC<VoucherTicketProps> = ({ item, onUse, isHistory = false }) => {
  const dateString = formatDateVN(item.end_date);

  const now = new Date().getTime();
  const savedTime = new Date(item.saved_at).getTime();
  const holdingTime = (item.holding_time || 30) * 60 * 1000;
  const endDate = new Date(item.end_date).getTime();

  const expireTime = Math.min(savedTime + holdingTime, endDate);
  const timeLeft = expireTime - now;

  const isFlashSale = item.type === 'FLASH_SALE';

  return (
    <div
      className={`relative flex w-full h-32 mb-4 filter drop-shadow-sm transition-all active:scale-[0.98] ${
        isHistory ? 'opacity-70 grayscale' : ''
      }`}
    >
      <div
        className={`w-[110px] flex flex-col items-center justify-center text-white rounded-l-xl relative ${
          isHistory
            ? 'bg-gray-400'
            : isFlashSale
            ? 'bg-gradient-to-br from-orange-500 to-red-600'
            : 'bg-gradient-to-br from-[#D83231] to-[#ff6b6b]'
        }`}
      >
        <div className="text-2xl font-black">{item.discount}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-90 mt-1">
          {isFlashSale ? 'Flash Sale' : 'Voucher'}
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-[4px]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)',
            backgroundSize: '4px 8px',
          }}
        ></div>
      </div>

      <div className="flex-1 bg-white rounded-r-xl p-3 flex flex-col justify-between relative border border-l-0 border-gray-100">
        <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-100 rounded-full mt-[-8px] z-10"></div>
        <div className="absolute -left-2 bottom-0 w-4 h-4 bg-gray-100 rounded-full mb-[-8px] z-10"></div>

        <div>
          <div className="flex justify-between items-start">
            <Text className="font-bold text-gray-800 line-clamp-1 text-sm flex-1 mr-2">
              {item.title}
            </Text>
          </div>
          <Text size="xxSmall" className="text-gray-500 line-clamp-1 mb-1">
            Tại: {item.store_name}
          </Text>

          {!isHistory && (
            <div className="flex flex-col gap-0.5 mt-1">
              <Text size="xxSmall" className="text-gray-500 font-medium">
                HSD: {dateString}
              </Text>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400">Giữ vé trong:</span>
                <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-1 rounded">
                  {timeLeft > 0 ? formatCountdown(timeLeft) : 'Hết hạn'}
                </span>
              </div>
            </div>
          )}

          {isHistory && (
            <Text size="xxSmall" className="text-gray-400 mt-1">
              Đã hết hạn vào: {dateString}
            </Text>
          )}
        </div>

        <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-2 mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400">Mã code:</span>
            <span className="font-mono font-bold text-gray-700 text-xs select-all">
              {item.code}
            </span>
          </div>

          {!isHistory ? (
            <Button
              size="small"
              className="h-7 text-xs bg-[#D83231] text-white shadow-red-200 shadow-md"
              onClick={() => onUse(item.voucher_id)}
            >
              Dùng ngay
            </Button>
          ) : (
            <span className="text-xs font-bold text-gray-400 px-2 py-1 bg-gray-100 rounded">
              Đã qua
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherTicket;
