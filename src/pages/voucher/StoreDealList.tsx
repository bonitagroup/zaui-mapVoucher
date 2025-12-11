import React from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import { useNavigate } from 'react-router-dom';

const StoreDealItem = ({ store }: { store: Store }) => {
  const navigate = useNavigate();
  // Filter voucher thường (không phải flash sale)
  const normalVouchers = store.vouchers?.filter((v) => v.type !== 'FLASH_SALE') || [];
  const voucherCount = normalVouchers.length;

  // Fake rating vì trong model chưa có
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 100) + 10;

  if (voucherCount === 0) return null;

  return (
    <div className="bg-white p-4 border-b border-gray-50 last:border-none flex gap-4">
      {/* Ảnh quán (Vuông bo góc) */}
      <div className="w-28 h-28 flex-shrink-0">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover rounded-xl bg-gray-100 border border-gray-100"
          alt={store.name}
        />
      </div>

      {/* Thông tin bên phải */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Text.Title size="small" className="font-bold text-gray-800 line-clamp-1 uppercase">
          {store.name}
        </Text.Title>

        {/* Rating */}
        <div className="flex items-center gap-1 my-1">
          <div className="flex text-yellow-400 text-xs">
            {'★★★★★'.split('').map((s, i) => (
              <span
                key={i}
                className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
          </div>
          <Text size="xxSmall" className="text-gray-500">
            {rating} ({reviewCount} đánh giá)
          </Text>
        </div>

        {/* Badge số lượng ưu đãi */}
        <div className="mb-2">
          <span className="bg-pink-50 text-pink-500 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
            {voucherCount} ưu đãi đang có
          </span>
        </div>

        {/* List voucher text (tối đa 2 dòng) */}
        <div className="mb-3 space-y-0.5">
          {normalVouchers.slice(0, 2).map((v) => (
            <div key={v.id} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <Text size="xxSmall" className="text-gray-500 line-clamp-1">
                {v.title}
              </Text>
            </div>
          ))}
          {voucherCount > 2 && (
            <Text size="xxSmall" className="text-gray-400 italic pl-2.5">
              + {voucherCount - 2} ưu đãi khác...
            </Text>
          )}
        </div>

        {/* Nút Xem chi tiết */}
        <div className="mt-auto">
          <Button
            size="small"
            className="bg-[#D83231] text-white font-bold h-7 text-xs rounded-full px-4"
            onClick={() => navigate(`/store/${store.id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

const StoreDealList = ({ stores }: { stores: Store[] }) => {
  // Lọc chỉ những quán có voucher
  const storesWithDeals = stores.filter((s) => s.vouchers && s.vouchers.length > 0);

  return (
    <Box className="bg-white mt-2 pb-20">
      <div className="p-4 pb-0 flex justify-between items-end">
        <div className="flex items-center gap-2">
          <Icon icon="zi-poll-solid" className="text-pink-500 font-bold" />
          <div>
            <Text.Title size="normal" className="font-extrabold uppercase text-gray-800">
              Ưu đãi dành cho bạn
            </Text.Title>
            <Text size="xxSmall" className="text-gray-400">
              {storesWithDeals.length} cửa hàng • 5km quanh bạn
            </Text>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {storesWithDeals.map((store) => (
          <StoreDealItem key={store.id} store={store} />
        ))}
      </div>

      {storesWithDeals.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          Không tìm thấy ưu đãi nào quanh đây :(
        </div>
      )}
    </Box>
  );
};

export default StoreDealList;
