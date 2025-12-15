import api from './api';
import { ApiResponse } from '@/types/api';
import { Store, Voucher, FlashSaleItem } from '@/types/store';
import { CATEGORY_LABELS } from '@/constants/categories';

interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  category?: string;
}

const CATEGORY_MAPPING: Record<string, string> = {
  [CATEGORY_LABELS.SPORT]: 'sport',
  [CATEGORY_LABELS.PLAYGROUND]: 'playground',
  [CATEGORY_LABELS.HEALTH]: 'health',
  [CATEGORY_LABELS.SERVICE]: 'service',
  [CATEGORY_LABELS.FOOD]: 'food|drink',
  [CATEGORY_LABELS.DRINK]: 'drink',
};

export const storeService = {
  // 1. Lấy danh sách quán gần đây
  getNearby: (params: NearbyParams) => {
    let categoryParam = params.category;

    if (categoryParam === CATEGORY_LABELS.ALL || categoryParam === CATEGORY_LABELS.FLASH_SALE) {
      categoryParam = 'Tất cả';
    } else if (categoryParam && CATEGORY_MAPPING[categoryParam]) {
      categoryParam = CATEGORY_MAPPING[categoryParam];
    }

    return api.get('/api/store/nearby', {
      params: {
        ...params,
        category: categoryParam,
        radius: params.radius || 10,
      },
    }) as Promise<ApiResponse<Store[]>>;
  },

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
  getFlashSales: (accessToken: string, category?: string) => {
    const categoryParam =
      category === CATEGORY_LABELS.ALL || category === CATEGORY_LABELS.FLASH_SALE
        ? 'Tất cả'
        : category;
    return api.get('/api/store/flash-sale', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { category: categoryParam },
    }) as Promise<ApiResponse<FlashSaleItem[]>>;
  },

  // 8. Lấy chi tiết quán
  getDetail: (id: string | number) =>
    api.get(`/api/store/detail/${id}`) as Promise<ApiResponse<Store>>,
};
