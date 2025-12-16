// FILE PATH: src/hooks/useUserInit.ts
import { useEffect, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState, userLoadingState } from '@/states/state';
import { getUserInfo, getAccessToken } from 'zmp-sdk';
import { events, EventName } from 'zmp-sdk/apis';
import api from '@/services/api';
import { User } from '@/types/user';

// Thời gian cache để tránh gọi API backend quá nhiều (5 phút)
let lastSyncTime = 0;
const SYNC_COOLDOWN = 5 * 60 * 1000;

// Hàm phụ trợ: Đồng bộ user lên Backend của bạn
const syncUserToBackend = async (zaloUserInfo: {
  name: string;
  avatar: string;
  id: string;
}): Promise<User | null> => {
  try {
    const accessToken = await getAccessToken({});
    const res: any = await api.post(
      '/api/user/sync',
      { name: zaloUserInfo.name, avatar: zaloUserInfo.avatar },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res?.data ?? null;
  } catch (e) {
    console.warn('Lỗi đồng bộ User (có thể bỏ qua nếu offline):', e);
    return null;
  }
};

export const useUserInit = () => {
  const setUser = useSetRecoilState(userState);
  const setLoading = useSetRecoilState(userLoadingState);

  // Hàm khởi tạo chính: requestUI = true (hiện popup), false (kiểm tra ngầm)
  const initializeUser = useCallback(
    async (requestUI = false) => {
      try {
        if (requestUI) setLoading(true);

        // 1. Gọi Zalo SDK
        // Nếu requestUI = false: Nó sẽ chỉ trả về data nếu user ĐÃ cấp quyền trước đó.
        // Nếu chưa cấp quyền, nó sẽ throw error (nhảy xuống catch).
        const { userInfo } = await getUserInfo({
          autoRequestPermission: requestUI,
          avatarType: 'normal',
        });

        if (userInfo) {
          // 2. Logic đồng bộ Backend (chỉ chạy khi cần thiết)
          const now = Date.now();
          let userFromBackend: User | null = null;

          // Chỉ sync khi người dùng chủ động bấm (requestUI=true) hoặc cache hết hạn
          if (requestUI || now - lastSyncTime > SYNC_COOLDOWN) {
            userFromBackend = await syncUserToBackend({
              id: userInfo.id,
              name: userInfo.name,
              avatar: userInfo.avatar,
            });
            if (userFromBackend) lastSyncTime = now;
          }
          if (userFromBackend) {
            setUser(userFromBackend);
          } else {
            setUser({
              id: userInfo.id,
              name: userInfo.name,
              avatar: userInfo.avatar,
            });
          }
        }
      } catch (error) {
        if (requestUI) {
          console.error('User từ chối cấp quyền:', error);
        } else {
          console.log('User chưa đăng nhập (Silent Check)');
        }
      } finally {
        if (requestUI) setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  useEffect(() => {
    initializeUser(false);

    const onAppResume = () => initializeUser(false);
    events.on(EventName.AppResumed, onAppResume);
    events.on(EventName.OpenApp, onAppResume);

    return () => {
      events.off(EventName.AppResumed, onAppResume);
      events.off(EventName.OpenApp, onAppResume);
    };
  }, [initializeUser]);

  return { initializeUser };
};
