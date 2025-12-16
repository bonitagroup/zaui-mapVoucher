import { useEffect, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState, userLoadingState } from '@/states/state';
import { getUserInfo, getAccessToken } from 'zmp-sdk';
import { events, EventName } from 'zmp-sdk/apis';
import api from '@/services/api';
import { User } from '@/types/user';

let lastSyncTime = 0;
const SYNC_COOLDOWN = 5 * 60 * 1000;

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
    async (requestUI = false) => {
      try {
        if (requestUI) {
          setLoading(true);
        }

        const { userInfo } = await getUserInfo({
          autoRequestPermission: requestUI,
          avatarType: 'normal',
        });

        if (userInfo) {
          const now = Date.now();
          let userFromBackend: User | null = null;

          if (now - lastSyncTime > SYNC_COOLDOWN || requestUI) {
            userFromBackend = await syncUserToBackend({
              id: userInfo.id,
              name: userInfo.name,
              avatar: userInfo.avatar,
            });
            if (userFromBackend) {
              lastSyncTime = now;
            }
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
        console.log('Chưa có quyền truy cập thông tin user (Silent check)');
      } finally {
        if (requestUI) {
          setLoading(false);
        }
      }
    },
    [setUser, setLoading]
  );

  useEffect(() => {
    initializeUser(false);

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

  return { initializeUser };
};
