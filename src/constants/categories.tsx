import { FaTicketAlt, FaBolt } from 'react-icons/fa';

export const CATEGORY_LABELS = {
  ALL: 'Voucher', // Đổi tên hiển thị từ 'Tất cả' sang 'Voucher' (Màu Đỏ)
  FLASH_SALE: 'Flash Sale', // Màu Vàng
};

export const MAP_CATEGORY_CONFIG = [
  {
    key: 'ALL',
    label: CATEGORY_LABELS.ALL,
    icon: <FaTicketAlt />, // Icon vé voucher
    color: 'bg-red-500', // Màu đỏ theo yêu cầu
    activeColor: 'bg-red-500',
    ringColor: 'ring-red-100',
  },
  {
    key: 'FLASH_SALE',
    label: CATEGORY_LABELS.FLASH_SALE,
    icon: <FaBolt />, // Icon tia sét
    color: 'bg-yellow-400', // Màu vàng Flash Sale
    activeColor: 'bg-yellow-400',
    ringColor: 'ring-yellow-100',
  },
];

export const VOUCHER_TABS = [CATEGORY_LABELS.ALL, CATEGORY_LABELS.FLASH_SALE];
