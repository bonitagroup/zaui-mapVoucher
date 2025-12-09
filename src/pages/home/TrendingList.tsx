import React from 'react';
import { Text, Box, Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/state';

const TrendingCard = ({ store, onClick }: { store: Store; onClick: () => void }) => {
  const maxDiscount = React.useMemo(() => {
    if (!store.vouchers || store.vouchers.length === 0) return null;

    const percentVouchers = store.vouchers.filter((v) => Number(v.discount_percent) > 0);
    if (percentVouchers.length > 0) {
      const max = Math.max(...percentVouchers.map((v) => Number(v.discount_percent)));
      return `-${max}%`;
    }
    return null;
  }, [store.vouchers]);

  const rating = (Math.random() * (5 - 3) + 3).toFixed(1);
  const reviews = Math.floor(Math.random() * 100);

  return (
    <div
      className="flex-shrink-0 w-[140px] flex flex-col bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden active:opacity-70 transition-opacity"
      onClick={onClick}
    >
      <div className="h-[100px] w-full relative bg-gray-200">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover"
          alt={store.name}
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
        />
        {store.distance !== undefined && (
          <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
            {store.distance < 1
              ? `${(store.distance * 1000).toFixed(0)}m`
              : `${store.distance.toFixed(1)}km`}
          </div>
        )}
      </div>

      <div className="p-2 flex flex-col flex-1">
        <Text className="font-bold text-sm text-gray-800 line-clamp-1 mb-1">{store.name}</Text>

        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-yellow-400 text-[10px]">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon="zi-star-solid"
                size={10}
                className={i < Math.round(Number(rating)) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <Text size="xxSmall" className="text-gray-400 text-[10px]">
            {reviews} reviews
          </Text>
        </div>
        <div className="mt-2 mb-2 flex flex-wrap gap-1">
          {store.vouchers && store.vouchers.length > 0 && (
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Đang có {store.vouchers.length} voucher
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <Text className="text-red-500 font-bold text-xs">
            {store.distance ? `${store.distance.toFixed(1)}km` : 'Gần đây'}
          </Text>

          {maxDiscount && (
            <div className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
              {maxDiscount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrendingList = ({ stores, loading }: { stores: any[]; loading: boolean }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const skeletons = [1, 2, 3];

  return (
    <div className="bg-white mb-2 pb-4 pt-2">
      <Box px={4} mb={4} className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
          <img
            src={user?.avatar || 'https://i.imgur.com/8Km9tLL.png'}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <Text className="font-bold text-gray-800 text-lg">
              Chào {user ? user.name.split(' ').pop() : 'bạn'}! 👋
            </Text>
          </div>
          <Text size="small" className="text-gray-500">
            Bạn muốn ăn gì hôm nay?
          </Text>
        </div>
      </Box>

      <Box px={4} className="flex justify-between items-end mb-3">
        <Text.Title size="normal" className="font-extrabold text-gray-800 uppercase tracking-tight">
          ĐANG HOT GẦN BẠN
        </Text.Title>
        <Text
          size="small"
          className="text-red-500 font-medium cursor-pointer active:opacity-60"
          onClick={() => navigate('/map')}
        >
          Xem tất cả
        </Text>
      </Box>

      <div className="flex overflow-x-auto px-4 gap-3 pb-2 scrollbar-hide snap-x">
        {loading ? (
          skeletons.map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[140px] h-[180px] bg-gray-100 rounded-lg animate-pulse"
            />
          ))
        ) : stores && stores.length > 0 ? (
          stores.map((store) => (
            <TrendingCard
              key={store.id}
              store={store}
              onClick={() => {
                navigate(`/store/${store.id}`);
              }}
            />
          ))
        ) : (
          <div className="text-gray-400 text-sm italic w-full text-center py-4">
            Chưa có quán nào quanh đây
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingList;
