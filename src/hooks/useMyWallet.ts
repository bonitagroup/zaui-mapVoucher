import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { myVouchersState } from '@/states/state';
import { getAccessToken } from 'zmp-sdk';
import { storeService } from '@/services/store.service';

export const useMyWallet = () => {
  const [myVouchers, setMyVouchers] = useRecoilState(myVouchersState);
  const [loading, setLoading] = useState(false);

  const fetchMyWallet = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken({});
      const res = await storeService.getMyWallet(accessToken);

      if (res.data) {
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
        const res = await storeService.saveVoucher(voucherId, accessToken);

        if (res.success) {
          fetchMyWallet();
          return { success: true, message: 'Lưu thành công!' };
        }
        return { success: false, message: res.message || 'Không thể lưu voucher' };
      } catch (error: any) {
        console.error('Lỗi lưu voucher:', error);
        const msg = error?.response?.data?.error || 'Lỗi hệ thống';
        return { success: false, message: msg };
      }
    },
    [fetchMyWallet]
  );

  const useVoucher = useCallback(
    async (voucherId: number) => {
      try {
        const accessToken = await getAccessToken({});
        const res = await storeService.useVoucher(voucherId, accessToken);
        if (res.success) {
          fetchMyWallet();
          return { success: true };
        }
        return { success: false, message: res.message };
      } catch (error: any) {
        return { success: false, message: error?.response?.data?.error || 'Lỗi hệ thống' };
      }
    },
    [fetchMyWallet]
  );

  const unsaveVoucher = useCallback(
    async (voucherId: number) => {
      try {
        const accessToken = await getAccessToken({});
        const res = await storeService.unsaveVoucher(voucherId, accessToken);
        if (res.success) {
          fetchMyWallet();
          return { success: true };
        }
        return { success: false, message: res.message };
      } catch (error: any) {
        return { success: false, message: error?.response?.data?.error || 'Lỗi hủy lưu' };
      }
    },
    [fetchMyWallet]
  );

  return {
    myVouchers,
    loading,
    fetchMyWallet,
    saveVoucher,
    unsaveVoucher,
    useVoucher,
  };
};
