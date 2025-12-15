import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { getLocation, getAccessToken, login } from 'zmp-sdk';
import api from '@/services/api';
import {
  userLocationState,
  locationLoadingState,
  locationPermissionDeniedState,
} from '@/states/state';

const PERMISSION_KEY = 'location_permission_granted';

// === ĐOẠN CODE THÊM MỚI ĐỂ TEST ===
const IS_DEV_MODE = true;
const FAKE_POSITION = { lat: 21.587631, lng: 105.840984 };
// ===================================

export const useUserLocation = () => {
  const [position, setPosition] = useRecoilState(userLocationState);
  const [loading, setLoading] = useRecoilState(locationLoadingState);
  const [isDenied, setIsDenied] = useRecoilState(locationPermissionDeniedState);

  const performGetLocation = useCallback(async () => {
    setLoading(true);
    setIsDenied(false);

    // === ĐOẠN CODE THÊM MỚI ĐỂ TEST ===
    if (IS_DEV_MODE) {
      console.log('⚠️ Đang chạy chế độ DEV: Dùng tọa độ giả lập!');
      await new Promise((r) => setTimeout(r, 500));

      setPosition([FAKE_POSITION.lat, FAKE_POSITION.lng]);
      setLoading(false);
      return true; // Báo là thành công luôn
    }
    // ===================================

    try {
      await login({});

      const locationRes: any = await new Promise((resolve, reject) => {
        getLocation({
          success: (data) => resolve(data),
          fail: (err) => reject(err),
        });
      });

      const { latitude, longitude, lat, lng, token } = locationRes;
      const finalLat = latitude || lat;
      const finalLng = longitude || lng;

      if (finalLat && finalLng) {
        setPosition([parseFloat(finalLat), parseFloat(finalLng)]);
        return true;
      }

      if (!token) throw new Error('Cần quyền vị trí');

      const accessToken = await getAccessToken({});
      const data: any = await api.post('/api/zalo/location', {
        accessToken,
        locationToken: token,
      });

      if (data && data.lat && data.lng) {
        setPosition([data.lat, data.lng]);
        return true;
      } else {
        throw new Error('Lỗi Server location');
      }
    } catch (err: any) {
      console.error('User từ chối hoặc lỗi:', err);
      setIsDenied(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPosition, setIsDenied]);

  const checkLocationSilent = useCallback(async () => {
    // === ĐOẠN CODE THÊM MỚI ĐỂ TEST ===
    if (IS_DEV_MODE) {
      await performGetLocation();
      return;
    }
    // ===================================

    const hasGranted = localStorage.getItem(PERMISSION_KEY);
    if (hasGranted === 'true') {
      await performGetLocation();
    }
  }, [performGetLocation]);

  const requestLocationForce = useCallback(async () => {
    const success = await performGetLocation();
    if (success) {
      localStorage.setItem(PERMISSION_KEY, 'true');
      setIsDenied(false);
    }
  }, [performGetLocation, setIsDenied]);

  return {
    position,
    loading,
    isDenied,
    checkLocationSilent,
    requestLocationForce,
  };
};
