// FILE: src/hooks/useUserLocation.ts
import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { login, getLocation, getAccessToken, showToast } from 'zmp-sdk';
// SỬA: Import api default thay vì import named export cũ
import api from '@/services/api';
import { userLocationState, locationLoadingState } from '@/states/state';

export const useUserLocation = () => {
  const [position, setPosition] = useRecoilState(userLocationState);
  const [loading, setLoading] = useRecoilState(locationLoadingState);

  const refreshLocation = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Login để lấy phiên làm việc
      await login({});

      // 2. Gọi SDK lấy vị trí từ Zalo (GPS điện thoại)
      const locationRes: any = await new Promise((resolve) => {
        getLocation({
          success: (data) => resolve(data),
          fail: (err) => resolve(err),
        });
      });

      const { latitude, longitude, lat, lng, token } = locationRes;
      const finalLat = latitude || lat;
      const finalLng = longitude || lng;

      // Nếu Zalo trả về luôn toạ độ (Android/iOS mới thường có ngay)
      if (finalLat && finalLng) {
        setPosition([parseFloat(finalLat), parseFloat(finalLng)]);
        return;
      }

      // Nếu Zalo chỉ trả về token (cần giải mã qua Server)
      if (!token) {
        throw new Error('Vui lòng cấp quyền vị trí để sử dụng.');
      }

      const accessToken = await getAccessToken({});

      // --- SỬA LỖI TẠI ĐÂY ---
      // Gọi trực tiếp api.post thay vì hàm getLocationFromBackend cũ
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
      // Có thể hiện Toast lỗi nhẹ nhàng
      // showToast({ message: 'Không lấy được vị trí chính xác', type: 'warning' });
    } finally {
      setLoading(false);
    }
  }, [loading, setPosition, setLoading]);

  // Tự động refresh nếu đang ở toạ độ mặc định (Thái Nguyên)
  useEffect(() => {
    // Check toạ độ mặc định trong state.ts [21.5864415, 105.8425114]
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
