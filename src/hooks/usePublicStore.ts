import { useState, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { storesState, selectedStoreState, userLocationState, flashSaleState } from '@/states/state';
import { getAccessToken } from 'zmp-sdk';
import { storeService } from '@/services/store.service';

export const usePublicStore = () => {
  const [stores, setStores] = useRecoilState(storesState);
  const [selectedStore, setSelectedStore] = useRecoilState(selectedStoreState);
  const userLocation = useRecoilValue(userLocationState);
  const [flashSales, setFlashSales] = useRecoilState(flashSaleState);
  const [loading, setLoading] = useState(false);

  const fetchNearby = useCallback(
    async (params?: { lat?: number; lng?: number; category?: string; forceRefresh?: boolean }) => {
      const lat = params?.lat || userLocation[0];
      const lng = params?.lng || userLocation[1];
      const category = params?.category || 'Tất cả';

      if (stores.length > 0 && !params?.forceRefresh && category === 'Tất cả') return;

      if (!lat || !lng) return;

      setLoading(true);
      try {
        const res = await storeService.getNearby({ lat, lng, category });

        if (res.data) {
          setStores(res.data);
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
        const res = await storeService.search(keyword);
        if (res.data) {
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

  const fetchFlashSales = useCallback(async () => {
    try {
      const accessToken = await getAccessToken({});
      const res = await storeService.getFlashSales(accessToken);

      if (res.data) {
        setFlashSales(res.data);
      }
    } catch (error) {
      console.error('Lỗi lấy Flash Sale:', error);
    }
  }, [setFlashSales]);

  return {
    stores,
    selectedStore,
    setSelectedStore,
    flashSales,
    loading,
    fetchNearby,
    search,
    fetchFlashSales,
  };
};
