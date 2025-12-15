import { atom } from 'recoil';
import { Store } from '@/types/store';
import { User } from '@/types/user';

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

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

export const userLoadingState = atom<boolean>({
  key: 'userLoadingState',
  default: false,
});

export const flashSaleState = atom<any[]>({
  key: 'flashSaleState',
  default: [],
});

export const locationPermissionDeniedState = atom<boolean>({
  key: 'locationPermissionDeniedState',
  default: false,
});
