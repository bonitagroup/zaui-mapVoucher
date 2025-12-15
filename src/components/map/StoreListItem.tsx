import React, { useMemo } from 'react';
import { Box, Text, Button } from 'zmp-ui';
import { Store } from '@/types/store';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface StoreListItemProps {
  store: Store;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ store }) => {
  const navigate = useNavigate();

  return (
    <div
      id={`store-item-${store.id}`}
      className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 shadow-sm active:opacity-70 transition-opacity"
      onClick={() => navigate(`/store/${store.id}`)}
    >
      <div className="w-24 h-24 flex-shrink-0 relative">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover rounded-lg bg-gray-100"
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
            <Text size="xxSmall" className="text-red-500 font-bold whitespace-nowrap">
              {store.distance ? `${store.distance.toFixed(1)} km` : ''}
            </Text>
          </div>

          <Text size="xxSmall" className="text-gray-500 mb-1">
            {store.category || 'Nhà hàng'}
            <span className="mx-1">•</span>
            <span className="text-yellow-500 inline-flex items-center gap-0.5">
              4.8 <FaStar size={10} />
            </span>
          </Text>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm relative overflow-hidden">
              <span className="border-r border-white/30 pr-1 mr-1 border-dashed">VOUCHER</span>
              <span>{store.vouchers?.length || 0}</span>
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <Button
            size="small"
            className="h-8 bg-[#D83231] text-white font-bold text-xs rounded-lg px-3 shadow-red-100 shadow-md border-none"
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StoreListItem);
