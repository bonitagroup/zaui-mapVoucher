import React, { useMemo } from 'react';
import { Text, Box, Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '@/states/state';
import { FaChevronRight, FaFire } from 'react-icons/fa';
import TrendingCard from '@/components/TrendingCard';

const TrendingList = ({ stores, loading }: { stores: any[]; loading: boolean }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  const skeletons = [1, 2, 3];

  const sortedStores = useMemo(() => {
    if (!stores) return [];
    return [...stores].sort((a, b) => {
      const countA = a.vouchers?.length || 0;
      const countB = b.vouchers?.length || 0;
      if (countB !== countA) return countB - countA;
      return (a.distance || 9999) - (b.distance || 9999);
    });
  }, [stores]);

  return (
    <div className="bg-white mb-2 pb-2 rounded-b-[14px]">
      <Box
        px={4}
        mb={3}
        className="flex justify-between items-center mt-1 border-b-2 border-gray-100 pb-3"
      >
        <div className="flex gap-3 items-center" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            <img
              src={user?.avatar || 'https://i.imgur.com/8Km9tLL.png'}
              className="w-full h-full object-cover"
              alt="avatar"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <Text className="font-bold text-gray-800 text-base">
                Chào <span className="text-red-500">{user?.name || 'bạn'}</span>
              </Text>
            </div>
            <Text size="xxSmall" className="text-gray-800 font-semibold">
              Bạn muốn ăn gì ? chơi gì ? ở đâu ?
            </Text>
          </div>
        </div>
      </Box>

      <Box px={4} className="flex justify-between items-center mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Text.Title size="small" className="font-extrabold text-gray-800 uppercase italic">
              VOUCHER HOT GẦN BẠN
            </Text.Title>
            <FaFire className="text-orange-500 text-lg animate-pulse" />
          </div>
        </div>

        <div
          className="flex items-center gap-1 text-red-600 text-base font-semibold active:opacity-60"
          onClick={() => navigate('/map')}
        >
          Xem tất cả
        </div>
      </Box>

      <div className="flex overflow-x-auto px-4 gap-2 pb-2 pt-2 scrollbar-hide snap-mandatory">
        {loading ? (
          skeletons.map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[160px] h-[250px] bg-gray-100 rounded-2xl animate-pulse"
            />
          ))
        ) : sortedStores && sortedStores.length > 0 ? (
          sortedStores.map((store) => (
            <TrendingCard
              key={store.id}
              store={store}
              onClick={() => navigate(`/store/${store.id}`)}
            />
          ))
        ) : (
          <div className="w-full py-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Icon icon="zi-location" className="mb-1 text-xl opacity-40" />
            <Text size="small">Chưa có quán nào gần đây</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingList;
