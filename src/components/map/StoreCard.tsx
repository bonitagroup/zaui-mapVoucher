// FILE PATH: src/components/map/StoreCard.tsx
import React, { useCallback } from 'react';
import { Box, Icon, Button, Text as ZText } from 'zmp-ui';
import { Store } from '@/types/store';
import { useNavigate } from 'react-router-dom';
import { FaDirections, FaStar } from 'react-icons/fa';

// Định nghĩa props riêng cho StoreCard
interface StoreCardProps {
  store: Store;
  isSelected: boolean;
  onSelect: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const handleViewDetail = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/store/${store.id}`);
    },
    [navigate, store.id]
  );

  const handleDirections = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Chỉ đường:', store.name);
    },
    [store.name]
  );

  const handleCardClick = useCallback(() => {
    onSelect(store);
  }, [onSelect, store]);

  const hasFlashSale = store.vouchers?.some((v: any) => v.type === 'FLASH_SALE');
  const voucherCount = store.vouchers?.length || 0;

  return (
    <div
      id={`store-card-${store.id}`}
      className={`bg-white rounded-2xl p-3 mb-5 shadow-xl border border-gray-100 flex flex-col h-max w-[55vw] max-w-[300px] shrink-0 snap-center relative transition-all duration-300 ${
        isSelected ? 'ring-2 ring-[#D83231] scale-[1.02]' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-1 group shrink-0">
        <img
          src={store.image || 'https://via.placeholder.com/400x200'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={store.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200')}
        />

        <Box className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {hasFlashSale && (
            <ZText className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Icon icon="zi-poll" size={10} /> Flash Sale
            </ZText>
          )}

          {voucherCount > 0 && (
            <ZText className="bg-[#d83231] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Icon icon="zi-note" size={10} /> {voucherCount} ưu đãi
            </ZText>
          )}
        </Box>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-extrabold text-base text-gray-900 line-clamp-1 mb-1">{store.name}</h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-bold text-gray-800">4.8</span>
          </div>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-xs text-gray-500 line-clamp-1 flex-1">{store.address}</span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            className="flex-1 bg-[#d83231] hover:bg-[#d12323] active:bg-[#a81b1b] text-white font-bold rounded-lg h-9 text-xs shadow-md shadow-pink-100 border-none"
            onClick={handleViewDetail}
          >
            Xem chi tiết
          </Button>

          <div
            className="w-9 h-9 flex items-center justify-center border border-red-100 bg-red-50 rounded-lg text-[#ea4c62] active:scale-95 transition-transform cursor-pointer"
            onClick={handleDirections}
          >
            <FaDirections size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StoreCard, (prev, next) => {
  return prev.store.id === next.store.id && prev.isSelected === next.isSelected;
});
