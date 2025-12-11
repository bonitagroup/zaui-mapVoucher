import { useState, useEffect, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  storesState,
  myVouchersState,
  selectedStoreState,
  userLocationState,
  flashSaleState,
} from '@/states/state';
import { getAccessToken } from 'zmp-sdk';
import api from '@/services/api';
import { Store } from '@/types/store';

export const useStore = () => {
  const [stores, setStores] = useRecoilState(storesState);
  const [myVouchers, setMyVouchers] = useRecoilState(myVouchersState);
  const [selectedStore, setSelectedStore] = useRecoilState(selectedStoreState);
  const userLocation = useRecoilValue(userLocationState);
  const [flashSales, setFlashSales] = useRecoilState(flashSaleState);
  const [loading, setLoading] = useState(false);

  const fetchNearby = useCallback(
    async (params?: { lat?: number; lng?: number; category?: string }) => {
      // 1. Ưu tiên lấy toạ độ truyền vào, nếu không có thì lấy từ state userLocation
      const lat = params?.lat || userLocation[0];
      const lng = params?.lng || userLocation[1];
      const category = params?.category || 'Tất cả'; // Mặc định là Tất cả

      if (!lat || !lng) return;

      setLoading(true);

      try {
        const res: any = await api.get('/api/store/nearby', {
          params: {
            lat: lat,
            lng: lng,
            radius: 10,
            category: category, // Gửi category lên server
          },
        });

        if (res && Array.isArray(res.data)) {
          setStores(res.data as Store[]);
        } else {
          setStores([]);
        }
      } catch (error) {
        console.error('Lỗi lấy quán gần đây:', error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    },
    [userLocation, setStores]
  );

  const search = useCallback(
    async (keyword: string) => {
      setLoading(true);
      try {
        const res: any = await api.get('/api/store/search', {
          params: { q: keyword },
        });

        if (res && Array.isArray(res.data)) {
          setStores(res.data);
        } else {
          setStores([]);
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    },
    [setStores]
  );

  const fetchMyWallet = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken({});

      const res: any = await api.get('/api/store/my-wallet', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res && Array.isArray(res.data)) {
        setMyVouchers(res.data);
      } else {
        setMyVouchers([]);
      }
    } catch (error) {
      console.error('Lỗi lấy ví:', error);
    } finally {
      setLoading(false);
    }
  }, [setMyVouchers]);

  const saveVoucher = useCallback(
    async (voucherId: number) => {
      try {
        const accessToken = await getAccessToken({});

        const res: any = await api.post(
          '/api/store/save',
          { voucherId: voucherId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res && res.success) {
          fetchMyWallet();
          return { success: true, message: 'Lưu thành công!' };
        }
        return { success: false, message: 'Không thể lưu voucher' };
      } catch (error: any) {
        console.error('Lỗi lưu voucher:', error);
        const msg = error?.response?.data?.error || 'Lỗi hệ thống';
        return { success: false, message: msg };
      }
    },
    [fetchMyWallet]
  );

  const unsaveVoucher = useCallback(
    async (voucherId: number) => {
      try {
        const accessToken = await getAccessToken({});
        const res: any = await api.post(
          '/api/store/unsave',
          { voucherId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (res && res.success) {
          fetchMyWallet();
          return { success: true };
        }
        return { success: false, message: 'Hủy thất bại' };
      } catch (error: any) {
        const msg = error?.response?.data?.error || 'Lỗi không thể hủy';
        return { success: false, message: msg };
      }
    },
    [fetchMyWallet]
  );

  const useVoucher = useCallback(
    async (voucherId: number) => {
      try {
        const accessToken = await getAccessToken({});
        const res: any = await api.post(
          '/api/store/use',
          { voucherId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res && res.success) {
          fetchMyWallet();
          return { success: true };
        }
        return { success: false, message: 'Lỗi không xác định' };
      } catch (error: any) {
        return { success: false, message: error?.response?.data?.error || 'Lỗi hệ thống' };
      }
    },
    [fetchMyWallet]
  );

  const fetchFlashSales = useCallback(async () => {
    try {
      const accessToken = await getAccessToken({});
      const res: any = await api.get('/api/store/flash-sale', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res && Array.isArray(res.data)) {
        setFlashSales(res.data);
      }
    } catch (error) {
      console.error('Lỗi lấy Flash Sale:', error);
    }
  }, [setFlashSales]);

  return {
    stores,
    myVouchers,
    selectedStore,
    setSelectedStore,
    loading,
    fetchNearby,
    search,
    saveVoucher,
    fetchMyWallet,
    unsaveVoucher,
    useVoucher,
    flashSales,
    fetchFlashSales,
  };
};
