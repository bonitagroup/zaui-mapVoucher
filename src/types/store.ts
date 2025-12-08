export interface Voucher {
  id: number;
  title: string;
  code: string;
  discount: string;
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
  distance?: number; // Khoảng cách tính toán
}
