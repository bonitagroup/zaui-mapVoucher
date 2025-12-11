import React, { useMemo } from 'react';
import { Text, Box, Icon } from 'zmp-ui';
import { Store } from '@/types/store';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState, myVouchersState } from '@/states/state';
import { FaCrown, FaChevronRight } from 'react-icons/fa';

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

  const rating = useMemo(() => (Math.random() * (5 - 4) + 4).toFixed(1), []);
  const reviewCount = useMemo(() => (Math.random() * 100).toFixed(0), []);

  return (
    <div
      className="flex-shrink-0 w-[150px] flex flex-col bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden active:scale-[0.98] transition-all duration-300 snap-center"
      onClick={onClick}
    >
      <div className="h-[150px] w-full relative">
        <img
          src={store.image || 'https://via.placeholder.com/150'}
          className="w-full h-full object-cover"
          alt={store.name}
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
        />
        {store.distance !== undefined && (
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
            {store.distance < 1
              ? `${(store.distance * 1000).toFixed(0)}m`
              : `${store.distance.toFixed(1)}km`}
          </div>
        )}
        {maxDiscount && (
          <div className="absolute bottom-0 right-0 bg-[#D83231] text-white text-[10px] font-bold px-2 py-1 rounded-tl-lg">
            Giảm {maxDiscount}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <Text className="font-bold text-sm text-gray-800 line-clamp-1 mb-1">{store.name}</Text>
        <div className="flex items-center gap-1 mb-2">
          <Icon icon="zi-star-solid" className="text-yellow-400 text-[10px]" />
          <span className="text-[10px] font-bold text-gray-700">{rating}</span>
          <span className="text-[10px] text-gray-400">• {reviewCount} đánh giá</span>
        </div>
        <div className="mt-auto flex flex-wrap flex-col gap-1">
          {store.vouchers && store.vouchers.length > 0 ? (
            <>
              <div className="flex items-center justify-start gap-1 w-max bg-red-50 px-1.5 py-0.5 rounded text-red-500 text-[10px] font-bold border border-red-100">
                <Icon icon="zi-poll-solid" size={10} />
                {store.vouchers.length} ưu đãi
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1 mt-auto">
              <span className="text-[10px] text-gray-400 italic">Chưa có ưu đãi</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatItem = ({
  value,
  label,
  colorClass,
  onClick,
}: {
  value: number;
  label: string;
  colorClass: string;
  onClick?: () => void;
}) => (
  <div
    className="flex-1 flex flex-col items-center justify-center py-3 cursor-pointer group active:opacity-60 transition-opacity"
    onClick={onClick}
  >
    <Text className={`font-black text-2xl leading-none mb-1 ${colorClass}`}>{value}</Text>
    <Text size="xxSmall" className="text-gray-500 font-medium tracking-wide">
      {label}
    </Text>
  </div>
);

const TrendingList = ({ stores, loading }: { stores: any[]; loading: boolean }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const myVouchers = useRecoilValue(myVouchersState);

  const skeletons = [1, 2, 3];

  const stats = useMemo(() => {
    const list = Array.isArray(myVouchers) ? myVouchers : [];
    const now = new Date().getTime();
    const saved = list.filter(
      (v) => v.status === 'UNUSED' && new Date(v.end_date).getTime() > now
    ).length;
    const used = list.filter((v) => v.status === 'USED').length;
    const expiring = list.filter((v) => {
      if (v.status !== 'UNUSED') return false;
      const end = new Date(v.end_date).getTime();
      const diffHours = (end - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours < 72;
    }).length;
    return { saved, used, expiring };
  }, [myVouchers]);

  const sortedStores = useMemo(() => {
    if (!stores) return [];
    return [...stores].sort((a, b) => {
      const voucherCountA = a.vouchers?.length || 0;
      const voucherCountB = b.vouchers?.length || 0;

      if (voucherCountB !== voucherCountA) {
        return voucherCountB - voucherCountA;
      }

      const distA = a.distance ?? 9999;
      const distB = b.distance ?? 9999;
      return distA - distB;
    });
  }, [stores]);

  const memberPoints = 850;
  const maxPoints = 1000;
  const progressPercent = (memberPoints / maxPoints) * 100;

  return (
    <div className="bg-white mb-2 pb-6 pt-2 rounded-b-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border-b border-gray-100 relative z-10">
      <Box px={4} mb={4} className="flex justify-between items-center mt-2">
        <div className="flex gap-3 items-center">
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-red-500 to-orange-400">
            <img
              src={user?.avatar || 'https://i.imgur.com/8Km9tLL.png'}
              className="w-full h-full object-cover rounded-full border-2 border-white"
              alt="avatar"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Text className="font-extrabold text-gray-800 text-lg">
                Chào {user ? user.name.split(' ').pop() : 'bạn'}!
              </Text>
              <span className="text-xl">👋</span>
            </div>
            <Text
              size="xxSmall"
              className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-0.5"
            >
              Thành viên thân thiết
            </Text>
          </div>
        </div>
        <div
          className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 active:bg-gray-200"
          onClick={() => navigate('/profile')}
        >
          <Icon icon="zi-chevron-right" />
        </div>
      </Box>

      <Box px={4} mb={5}>
        <div
          className="w-full relative overflow-hidden rounded-2xl p-5 shadow-xl shadow-orange-500/20 active:scale-[0.99] transition-transform"
          style={{
            background: 'linear-gradient(120deg, #F6B025 0%, #E86F21 100%)',
          }}
          onClick={() => navigate('/profile')}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 bottom-0 w-24 h-24 bg-yellow-300 opacity-20 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaCrown className="text-white drop-shadow-sm" />
                  <Text className="text-white font-bold text-lg tracking-wide uppercase drop-shadow-md">
                    Hạng Vàng
                  </Text>
                </div>
              </div>
              <div className="text-right flex flex-wrap">
                <Text className="text-white font-black text-2xl leading-none drop-shadow-md">
                  {memberPoints}
                </Text>
              </div>
            </div>
            <div className="w-full h-1.5 bg-black/10 rounded-full mt-4 mb-2 backdrop-blur-sm overflow-hidden border border-white/10">
              <div
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <Text size="xxSmall" className="text-white/90 font-medium">
                Mục tiêu: {maxPoints} điểm
              </Text>
              <Text size="xxSmall" className="text-white font-bold flex items-center gap-1">
                Xem ưu đãi <FaChevronRight size={10} />
              </Text>
            </div>
          </div>
        </div>
      </Box>

      <Box px={4} mb={6}>
        <div className="bg-white rounded-2xl p-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="flex items-center justify-between mb-2 border-b border-gray-50 pb-2 px-1">
            <Text.Title
              size="small"
              className="font-bold text-gray-800 uppercase text-xs tracking-wider"
            >
              Ví Voucher
            </Text.Title>
            <Text
              size="xxSmall"
              className="text-[#D83231] font-bold cursor-pointer"
              onClick={() => navigate('/my-voucher')}
            >
              Xem tất cả
            </Text>
          </div>

          <div className="flex divide-x divide-gray-100">
            <StatItem
              value={stats.saved}
              label="Khả dụng"
              colorClass="text-[#D83231]"
              onClick={() => navigate('/my-voucher')}
            />
            <StatItem value={stats.used} label="Đã dùng" colorClass="text-green-600" />
            <StatItem value={stats.expiring} label="Sắp hết" colorClass="text-orange-500" />
          </div>
        </div>
      </Box>

      <Box px={4} className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <Text.Title
            size="large"
            className="font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-2"
          >
            HOT GẦN BẠN <span className="text-2xl not-italic">🔥</span>
          </Text.Title>
          <Text size="xxSmall" className="text-gray-400">
            Ưu tiên quán nhiều voucher nhất
          </Text>
        </div>
        <div
          className="flex items-center gap-1 text-gray-500 text-xs font-medium bg-gray-100 px-3 py-1.5 rounded-full active:bg-gray-200 transition-colors"
          onClick={() => navigate('/map')}
        >
          Xem tất cả <FaChevronRight size={10} />
        </div>
      </Box>

      <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
        {loading ? (
          skeletons.map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[150px] h-[200px] bg-gray-100 rounded-xl animate-pulse"
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
          <div className="w-full py-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 mx-4">
            <Icon icon="zi-location" className="mb-2 text-2xl opacity-50" />
            <Text size="small">Chưa có quán nào quanh đây</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingList;
