import {
  FaLayerGroup,
  FaHeartbeat,
  FaConciergeBell,
  FaUtensils,
  FaTicketAlt,
  FaBolt,
  FaRunning,
  FaGamepad,
} from 'react-icons/fa';
import { RiDrinks2Fill } from 'react-icons/ri';

export const CATEGORY_LABELS = {
  ALL: 'Tất cả',
  VOUCHERHOT: 'Voucher Hot',
  FLASH_SALE: 'Flash Sale',
  HEALTH: 'Sức khỏe',
  SERVICE: 'Dịch vụ',
  FOOD: 'Ăn uống',
  DRINK: 'Đồ uống',
  SPORT: 'Thể thao',
  PLAYGROUND: 'Giải trí',
};

// 1. CONFIG CHO NÚT LỌC (HÌNH PHỄU) - Giữ nguyên các danh mục quán
export const MAP_CATEGORY_CONFIG = [
  {
    key: 'ALL',
    label: CATEGORY_LABELS.ALL,
    icon: <FaLayerGroup />,
    color: 'bg-gray-600',
    activeColor: 'bg-white',
    ringColor: 'ring-gray-100',
  },
  {
    key: 'FOOD',
    label: CATEGORY_LABELS.FOOD,
    icon: <FaUtensils />,
    color: 'bg-red-500',
    activeColor: 'bg-red-500',
    ringColor: 'ring-red-100',
  },
  {
    key: 'HEALTH',
    label: CATEGORY_LABELS.HEALTH,
    icon: <FaHeartbeat />,
    color: 'bg-pink-500',
    activeColor: 'bg-pink-500',
    ringColor: 'ring-pink-100',
  },
  {
    key: 'SERVICE',
    label: CATEGORY_LABELS.SERVICE,
    icon: <FaConciergeBell />,
    color: 'bg-blue-500',
    activeColor: 'bg-blue-500',
    ringColor: 'ring-blue-100',
  },
  {
    key: 'SPORT',
    label: CATEGORY_LABELS.SPORT,
    icon: <FaRunning />,
    color: 'bg-cyan-500',
    activeColor: 'bg-cyan-500',
    ringColor: 'ring-cyan-100',
  },
  {
    key: 'PLAYGROUND',
    label: CATEGORY_LABELS.PLAYGROUND,
    icon: <FaGamepad />,
    color: 'bg-purple-500',
    activeColor: 'bg-purple-500',
    ringColor: 'ring-purple-100',
  },
];

export const TOP_BAR_FILTERS = [
  {
    key: 'ALL',
    label: CATEGORY_LABELS.VOUCHERHOT,
    icon: <FaTicketAlt />,
    color: 'bg-red-500',
  },
  {
    key: 'FLASH_SALE',
    label: CATEGORY_LABELS.FLASH_SALE,
    icon: <FaBolt />,
    color: 'bg-yellow-400',
  },
];

export const VOUCHER_TABS = [CATEGORY_LABELS.ALL, CATEGORY_LABELS.FLASH_SALE];
