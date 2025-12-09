import { useEffect, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState, userLoadingState } from '@/states/state';
import { getUserInfo, getAccessToken } from 'zmp-sdk';
import { events, EventName } from 'zmp-sdk/apis';
import api from '@/services/api';
import { User } from '@/types/user';

const syncUserToBackend = async (zaloUserInfo: {
  name: string;
  avatar: string;
  id: string;
}): Promise<User | null> => {
  try {
    const accessToken = await getAccessToken({});

    const res: any = await api.post(
      '/api/user/sync',
      {
        name: zaloUserInfo.name,
        avatar: zaloUserInfo.avatar,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res?.data ?? null;
  } catch (e) {
    console.error('Lỗi đồng bộ User:', e);
    return null;
  }
};

export const useUserInit = () => {
  const setUser = useSetRecoilState(userState);
  const setLoading = useSetRecoilState(userLoadingState);

  const initializeUser = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        const { userInfo } = await getUserInfo({
          autoRequestPermission: true,
          avatarType: 'normal',
        });

        if (userInfo) {
          const userFromBackend = await syncUserToBackend({
            id: userInfo.id,
            name: userInfo.name,
            avatar: userInfo.avatar,
          });

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
        console.error('Lỗi khởi tạo user:', error);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [setUser, setLoading]
  );

  useEffect(() => {
    // Chạy lần đầu khi mount
    initializeUser(true);

    // Chạy lại khi App được mở lại từ background (Resume)
    const onAppResume = () => {
      initializeUser(false);
    };

    events.on(EventName.AppResumed, onAppResume);
    events.on(EventName.OpenApp, onAppResume);

    return () => {
      events.off(EventName.AppResumed, onAppResume);
      events.off(EventName.OpenApp, onAppResume);
    };
  }, [initializeUser]);
};
