import React, { useEffect, useState, useCallback } from 'react';
import { Page, Header, List, Icon, Avatar, Box, Text } from 'zmp-ui';
import { useRecoilState } from 'recoil';
import { userState } from '@/states/state';
import { getUserInfo, getAccessToken } from 'zmp-sdk';
import api from '@/services/api';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);

  // --- HÀM 1: XỬ LÝ ĐỒNG BỘ USER (LOGIN) ---
  const handleSyncUser = useCallback(async () => {
    if (loading || user) return;

    setLoading(true);
    try {
      const { userInfo } = await getUserInfo({
        autoRequestPermission: true,
        avatarType: 'normal',
      });

      if (userInfo) {
        try {
          const token = await getAccessToken({});
          await api.post(
            '/api/user/sync',
            {
              name: userInfo.name,
              avatar: userInfo.avatar,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (err) {
          console.error('Lỗi lưu backend:', err);
        }

        setUser({
          id: userInfo.id,
          name: userInfo.name,
          avatar: userInfo.avatar,
        });
      }
    } catch (error) {
      console.log('Người dùng từ chối cấp quyền');
    } finally {
      setLoading(false);
    }
  }, [user, loading, setUser]);

  // --- HÀM 2: BẢO VỆ HÀNH ĐỘNG (Logic mới bạn cần) ---
  // Hàm này nhận vào một hành động (callback).
  // Nếu đã login -> Chạy hành động đó.
  // Nếu chưa login -> Gọi hàm đăng nhập (handleSyncUser).
  const handleProtectedAction = (action: () => void) => {
    if (user) {
      action(); // Đã có user, chạy chức năng
    } else {
      handleSyncUser(); // Chưa có user, hiện popup xin quyền
    }
  };

  // --- TỰ ĐỘNG CHẠY 1 LẦN KHI VÀO TRANG ---
  useEffect(() => {
    if (!user) {
      handleSyncUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page className="bg-gray-100 h-full">
      <Header title="Tài khoản" showBackIcon={true} className="bg-white" />

      {/* --- PHẦN HEADER THÔNG TIN --- */}
      <div
        onClick={handleSyncUser}
        className="bg-white p-4 mt-24 mb-2 flex items-center cursor-pointer active:opacity-70 transition-opacity"
      >
        <div className="relative">
          <Avatar
            size={72}
            story="default"
            online={!!user}
            src={user?.avatar || 'https://i.imgur.com/8Km9tLL.png'}
          >
            {!user?.avatar && 'U'}
          </Avatar>
        </div>

        <Box className="ml-4">
          {user ? (
            <>
              <Text.Title className="font-bold text-lg">{user.name}</Text.Title>
              <Text size="small" className="text-gray-500">
                Thành viên
              </Text>
            </>
          ) : (
            <>
              <Text.Title className="font-bold text-lg text-blue-600">
                {loading ? 'Đang đồng bộ...' : 'Đăng nhập / Đăng ký'}
              </Text.Title>
              <Text size="small" className="text-gray-400">
                {loading ? 'Vui lòng đợi...' : 'Chạm để đồng bộ tài khoản'}
              </Text>
            </>
          )}
        </Box>

        {!user && !loading && <Icon icon="zi-chevron-right" className="ml-auto text-gray-400" />}
      </div>

      {/* --- PHẦN MENU (Luôn hiển thị, nhưng bấm vào sẽ check quyền) --- */}
      <div className="bg-white mb-2">
        <Text.Header className="px-4 py-3 text-gray-500">Tiện ích</Text.Header>
        <List>
          <List.Item
            title="Lịch sử Voucher"
            prefix={<Icon icon="zi-clock-1" className="text-blue-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
            // SỬA Ở ĐÂY: Bọc hành động trong handleProtectedAction
            onClick={() =>
              handleProtectedAction(() => {
                console.log('Chuyển trang lịch sử');
                // navigate('/history');
              })
            }
          />
          <List.Item
            title="Quán ăn yêu thích"
            prefix={<Icon icon="zi-heart" className="text-red-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() =>
              handleProtectedAction(() => {
                console.log('Chuyển trang yêu thích');
              })
            }
          />
          <List.Item
            title="Địa chỉ đã lưu"
            prefix={<Icon icon="zi-location" className="text-green-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() =>
              handleProtectedAction(() => {
                console.log('Chuyển trang địa chỉ');
              })
            }
          />
        </List>
      </div>

      <div className="bg-white">
        <Text.Header className="px-4 py-3 text-gray-500">Hệ thống</Text.Header>
        <List>
          {/* Nút Đăng xuất chỉ hiện khi ĐÃ có user (vì chưa có user thì không logout được) */}
          {user && (
            <List.Item
              title="Đăng xuất"
              prefix={<Icon icon="zi-leave" className="text-red-500" />}
              onClick={(e) => {
                e.stopPropagation();
                setUser(null);
              }}
            />
          )}

          <List.Item
            title="Hỗ trợ & Liên hệ"
            prefix={<Icon icon="zi-call" className="text-gray-500" />}
            suffix={<Icon icon="zi-chevron-right" />}
            // Mục này thường không cần login vẫn xem được, nên không cần bọc hàm bảo vệ
            onClick={() => console.log('Gọi hotline')}
          />
        </List>
      </div>
    </Page>
  );
};

export default ProfilePage;
