import { atom } from 'recoil';
import { Store } from '@/types/store';

export const userLocationState = atom<[number, number]>({
  key: 'userLocationState',
  default: [21.597631, 105.840984],
});

export const locationLoadingState = atom<boolean>({
  key: 'locationLoadingState',
  default: false,
});

export const storesState = atom<any[]>({
  key: 'storesState',
  default: [],
});

export const myVouchersState = atom<any[]>({
  key: 'myVouchersState',
  default: [],
});

export const selectedStoreState = atom<Store | null>({
  key: 'selectedStoreState',
  default: null,
});
