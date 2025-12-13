export interface Voucher {
  id: number;
  voucher_id?: number;
  title: string;
  code: string;
  discount: string;
  discount_percent?: number;
  end_date: string;
  type: 'DEFAULT' | 'FLASH_SALE';
  store_name?: string;
  status?: 'UNUSED' | 'USED';
  saved_at?: string;
  holding_time?: number;
}

export interface FlashSaleItem extends Voucher {
  quantity: number;
  is_saved: boolean;
  store_id: number;
  image?: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image?: string;
  category?: string;
  vouchers?: Voucher[];
  distance?: number;
}
