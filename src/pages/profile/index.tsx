import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Page, Icon, Text, Avatar } from 'zmp-ui';
import { useRecoilState } from 'recoil';
import { userState } from '@/states/state';
import { useStore } from '@/hooks/useStore';
import { getUserInfo, getAccessToken } from 'zmp-sdk';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const { myVouchers, fetchMyWallet } = useStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSyncUser = useCallback(async () => {
    if (loading || user) return;
    setLoading(true);
    try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true, avatarType: 'normal' });
      if (userInfo) {
        try {
          const token = await getAccessToken({});
          await api.post(
            '/api/user/sync',
            { name: userInfo.name, avatar: userInfo.avatar },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error(err);
        }
        setUser({ id: userInfo.id, name: userInfo.name, avatar: userInfo.avatar });
      }
    } catch (error) {
      console.log('User denied');
    } finally {
      setLoading(false);
    }
  }, [user, loading, setUser]);

  const handleProtectedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      handleSyncUser();
    }
  };

  useEffect(() => {
    if (!user) handleSyncUser();
    fetchMyWallet();
  }, []);

  const voucherStats = useMemo(() => {
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

  const mockStats = {
    favorites: 12,
    checkin: 23,
    badges: 4,
    points: 850,
    maxPoints: 1000,
    rank: 'Vàng',
  };

  const recentStores = [
    {
      id: 1,
      name: 'ZStation Coffee',
      time: '2 giờ trước',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80',
    },
    {
      id: 2,
      name: 'K Coffee',
      time: 'Hôm qua',
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80',
    },
  ];

  const StatBox = ({ num, label, onClick, color = 'text-red-500' }: any) => (
    <div
      onClick={() => handleProtectedAction(onClick || (() => {}))}
      className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-gray-50 active:scale-95 transition-transform h-24 cursor-pointer"
    >
      <Text className={`font-bold text-xl mb-1 ${color}`}>{num}</Text>
      <Text size="xxSmall" className="text-gray-500 text-center leading-3">
        {label}
      </Text>
    </div>
  );

  const SettingItem = ({ icon, label, isLast = false, onClick }: any) => (
    <div
      className={`flex items-center p-4 active:bg-gray-50 cursor-pointer ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-8 flex justify-center text-gray-500 text-lg mr-3">{icon}</div>
      <Text className="flex-1 font-medium text-gray-700 text-sm">{label}</Text>
      <MdOutlineKeyboardArrowRight className="text-gray-400 text-xl" />
    </div>
  );

  return (
    <Page className="bg-[#F4F5F7] h-full pb-24 overflow-y-auto">
      <div
        className="bg-white p-5 pt-12 pb-6 flex items-center gap-4 cursor-pointer"
        onClick={!user ? handleSyncUser : undefined}
      >
        <div className="relative">
          <Avatar
            src={user?.avatar || 'https://i.imgur.com/8Km9tLL.png'}
            size={64}
            className="border-2 border-red-50"
          >
            {user ? '' : 'U'}
          </Avatar>
        </div>
        <div className="flex-1">
          <Text.Title size="normal" className="font-extrabold text-gray-800">
            {user ? user.name : 'Đăng nhập / Đăng ký'}
          </Text.Title>
          <div className="flex items-center gap-1 mt-1">
            {user ? (
              <>
                <div className="flex text-yellow-400 text-[10px]">★★★★★</div>
                <Text size="xxSmall" className="text-gray-400">
                  Thành viên thân thiết
                </Text>
              </>
            ) : (
              <Text size="xxSmall" className="text-blue-500 font-medium">
                Chạm để đồng bộ tài khoản
              </Text>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 -mt-2 space-y-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="zi-poll-solid" className="text-pink-500" size={18} />
            <Text className="font-bold text-sm uppercase text-gray-700">Thẻ thành viên</Text>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-4 text-white shadow-lg shadow-yellow-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-bold text-lg">Hạng: {mockStats.rank}</div>
                  <div className="text-xs opacity-90">
                    {user ? mockStats.points : 0}/{mockStats.maxPoints} điểm
                  </div>
                </div>
                <FaCrown className="text-yellow-100 text-3xl opacity-50" />
              </div>

              <div className="w-full h-1.5 bg-black/10 rounded-full mt-2 mb-2 overflow-hidden">
                <div
                  className="h-full bg-white opacity-80 rounded-full"
                  style={{
                    width: user ? `${(mockStats.points / mockStats.maxPoints) * 100}%` : '0%',
                  }}
                ></div>
              </div>

              <div className="text-[10px] opacity-90 font-medium">
                {user ? 'Ưu đãi: Giảm thêm 5% mọi hóa đơn' : 'Đăng nhập để tích điểm'}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatBox
            num={voucherStats.saved}
            label="Voucher đã lưu"
            onClick={() => navigate('/my-voucher')}
          />

          <StatBox
            num={mockStats.favorites}
            label="Yêu thích"
            onClick={() => console.log('Chuyển trang Yêu thích cũ')}
          />

          <StatBox num={mockStats.checkin} label="Check-in" onClick={() => {}} />

          <StatBox num={mockStats.badges} label="Badge" onClick={() => {}} />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Icon icon="zi-note" className="text-orange-500" />
              <Text className="font-bold text-sm uppercase text-gray-700">Voucher của tôi</Text>
            </div>
            <Text
              size="small"
              className="text-red-500 font-medium cursor-pointer active:opacity-60"
              onClick={() => handleProtectedAction(() => navigate('/my-voucher'))}
            >
              Xem tất cả
            </Text>
          </div>

          <div className="flex text-center divide-x divide-gray-100">
            <div
              className="flex-1 cursor-pointer active:opacity-60"
              onClick={() => handleProtectedAction(() => navigate('/my-voucher'))}
            >
              <div className="text-xl font-bold text-red-500">{voucherStats.saved}</div>
              <div className="text-[10px] text-gray-400 mt-1">Đang lưu</div>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-green-500">{voucherStats.used}</div>
              <div className="text-[10px] text-gray-400 mt-1">Đã sử dụng</div>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-orange-500">{voucherStats.expiring}</div>
              <div className="text-[10px] text-gray-400 mt-1">Sắp hết hạn</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="zi-location" className="text-blue-500" />
            <Text className="font-bold text-sm uppercase text-gray-700">Quán đã xem gần đây</Text>
          </div>

          <div className="space-y-4">
            {recentStores.map((store) => (
              <div
                key={store.id}
                className="flex items-center gap-3 active:opacity-60 cursor-pointer"
                onClick={() => navigate(`/store/${store.id}`)}
              >
                <img
                  src={store.img}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                  alt=""
                />
                <div className="flex-1 border-b border-gray-50 pb-2">
                  <div className="flex justify-between items-center">
                    <Text className="font-bold text-gray-800 text-sm">{store.name}</Text>
                    <MdOutlineKeyboardArrowRight className="text-gray-400" />
                  </div>
                  <Text size="xxSmall" className="text-gray-400">
                    {store.time}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="p-4 pb-2 flex items-center gap-2">
            <Icon icon="zi-setting" className="text-gray-400" />
            <Text className="font-bold text-sm uppercase text-gray-700">Cài đặt</Text>
          </div>

          <div>
            <SettingItem
              icon={<FaMapMarkerAlt />}
              label="Địa chỉ đã lưu"
              onClick={() => handleProtectedAction(() => console.log('Chức năng địa chỉ cũ'))}
            />
            <SettingItem icon={<Icon icon="zi-poll-solid" />} label="Đăng ký cửa hàng" />

            <SettingItem icon={<Icon icon="zi-notif-ring" />} label="Thông báo" />
            <SettingItem icon={<Icon icon="zi-lock" />} label="Quyền riêng tư" />
            <SettingItem icon={<Icon icon="zi-poll-solid" />} label="Trung tâm trợ giúp" />

            {user && (
              <SettingItem
                icon={<Icon icon="zi-leave" />}
                label="Đăng xuất"
                isLast
                onClick={(e: any) => {
                  e.stopPropagation();
                  setUser(null);
                  navigate('/welcome');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
