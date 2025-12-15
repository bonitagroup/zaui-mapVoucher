import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import { Store } from '@/types/store';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import voucherMiniIcon from '../../static/icon voucher .svg';

interface StoreListItemProps {
  store: Store;
  onSelect?: (store: Store) => void;
  isSelected?: boolean;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ store, onSelect, isSelected }) => {
  const navigate = useNavigate();

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/store/${store.id}`);
  };

  // Hàm xử lý khi bấm vào cả cái thẻ
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(store);
    }
  };

  return (
    <div
      id={`store-item-${store.id}`}
      className={`bg-white border rounded-xl p-2 flex gap-3 shadow-sm active:opacity-90 transition-all duration-300 cursor-pointer ${
        isSelected ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-red-200'
      }`}
      onClick={handleCardClick}
    >
      <div className="w-24 h-24 flex-shrink-0 relative">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover rounded-lg bg-gray-100 border border-red-500"
          alt={store.name}
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <Text.Title size="small" className="font-bold text-gray-800 line-clamp-1 flex-1 pr-2">
              {store.name}
            </Text.Title>
            <Text size="xSmall" className="text-red-500 font-bold whitespace-nowrap">
              {store.distance ? `${store.distance.toFixed(1)} km` : ''}
            </Text>
          </div>

          <Text size="xxSmall" className="text-gray-500 mb-1">
            {store.category || 'Nhà hàng'}
            <span className="text-yellow-500 inline-flex items-center gap-0.5 pl-2">
              <div className="flex flex-row">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <FaStar key={index} size={10} />
                  ))}
              </div>
            </span>
          </Text>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <img
              src={voucherMiniIcon}
              className="w-full h-full object-contain"
              alt="voucher-icon"
            />

            <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-extrabold z-10 pt-1 pl-3 pb-2">
              {store.vouchers?.length || 0}
            </span>
          </div>

          <Button
            size="small"
            className="h-8 bg-[#D83231] text-white font-bold text-xs rounded-lg px-3 shadow-red-100 shadow-md border-none"
            onClick={handleViewDetail}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StoreListItem);
