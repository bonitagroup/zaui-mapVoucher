import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { login, getLocation, getAccessToken } from 'zmp-sdk';
import api from '@/services/api';
import { userLocationState, locationLoadingState } from '@/states/state';

export const useUserLocation = () => {
  const [position, setPosition] = useRecoilState(userLocationState);
  const [loading, setLoading] = useRecoilState(locationLoadingState);

  const refreshLocation = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      await login({});

      const locationRes: any = await new Promise((resolve) => {
        getLocation({
          success: (data) => resolve(data),
          fail: (err) => resolve(err),
        });
      });

      const { latitude, longitude, lat, lng, token } = locationRes;
      const finalLat = latitude || lat;
      const finalLng = longitude || lng;

      if (finalLat && finalLng) {
        setPosition([parseFloat(finalLat), parseFloat(finalLng)]);
        return;
      }

      if (!token) {
        throw new Error('Vui lòng cấp quyền vị trí để sử dụng.');
      }

      const accessToken = await getAccessToken({});

      const data: any = await api.post('/api/zalo/location', {
        accessToken,
        locationToken: token,
      });

      if (data && data.lat && data.lng) {
        setPosition([data.lat, data.lng]);
      } else {
        throw new Error('Không xác định được vị trí từ Server.');
      }
    } catch (err: any) {
      console.error('Lỗi định vị:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, setPosition, setLoading]);

  useEffect(() => {
    if (position[0] === 21.597631 && position[1] === 105.840984) {
      refreshLocation();
    }
  }, [position, refreshLocation]);

  return {
    position,
    loading,
    refreshLocation,
  };
};
