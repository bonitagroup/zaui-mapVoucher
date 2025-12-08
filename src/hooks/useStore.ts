import { useState, useEffect, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  storesState,
  myVouchersState,
  selectedStoreState,
  userLocationState,
} from '@/states/state';
import { getUserInfo, showToast } from 'zmp-sdk';
import api from '@/services/api';
import { Store } from '@/types/store';

export const useStore = () => {
  const [stores, setStores] = useRecoilState(storesState);
  const [myVouchers, setMyVouchers] = useRecoilState(myVouchersState);
  const [selectedStore, setSelectedStore] = useRecoilState(selectedStoreState);
  const userLocation = useRecoilValue(userLocationState);

  const [loading, setLoading] = useState(false);

  const fetchNearby = useCallback(async () => {
    if (!userLocation[0] || !userLocation[1]) return;

    setLoading(true);
    try {
      const res: any = await api.get('/api/store/nearby', {
        params: {
          lat: userLocation[0],
          lng: userLocation[1],
          radius: 10,
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
  }, [userLocation, setStores]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

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
      const { userInfo } = await getUserInfo({});
      if (!userInfo.id) return;

      const res: any = await api.get('/api/store/my-wallet', {
        params: { zaloId: userInfo.id },
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
        const { userInfo } = await getUserInfo({});
        if (!userInfo.id) {
          return;
        }

        const res: any = await api.post('/api/store/save', {
          zaloId: userInfo.id,
          voucherId: voucherId,
        });

        if (res && res.success) {
          fetchMyWallet();
        }
      } catch (error: any) {
        console.error('Lỗi lưu voucher:', error);
        const msg = error?.response?.data?.error || 'Lỗi hệ thống';
      }
    },
    [fetchMyWallet]
  );

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
  };
};
