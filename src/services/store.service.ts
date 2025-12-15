import api from './api';
import { ApiResponse } from '@/types/api';
import { Store, Voucher, FlashSaleItem } from '@/types/store';

interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  category?: string;
}

export const storeService = {
  // 1. Lấy danh sách quán
  getNearby: (params: NearbyParams) =>
    api.get('/api/store/nearby', {
      params: { ...params, radius: params.radius || 10 },
    }) as Promise<ApiResponse<Store[]>>,

  // 2. Tìm kiếm quán
  search: (keyword: string) =>
    api.get('/api/store/search', { params: { q: keyword } }) as Promise<ApiResponse<Store[]>>,

  // 3. Lấy ví voucher
  getMyWallet: (accessToken: string) =>
    api.get('/api/store/my-wallet', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }) as Promise<ApiResponse<Voucher[]>>,

  // 4. Lưu voucher
  saveVoucher: (voucherId: number, accessToken: string) =>
    api.post(
      '/api/store/save',
      { voucherId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ) as Promise<ApiResponse<null>>,

  // 5. Hủy lưu voucher
  unsaveVoucher: (voucherId: number, accessToken: string) =>
    api.post(
      '/api/store/unsave',
      { voucherId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ) as Promise<ApiResponse<null>>,

  // 6. Sử dụng voucher
  useVoucher: (voucherId: number, accessToken: string) =>
    api.post(
      '/api/store/use',
      { voucherId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ) as Promise<ApiResponse<null>>,

  // 7. Lấy Flash Sale
  getFlashSales: (accessToken: string, category?: string) =>
    api.get('/api/store/flash-sale', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { category },
    }) as Promise<ApiResponse<FlashSaleItem[]>>,

  // 8. Lấy chi tiết quán
  getDetail: (id: string | number) =>
    api.get(`/api/store/detail/${id}`) as Promise<ApiResponse<Store>>,
};
