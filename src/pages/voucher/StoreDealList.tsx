import React, { useMemo } from 'react';
import { Box, Text, Button } from 'zmp-ui';
import { Store } from '@/types/store';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import voucherMiniIcon from '../../static/icon voucher .svg';

const StoreDealItem = React.memo(({ store }: { store: Store }) => {
  const navigate = useNavigate();
  // Lọc voucher thường
  const voucherCount = useMemo(
    () => store.vouchers?.filter((v) => v.type !== 'FLASH_SALE').length || 0,
    [store.vouchers]
  );

  if (voucherCount === 0) return null;

  return (
    <div className="bg-white border border-red-100 rounded-2xl p-3 mb-3 shadow-sm flex gap-3 relative overflow-hidden">
      {/* Ảnh vuông bo tròn */}
      <div className="w-24 h-24 flex-shrink-0 relative rounded-xl overflow-hidden border border-gray-100">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover"
          alt={store.name}
          loading="lazy"
        />
      </div>

      {/* Thông tin */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="flex justify-between items-start">
          <div>
            <Text.Title
              size="small"
              className="font-extrabold text-gray-900 line-clamp-1 text-[15px]"
            >
              {store.name}
            </Text.Title>
            <div className="flex items-center gap-1 mt-0.5">
              <Text size="xxSmall" className="text-gray-500 font-medium">
                {store.category || 'Ăn uống'}
              </Text>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-0.5">
                <FaStar className="text-yellow-400 text-[10px]" />
                <span className="text-[10px] font-bold text-gray-700">4.8</span>
              </div>
            </div>
          </div>
          {/* Khoảng cách */}
          <span className="text-red-500 text-[10px] font-bold whitespace-nowrap mt-1">
            {store.distance ? `${store.distance.toFixed(1)} km` : '0.1 km'}
          </span>
        </div>

        {/* Dòng dưới: Icon Voucher và Nút */}
        <div className="flex justify-between items-end mt-2">
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
            className="bg-[#D83231] hover:bg-[#b92b2a] active:bg-[#9f2423] text-white font-bold h-8 text-xs rounded-lg px-4 shadow-md shadow-red-100 border-none"
            onClick={() => navigate(`/store/${store.id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
});

const StoreDealList = ({ stores }: { stores: Store[] }) => {
  const storesWithDeals = useMemo(
    () => stores.filter((s) => s.vouchers && s.vouchers.length > 0),
    [stores]
  );

  return (
    <Box className="bg-white px-4 pb-24 pt-4 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-t border-gray-50">
      <div className="mb-4">
        <Text.Title size="normal" className="font-extrabold text-[#D83231] uppercase">
          ƯU ĐÃI DÀNH RIÊNG CHO BẠN
        </Text.Title>
        <Text size="xSmall" className="text-gray-500 font-medium mt-0.5">
          {storesWithDeals.length} cửa hàng • 5km quanh bạn
        </Text>
      </div>

      <div className="flex flex-col">
        {storesWithDeals.map((store) => (
          <StoreDealItem key={store.id} store={store} />
        ))}
      </div>

      {storesWithDeals.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm italic">
          Đang cập nhật thêm ưu đãi...
        </div>
      )}
    </Box>
  );
};

export default React.memo(StoreDealList);
