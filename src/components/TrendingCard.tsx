import React, { useMemo } from 'react';
import { Text } from 'zmp-ui';
import { Store } from '@/types/store';
import { FaStar } from 'react-icons/fa';

interface TrendingCardProps {
  store: Store;
  onClick: () => void;
}

const TrendingCard = React.memo(({ store, onClick }: TrendingCardProps) => {
  // Tính toán giảm giá tối đa
  const maxDiscount = useMemo(() => {
    if (!store.vouchers?.length) return null;

    // Lấy voucher có phần trăm giảm giá lớn nhất
    const percentVouchers = store.vouchers.filter((v) => Number(v.discount_percent) > 0);
    if (percentVouchers.length > 0) {
      const max = Math.max(...percentVouchers.map((v) => Number(v.discount_percent)));
      return `-${max}%`;
    }

    // Lấy voucher giảm tiền mặt
    const amountVouchers = store.vouchers.filter((v) => Number((v as any).discount_amount) > 0);
    if (amountVouchers.length > 0) {
      const max = Math.max(...amountVouchers.map((v) => Number((v as any).discount_amount)));
      return `${(max / 1000).toFixed(0)}K`;
    }
    return null;
  }, [store.vouchers]);

  // Format khoảng cách
  const formattedDistance = useMemo(() => {
    if (store.distance === undefined) return '';
    return store.distance < 1
      ? `${(store.distance * 1000).toFixed(0)} m`
      : `${store.distance.toFixed(1)} km`;
  }, [store.distance]);

  return (
    <div
      className="flex-shrink-0 w-[160px] flex flex-col bg-white rounded-2xl overflow-hidden active:opacity-90 transition-all snap-start border border-red-500 shadow-sm relative"
      onClick={onClick}
    >
      <div className="h-[120px] w-full relative">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover"
          alt={store.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
        />
      </div>

      <div className="px-3 pb-3 flex flex-col pt-2">
        <Text className=" font-semibold text-[16px] text-gray-800 line-clamp-1 leading-tight">
          {store.name}
        </Text>

        <Text className="text-sm text-gray-500 line-clamp-1 mb-2">
          {store.category || 'Địa điểm'}
        </Text>

        <div className="flex flex-col items-start gap-2 mt-auto">
          <div className="flex text-yellow-400 text-xs gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          {formattedDistance && (
            <Text className="text-[#D83231] text-sm font-semibold line-clamp-1">
              {formattedDistance}
            </Text>
          )}

          {maxDiscount && (
            <div className="absolute bottom-2 right-2 bg-[#D83231] text-white text-base font-semibold px-2 py-3 rounded-xl z-10 flex items-center justify-center min-w-[40px]">
              {maxDiscount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TrendingCard;
